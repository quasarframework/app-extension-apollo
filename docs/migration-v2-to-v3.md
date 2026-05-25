# Migration Guide: v2 → v3

This guide covers migrating from `@quasar/quasar-app-extension-apollo` v2 to v3.

v3 targets:

- `@quasar/app-vite` **v3** (Vite 7)
- `@apollo/client` **v4**
- `@vue/apollo-composable` **v5**
- **Node 20+**
- **TypeScript 6+** (if using TypeScript)

> **Note:** `@vue/apollo-composable` v5 is currently in alpha. It was specifically rewritten for
> Apollo Client v4 and will stabilise alongside it.

---

## What you gain

### Framework-agnostic Apollo core

Apollo Client v4 decouples its core from React entirely. Vue integrations are now first-class
citizens rather than a secondary target. `@apollo/client` itself no longer ships React code into
your bundle — only what you explicitly import from `@apollo/client/react` (or in our case,
`@vue/apollo-composable`) is included.

### Significantly smaller bundles

- **Opt-in local state**: the `LocalState` class (resolvers, client-side directives) is now a
  separate import. If you don't use it, it's never in your bundle.
- **Proper `exports` field**: Apollo v4 ships a complete `package.json` `exports` map, enabling
  deep tree-shaking that wasn't possible in v3. This also means you no longer need deep subpath
  imports with `/index.js` suffixes — the top-level `@apollo/client` export covers everything.
- **No legacy polyfills**: the build targets modern runtimes (Node 20+, browsers since 2023).
  No dead code padding your output.
- **No `rawDefine` workaround**: v2 of this extension had to inject
  `rawDefine: { 'process.env.NODE_ENV': ... }` into the Vite config to work around a CommonJS
  issue in the `graphql` package. Apollo v4 is ESM-only, so this workaround is gone entirely.

### Better loading state model

`useQuery` results now expose a `dataState` property with four precise values:

| Value | Meaning |
|-------|---------|
| `empty` | No data available |
| `partial` | Incomplete cached data (`returnPartialData: true`) |
| `streaming` | Deferred query still receiving chunks |
| `complete` | Fully resolved result |

This replaces the practice of checking `loading`, `data`, and `networkStatus` separately and
reasoning about what combination means what.

`notifyOnNetworkStatusChange` also now defaults to `true`, so network status updates trigger
re-renders without opting in.

### Built-in `@defer` / incremental delivery

Apollo v4 has pluggable incremental delivery handlers for the `@defer` directive:
`Defer20220824Handler` for Apollo Router and `GraphQL17Alpha9Handler` for newer servers.

### Better error handling

Apollo v3 had a single `ApolloError` class that mixed GraphQL errors, network errors, and parse
errors into one object. v4 introduces specific error classes:

| Class | When |
|-------|------|
| `CombinedGraphQLErrors` | One or more `errors` in the GraphQL response |
| `ServerError` | Non-2xx HTTP response with a parseable body |
| `ServerParseError` | Non-2xx HTTP response with an unparseable body |
| `UnconventionalError` | Anything else (thrown values, etc.) |

Each class has a static `.is()` method for type-safe narrowing. Network errors now respect your
`errorPolicy` setting, and a single `error` property replaces the split `graphQLErrors` /
`networkError` pattern.

### Automatic refetch on window focus and reconnect (v4.2+)

`RefetchEventManager` provides event-driven refetching with built-in sources for window focus and
network reconnection. Opt in per query via `refetchOn`.

### Subscription deduplication

`watchFragment` and equivalent subscription operations now deduplicate identical cache watches,
improving efficiency when the same cache object is observed across multiple components.

### Improved TypeScript

- Types are now co-located with their APIs in namespaces (e.g. `useQuery.Options` instead of
  `QueryHookOptions<...>`), making them easier to find.
- Custom context types are declared via TypeScript module augmentation instead of fragile generics.
- Return types now accurately reflect passed options — for example, enabling `returnPartialData`
  correctly types `data` as `DeepPartial<TData>`.
- The unwieldy `TContext` and `TCacheShape` generics have been removed.

### RxJS replaces zen-observable

Apollo v3 shipped its own `zen-observable` fork. v4 uses RxJS, which is the industry standard and
is likely already in your dependency tree. This means Apollo observables now compose naturally
with other RxJS-based code.

