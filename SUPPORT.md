# Support

NgNova UI is an open-source project maintained on a best-effort basis. This policy explains where
to ask for help and what information makes an issue actionable.

## Supported environments

Use a supported NgNova UI version with the Angular, TypeScript, Node, browser, and assistive
technology combinations in:

- `docs/ANGULAR_COMPATIBILITY.md`
- `docs/BROWSER_AND_AT_SUPPORT.md`
- `docs/CONSUMER_RUNTIME_MATRIX.md`

An issue that only reproduces outside those ranges may be closed or treated as a feature request.

## Choose the right channel

- Search the documentation and existing issues before opening a new report.
- Use a [GitHub issue](https://github.com/chiragpatel273/ngnova-ui/issues/new) for reproducible bugs,
  documentation defects, accessibility problems, or focused feature proposals.
- Use a private
  [security advisory](https://github.com/chiragpatel273/ngnova-ui/security/advisories/new) for
  vulnerabilities. Never post exploit details publicly.

NgNova UI does not currently promise private implementation consulting, application debugging, or
response-time service levels.

## Bug report checklist

Include:

- the smallest reproduction, ideally a public repository;
- `@ngnova/ui`, Angular, Angular CDK, TypeScript, Node, and browser versions;
- whether the app uses SSR, hydration, Zone.js, or zoneless change detection;
- expected and actual behavior;
- console output and relevant screenshots or recordings;
- keyboard and assistive-technology details for accessibility reports; and
- confirmation that the issue reproduces with a supported version.

Avoid screenshots of source code or logs when copyable text is available. Remove secrets and
personal data before sharing a reproduction.

## Triage and fixes

Reports are prioritized by security impact, accessibility blockers, data loss, widespread runtime
failure, and regression risk. A valid issue is not a commitment to a particular release date.
Maintainers may ask for a reduced reproduction or close stale reports that cannot be verified.

Supported fixes follow `docs/VERSIONING_AND_DEPRECATION.md`. Contributions are welcome under
`CONTRIBUTING.md`.
