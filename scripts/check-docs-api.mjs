import { readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const docsFile = join(root, 'src', 'app', 'docs', 'docs-data.ts');
const failures = [];

function read(path) {
  return readFileSync(path, 'utf8');
}

function parse(path) {
  return ts.createSourceFile(path, read(path), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
}

function fail(message) {
  failures.push(message);
}

function propertyName(node) {
  if (ts.isIdentifier(node) || ts.isStringLiteral(node)) {
    return node.text;
  }

  return null;
}

function objectProperty(object, name) {
  return object.properties.find(
    (property) => ts.isPropertyAssignment(property) && propertyName(property.name) === name,
  );
}

function stringProperty(object, name) {
  const property = objectProperty(object, name);
  return property && ts.isStringLiteral(property.initializer) ? property.initializer.text : null;
}

function arrayProperty(object, name) {
  const property = objectProperty(object, name);
  return property && ts.isArrayLiteralExpression(property.initializer)
    ? property.initializer.elements
    : [];
}

function findComponentDocs(sourceFile) {
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) {
      continue;
    }

    for (const declaration of statement.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.name.text === 'componentDocs' &&
        declaration.initializer &&
        ts.isArrayLiteralExpression(declaration.initializer)
      ) {
        return declaration.initializer.elements.filter(ts.isObjectLiteralExpression);
      }
    }
  }

  throw new Error('Could not find the componentDocs array.');
}

function documentedApi(entry, kind) {
  return arrayProperty(entry, kind)
    .filter(ts.isObjectLiteralExpression)
    .map((item) => stringProperty(item, 'name'))
    .filter(Boolean)
    .sort();
}

function decorators(node) {
  return ts.canHaveDecorators(node) ? (ts.getDecorators(node) ?? []) : [];
}

function decoratorCall(node, decoratorName) {
  for (const decorator of decorators(node)) {
    if (
      ts.isCallExpression(decorator.expression) &&
      ts.isIdentifier(decorator.expression.expression) &&
      decorator.expression.expression.text === decoratorName
    ) {
      return decorator.expression;
    }
  }

  return null;
}

function aliasFromOptions(expression, fallback) {
  const firstArgument = expression?.arguments[0];

  if (firstArgument && ts.isStringLiteral(firstArgument)) {
    return firstArgument.text;
  }

  if (firstArgument && ts.isObjectLiteralExpression(firstArgument)) {
    return stringProperty(firstArgument, 'alias') ?? fallback;
  }

  return fallback;
}

function aliasFromSignalInput(expression, fallback) {
  const isRequiredInput =
    ts.isPropertyAccessExpression(expression.expression) &&
    expression.expression.name.text === 'required';
  const options = expression.arguments[isRequiredInput ? 0 : 1];

  return options && ts.isObjectLiteralExpression(options)
    ? (stringProperty(options, 'alias') ?? fallback)
    : fallback;
}

function callName(expression) {
  if (!ts.isCallExpression(expression)) {
    return null;
  }

  if (ts.isIdentifier(expression.expression)) {
    return expression.expression.text;
  }

  if (
    ts.isPropertyAccessExpression(expression.expression) &&
    ts.isIdentifier(expression.expression.expression)
  ) {
    return expression.expression.expression.text;
  }

  return null;
}

function declarationSelector(classDeclaration) {
  const declaration =
    decoratorCall(classDeclaration, 'Component') ?? decoratorCall(classDeclaration, 'Directive');
  const metadata = declaration?.arguments[0];
  return metadata && ts.isObjectLiteralExpression(metadata)
    ? stringProperty(metadata, 'selector')
    : null;
}

function declarationApi(component) {
  const inputs = [];
  const outputs = [];

  for (const member of component.members) {
    if (!member.name) {
      continue;
    }

    const name = propertyName(member.name);
    if (!name) {
      continue;
    }

    const inputDecorator = decoratorCall(member, 'Input');
    const outputDecorator = decoratorCall(member, 'Output');

    if (inputDecorator) {
      inputs.push(aliasFromOptions(inputDecorator, name));
    } else if (member.initializer && callName(member.initializer) === 'input') {
      inputs.push(aliasFromSignalInput(member.initializer, name));
    }

    if (outputDecorator) {
      outputs.push(aliasFromOptions(outputDecorator, name));
    } else if (member.initializer && callName(member.initializer) === 'output') {
      outputs.push(aliasFromOptions(member.initializer, name));
    }
  }

  return { inputs: inputs.sort(), outputs: outputs.sort() };
}

function implementedDeclarations(sourceFile) {
  return sourceFile.statements
    .filter(ts.isClassDeclaration)
    .map((component) => {
      const selector = declarationSelector(component);
      return selector ? { selector, ...declarationApi(component) } : null;
    })
    .filter(Boolean);
}

function documentedNameFor(selector, name) {
  if (selector.includes(`[${name}]`)) {
    return name;
  }

  if (selector.startsWith('[') && selector.endsWith(']')) {
    return `${selector} ${name}`;
  }

  return `${selector} ${name}`;
}

function compareApi(slug, kind, implemented, documented) {
  const missing = implemented.filter((name) => !documented.includes(name));
  const unknown = documented.filter((name) => !implemented.includes(name));

  if (missing.length > 0) {
    fail(`${slug}: docs are missing ${kind}: ${missing.join(', ')}`);
  }

  if (unknown.length > 0) {
    fail(`${slug}: docs contain unknown ${kind}: ${unknown.join(', ')}`);
  }
}

const entries = findComponentDocs(parse(docsFile));

for (const entry of entries) {
  const slug = stringProperty(entry, 'slug');
  const selector = stringProperty(entry, 'selector');

  if (!slug || !selector) {
    fail('Every componentDocs entry must have a static slug and selector.');
    continue;
  }

  const sourcePath = join(root, 'projects', 'ui', slug, 'src', `${slug}.ts`);

  try {
    const declarations = implementedDeclarations(parse(sourcePath));
    const primary = declarations.find((declaration) => declaration.selector === selector);

    if (!primary) {
      throw new Error(`Could not find the component with selector ${selector}.`);
    }

    const documentedInputs = documentedApi(entry, 'inputs');
    const documentedOutputs = documentedApi(entry, 'outputs');
    const expectedInputs = [...primary.inputs];
    const expectedOutputs = [...primary.outputs];

    for (const declaration of declarations.filter((item) => item !== primary)) {
      expectedInputs.push(
        ...declaration.inputs.map((name) => documentedNameFor(declaration.selector, name)),
      );

      if (declaration.selector.startsWith('[') && declaration.selector.endsWith(']')) {
        expectedInputs.push(declaration.selector.slice(1, -1));
      }

      expectedOutputs.push(
        ...declaration.outputs.map((name) => documentedNameFor(declaration.selector, name)),
      );
    }

    compareApi(slug, 'inputs', expectedInputs.sort(), documentedInputs);
    compareApi(slug, 'outputs', expectedOutputs.sort(), documentedOutputs);
  } catch (error) {
    fail(
      `${relative(root, sourcePath)}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

if (failures.length > 0) {
  console.error('Docs API consistency check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Docs API consistency check passed for ${entries.length} components.`);