---

## Breaking changes in your app

### New peer dependencies

**npm / yarn:**

```sh
npm install @apollo/client@^4 @vue/apollo-composable@^5
yarn add @apollo/client@^4 @vue/apollo-composable@^5
```

**pnpm (preferred for Quasar):**

```sh
pnpm add @apollo/client@^4 @vue/apollo-composable@^5
```

RxJS is a peer dependency of `@apollo/client` v4 and will be installed automatically by your
package manager alongside it. You do not need to list it explicitly **unless** you use the SSE
subscription transport — the scaffolded `SSELink` imports `Observable` from `rxjs` directly,
which requires it to be a declared dependency under pnpm's strict isolation model.

```sh
# SSE transport users only
pnpm add rxjs
```

The extension installer handles this automatically when SSE is selected during `quasar ext add`.

### ApolloClient constructor

The `uri`, `headers`, and `credentials` shorthand options are removed. You must now pass an
explicit `link`:

```diff
- const apolloClient = new ApolloClient({
-   uri: process.env.GRAPHQL_URI || 'http://localhost:3000/graphql',
-   cache: new InMemoryCache(),
- })

+ const httpLink = new HttpLink({
+   uri: process.env.GRAPHQL_URI || 'http://localhost:3000/graphql',
+ })
+
+ const apolloClient = new ApolloClient({
+   link: httpLink,
+   cache: new InMemoryCache(),
+ })
```

`link` is now mandatory. There is no implicit `HttpLink` creation.

### Client name/version → clientAwareness

```diff
  const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
-   name: 'my-app',
-   version: '1.0',
+   clientAwareness: { name: 'my-app', version: '1.0' },
  })
```

### DevTools

```diff
  const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
-   connectToDevTools: true,
+   devtools: { enabled: true },
  })
```

### Link APIs: creator functions → classes

All link creators have been converted to classes:

```diff
- import { createHttpLink } from '@apollo/client'
+ import { HttpLink } from '@apollo/client'

- const httpLink = createHttpLink({ uri: '...' })
+ const httpLink = new HttpLink({ uri: '...' })
```

```diff
- import { createErrorLink } from '@apollo/client'
+ import { ErrorLink } from '@apollo/client'

- const errorLink = createErrorLink(({ graphQLErrors }) => { ... })
+ const errorLink = new ErrorLink(({ graphQLErrors }) => { ... })
```

### Import paths

Apollo v4's proper `exports` map means you no longer need deep subpath imports or `/index.js`
suffixes. Import everything from the top-level package or well-known subpaths:

```diff
- import { createHttpLink } from '@apollo/client/link/http/index.js'
- import { InMemoryCache } from '@apollo/client/cache/index.js'
- import { split } from '@apollo/client/link/core'
- import { ApolloLink } from '@apollo/client/link/core'

+ import { HttpLink, InMemoryCache, split, ApolloLink } from '@apollo/client'
```

`@apollo/client/utilities` and `@apollo/client/link/subscriptions` remain valid subpaths for
`getMainDefinition` and `GraphQLWsLink` respectively.

### Error handling

`ApolloError` is removed. Import specific classes instead:

```diff
- import { ApolloError } from '@apollo/client'
+ import { CombinedGraphQLErrors, ServerError, ServerParseError } from '@apollo/client'

- if (error instanceof ApolloError) { ... }
+ if (CombinedGraphQLErrors.is(error)) { ... }
+ if (ServerError.is(error)) { ... }
```

The single `error` property now unifies what was previously `graphQLErrors` and `networkError`.

### ObservableQuery

`ObservableQuery` no longer inherits from `Observable`. Method chaining is removed — use `.pipe()`
with RxJS operators instead.

### useQuery

`notifyOnNetworkStatusChange` now defaults to `true`. If you relied on the previous `false`
default to avoid re-renders on network status changes, add it explicitly:

```diff
  const { result } = useQuery(MY_QUERY, null, {
+   notifyOnNetworkStatusChange: false,
  })
```

### useLazyQuery

`variables` and `context` are no longer accepted in the hook options — pass them to the execute
function returned by the hook:

```diff
- const [loadPost] = useLazyQuery(GET_POST, { variables: { id } })
+ const [loadPost] = useLazyQuery(GET_POST)

- loadPost()
+ loadPost({ variables: { id } })
```

