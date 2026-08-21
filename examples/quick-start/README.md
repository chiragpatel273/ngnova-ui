# NgNova UI quick start

A minimal, runnable Angular 22 application using the published `@ngnova/ui` package, Tailwind CSS
v4, class-based dark mode, and zoneless change detection.

## Run locally

```bash
cd examples/quick-start
npm install
npm start
```

Open `http://localhost:4200`.

## Production build

```bash
npm run build
```

The example intentionally imports components from focused package entry points:

```ts
import { UiButtonComponent } from '@ngnova/ui/button';
import { UiCardComponent } from '@ngnova/ui/card';
import { UiInputComponent } from '@ngnova/ui/input';
```

Its global stylesheet demonstrates the required Tailwind source configuration and the recommended
NgNova theme contract.
