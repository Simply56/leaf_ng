# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Leaf (`leaf-ng`) is an Angular 21 PWA for tracking when houseplants were last watered. It is a frontend only: all data lives in a separate REST backend (the sibling `../leaf_api` Express server). This repo is one of several frontends for that same API (`../leaf-nest`, `../leaf-start`, `../Leaf`).

## Commands

```bash
npm start              # ng serve, development config, http://localhost:4200
npm run build          # production build to dist/leaf_ng (includes the service worker)
npm run watch          # development build in watch mode
npm run lint           # eslint src   (lint:fix to autofix)
npm run format         # prettier --write on src  (format:check to verify)
npm run deploy         # build + publish to GitHub Pages with --base-href=/leaf_ng/
```

There is no test suite. Spec files and Karma were removed on purpose; the `test` targets in `angular.json`/`project.json` and the `tsconfig.spec.json` reference in `tsconfig.json` are leftovers that point at nothing. Verify changes with `npm run lint`, `npm run format:check`, and `npm run build`.

`nx.json` and `project.json` are also leftovers — Nx was removed and is not installed. Use the `ng` CLI / npm scripts, and treat `angular.json` as the source of truth for build config.

## Backend and auth

- `src/app/environments/environments.ts` holds a hardcoded `useVps` flag that picks the API base URL: the deployed VPS (`true`, the committed default) or a local `leaf_api` at `http://127.0.0.1:3000` (`false`). There are no Angular `fileReplacements`; flip the flag by hand for local backend work and do not commit it flipped.
- Every request carries the API key as an `?apiKey=` query parameter (`PlantsService.buildUrl`). `AuthService.getApiKey()` resolves it in order: in-memory → `localStorage['apiKey']` → `?apiKey=` in the page URL (then persisted) → a blocking `window.prompt`. The resolved key is written onto the mutable `environment.apiKey`.
- `imagePath` from the API is server-relative; `PlantsService.refresh()` prefixes it with `environment.url` and converts `lastWatered` strings to `Date`.

## Architecture

Standalone components, no NgModules, no state library. Zoneless change detection (the Angular 21 default; `zone.js` is not installed), so anything a template shows must be a signal or change in response to a template event — a plain field mutated from a timer, promise or subscription will not re-render.

`PlantsService` (root-provided) is the single store and the only place that talks to HTTP. It exposes three signals — `plants`, `loading`, `error` — and components read them directly in templates. The data flow is deliberately simple:

- The service calls `refresh()` in its constructor, so the first injection triggers the initial load (5 retries, 1s apart).
- Every mutation (`addPlant`, `renamePlant`, `waterPlant`, `deletePlant`, `updatePlantImage`) goes through the private `mutate()` helper, which on success re-fetches the whole list via `refresh()` and on failure sets `error`. There are no optimistic updates and no per-plant fetch; new mutations should follow the same path.
- `error` is rendered as a dismissible banner in the root `App` template, so components do not handle request errors themselves.

Routes (`app.routes.ts`): `''` → `PlantsOverview`, `plant/:id` → `PlantDetails`. `PlantDetails` does not fetch; it derives its plant with a `computed` over `service.plants()` and redirects home via an `effect` once loading finishes without a match. The detail page URL is what users encode into a QR code for the pot, so the `plant/:id` URL shape (and the `?apiKey=` bootstrap) must stay stable.

The "days since watered" display is two chained pipes: `computeWateredDaysAgo` (Date → whole days) then `valueToColor` (days → green-to-red `hsl()` over a 10-day scale, using the `--status-lightness` CSS variable so it works in both themes).

## Styling and theming

- Almost all CSS is global in `src/styles.css`; component stylesheets are tiny and several components have none. The production build errors on any component stylesheet over 8kB (warns at 4kB), so shared styles belong in `styles.css`.
- Colors are CSS custom properties on `:root`. Dark values are defined twice and must be kept in sync: once under `@media (prefers-color-scheme: dark)` for `:root:not([data-theme="light"])`, and once for `:root[data-theme="dark"]`.
- `ThemeService` follows the OS preference until the user toggles, then stores the override in `localStorage['theme']` and sets `data-theme` on `<html>`. An inline script in `src/index.html` applies the stored theme before Angular boots to avoid a flash; changes to the storage key or attribute must be made in both places.

## PWA / deployment

The service worker (`ngsw-config.json`) is enabled only in production builds (`!isDevMode()`), so caching behavior cannot be reproduced under `npm start`. The app is served from the `/leaf_ng/` sub-path on GitHub Pages, so asset and manifest paths must stay relative (no leading `/`).

## Conventions

- 4-space indentation everywhere, single quotes in TypeScript (`.editorconfig`; Prettier picks it up). HTML is formatted with Prettier's `angular` parser.
- Angular 21 naming: files and classes have no `.component`/`Component` suffix (`plants-overview.ts` exports `PlantsOverview`); services are `*-service.ts`, pipes `*-pipe.ts`.
- Templates use the built-in control flow (`@if`, `@for`, `@let`), not structural directives.