### useMutation

`ignoreResults` and the `onCompleted` / `onError` callbacks are removed from the hook options:

```diff
  const [addPost] = useMutation(ADD_POST, {
-   ignoreResults: true,
-   onCompleted: (data) => console.log(data),
-   onError: (err) => console.error(err),
  })
```

Handle results and errors from the returned tuple or `await mutate()` instead.

### WebSocketLink removed

Use `GraphQLWsLink` from `graphql-ws` (already the recommended approach since v2 of this
extension):

```diff
- import { WebSocketLink } from '@apollo/client/link/ws'
+ import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
+ import { createClient } from 'graphql-ws'

- const wsLink = new WebSocketLink({ uri: 'wss://...', options: { reconnect: true } })
+ const wsLink = new GraphQLWsLink(createClient({ url: 'wss://...' }))
```

### Local state / resolvers

The `resolvers` option is removed from `ApolloClient`. If you use local state, import `LocalState`
explicitly:

```diff
- const apolloClient = new ApolloClient({
-   link,
-   cache,
-   resolvers: { ... },
- })

+ import { LocalState } from '@apollo/client'
+
+ const apolloClient = new ApolloClient({ link, cache })
+ const localState = new LocalState({ client: apolloClient, resolvers: { ... } })
```

### TypeScript: removed generics

`TContext` and `TCacheShape` generics are removed from all hook and client signatures:

```diff
- import type { ApolloClientOptions } from '@apollo/client'

- return Object.assign({ ... }) as ApolloClientOptions<unknown>
+ return Object.assign({ ... }) as ApolloClientOptions
```

```diff
- useQuery<MyData, MyVars, MyContext>(...)
+ useQuery<MyData, MyVars>(...)
```

Use module augmentation to declare custom context:

```ts
// Declare custom context globally (e.g. in a .d.ts file)
declare module '@apollo/client' {
  interface DefaultContext {
    myCustomField: string
  }
}
```

### TypeScript config

`moduleResolution: "node"` does not support `package.json` `exports` fields, which Apollo v4
relies on. Update your `tsconfig.json`:

```diff
  {
    "compilerOptions": {
-     "module": "esnext",
-     "moduleResolution": "node"
+     "module": "ESNext",
+     "moduleResolution": "bundler"
    }
  }
```

If you use `baseUrl` in your `tsconfig.json`, it is deprecated in TypeScript 6 and will stop
functioning in TypeScript 7. Replace it with explicit paths:

```diff
  {
    "compilerOptions": {
-     "baseUrl": "./src",
-     "paths": { "src/*": ["./*"] }
+     "paths": { "src/*": ["./src/*"] }
    }
  }
```

---

## Automated migration

Apollo provides a codemod that handles the majority of changes automatically:

```sh
npx @apollo/client-codemod-migrate-3-to-4 ./src
```

Run this first, then work through the remaining manual items above.

---

## Extension-level changes (v2 → v3)

Beyond the Apollo Client changes, v3 of this extension itself changes:

- **`@quasar/app-webpack` support dropped** — Quasar is dropping webpack in app-vite v3, so the
  extension is now Vite-only
- **`@quasar/app-vite` v3 required** — minimum version bumped to v3 (Vite 7)
- **`rawDefine` Vite workaround removed** — no longer needed with ESM-only Apollo v4
- **Node 20+** required (Apollo Client v4 build target)
- **TypeScript 6+** recommended — `moduleResolution: "bundler"` and `baseUrl` deprecation fixes
- **Scaffolded `src/apollo/index.(ts|js)`** updated: `new HttpLink()`, imports from top-level
  `@apollo/client`, `as ApolloClientOptions` without generic
- **Scaffolded `src/boot/apollo.(ts|js)`** updated accordingly
- **SSE transport users**: `rxjs` is now scaffolded as an explicit dependency (required because
  the `SSELink` imports `Observable` from `rxjs` directly)

### Re-running the installer

The simplest way to get the updated scaffolded files is to re-run the extension installer:

```sh
quasar ext add @quasar/apollo
```

This will overwrite `src/apollo/index.(ts|js)` and `src/boot/apollo.(ts|js)` with the v3
templates. Back up any customisations you have in those files before running it.
