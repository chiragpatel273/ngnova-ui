# NgNova Admin Dashboard

A complete Angular 22 standalone admin dashboard built with NgNova UI and Tailwind CSS.

## Install

```bash
npm install @ngnova/ui @ng-icons/core @ng-icons/heroicons
```

Add the NgNova theme and component source to your global stylesheet:

```css
@import 'tailwindcss';
@source "../node_modules/@ngnova/ui";
@import '@ngnova/ui/styles/theme.css';
```

## Files

- `admin-dashboard.component.html` — complete responsive dashboard markup
- `admin-dashboard.component.ts` — component imports, state, table data, and behavior
- `admin-dashboard.component.css` — component host styles
- `admin-revenue-chart.component.ts` — dependency-free canvas chart used by the dashboard

Copy the files into your Angular application and render `<app-admin-dashboard />`.
