# v3 Implementation Plan

## 1. `src/index.js` — Extension wiring
- [x] Bump `compatibleWith` to `@quasar/app-vite@^3.0.0-beta.1`
- [x] Remove the `hasWebpack` branch entirely
- [x] Change `conf.build.env` → `conf.build.defineEnv`
- [x] Remove the `rawDefine` / `define` workaround block entirely
- [x] Convert to ESM (`export default`)

## 1a. `src/install.js` + `src/prompts.js` — ESM conversion
- [x] Convert `install.js` to ESM (`createRequire` for JSON, `export default`)
- [x] Remove `hasVite` template variable (Vite-only now, no need to pass it)
- [x] Remove webpack compat checks
- [x] Do not scaffold `rxjs` — peer dep of `@apollo/client`, resolved automatically by the package manager; user code never imports it directly
- [x] Convert `prompts.js` to ESM (`export default`)

## 2. `package.json` — Extension metadata
- [x] Bump version to `3.0.0-beta.1`
- [x] Add `"type": "module"` (ESM package)
- [x] Update peer dependency ranges for `@apollo/client@^4`, `@vue/apollo-composable@^5.0.0-alpha.2`
- [x] Drop `graphql` peer dep to `^16.0.0` only (v15 no longer supported)
- [x] Remove `@quasar/app-webpack` from peer deps / compat entries
- [x] Update devDependency versions to match new peers

## 3. Templates — `src/templates/**/apollo/index.(ts|js)`
- [x] Rewrite Apollo client setup: `new HttpLink()`, imports from top-level `@apollo/client`
- [x] Remove `hasVite` conditional from `BootFileParams` import — always `@quasar/app-vite`
- [x] Update subscription link setup for both `graphql-ws` and `graphql-sse` variants
- [x] SSE link uses `Observable` from `rxjs` (Apollo v4 uses RxJS internally)
- [x] Drop `as ApolloClientOptions<unknown>` cast — `TCacheShape` generic removed in v4
- [x] Remove `/index.js` deep-path suffixes — Apollo v4 has proper exports map

## 4. Templates — `src/templates/**/boot/apollo.(ts|js)`
- [x] Update commented additional-client example: `createHttpLink` → `new HttpLink()`
- [x] Remove unused `createHttpLink` import comment from boot file header

## 4b. `tsconfig.json` (root + template)
- [x] `"moduleResolution": "node"` → `"bundler"` — required for Apollo v4's `exports` map and Vite 7
- [x] `"module": "esnext"` → `"ESNext"` (conventional casing)
- [x] Remove deprecated `"baseUrl"` — paths made self-sufficient with explicit relative paths
- [x] Bump TypeScript devDep to `^6.0.0` — TS 6 is current, TS 7 deprecations already visible

## 4c. `src/install.js` + `package.json` — rxjs for SSE
- [x] Scaffold `rxjs` into user deps only when SSE transport is selected
- [x] Add `rxjs: "^7.0.0"` to extension devDeps so version resolves via `getCompatibleDevDependencies`

## 5. `docs/migration-v2-to-v3.md`
- [x] Add `@vue/apollo-composable` v5 alpha status note
- [x] Peer deps section: pnpm guidance, rxjs conditional for SSE
- [x] New section: import path changes (no deep `/index.js`, top-level `@apollo/client`)
- [x] New section: TypeScript config (`moduleResolution: "bundler"`, `baseUrl` removal)
- [x] `ApolloClientOptions` generic removal (`<unknown>` → no generic)
- [x] Extension-level changes: webpack drop reason, Node 20+, TS 6+, SSE/rxjs note
- [x] Re-running the installer section

## 6. `README.md`
- [x] Add v3/next branch callout and requirements (Node 20+, app-vite v3, TS 6+)
- [x] Installation: `@next` tag, link to migration guide
- [x] Fix `GRAPHQL_WS_URI` → `GRAPHQL_URI_WS` (existing bug), add `GRAPHQL_URI_SSE`
- [x] Remove stale v2.1/v2.2 historical notes
- [x] Usage example: `gql` from `@apollo/client` (not `/core`)
- [x] Clean up tooling section

## 7. Commit & push to `next`
