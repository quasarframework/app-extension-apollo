# app-extension-apollo

## Introduction

This is the official Quasar app extension for adding GraphQL to your Quasar project.

It uses [Apollo Client v4](https://www.apollographql.com/docs/react) and
[Vue Apollo v5](https://github.com/vuejs/apollo).

> **This is the v3 / next branch**, targeting `@quasar/app-vite` v3 (Vite 7).
> For the stable v2 release, install without the `@next` tag.

## Requirements

- `@quasar/app-vite` **v3** (Vite 7)
- **Node 20+**
- **TypeScript 6+** (if using TypeScript)

## Installation

```sh
quasar ext add @quasar/apollo@next
```

Quasar CLI will retrieve the extension from NPM
([@quasar/quasar-app-extension-apollo](https://www.npmjs.com/package/@quasar/quasar-app-extension-apollo))
and scaffold a configuration file into `src/apollo` and a boot file into `src/boot`.

## Migrating from v2

See the [migration guide](docs/migration-v2-to-v3.md) for a full list of breaking changes and
what you gain.

## Config file entry

**Important:** you must manually register the boot file in `quasar.config.js`:

```js
export default configure((/* ctx */) => {
  return {
    boot: [
      'apollo'
    ],
    // ...
  }
})
```

## Prompts

During installation you will be asked whether your app uses GraphQL subscriptions. If yes, you
will be prompted to choose a transport:

- **Web Socket** ([graphql-ws](https://github.com/enisdenjo/graphql-ws))
- **SSE** (Server-Sent Events) ([graphql-sse](https://github.com/enisdenjo/graphql-sse))

The necessary dependencies will be added to your `package.json` and the initialisation code will
be scaffolded for you.

## Uninstall

```sh
quasar ext remove @quasar/apollo
```

You may also want to remove `src/apollo/` and the related boot file manually.

## Apollo client options

Customise the Apollo client in `src/apollo/index.(ts|js)`.

Set the GraphQL endpoint via environment variable or directly in the file:

```sh
GRAPHQL_URI=https://prod.example.com/graphql quasar build
GRAPHQL_URI=https://dev.example.com/graphql quasar dev
```

If you don't have a GraphQL endpoint yet, [FakeQL](https://fakeql.com) or similar services let
you spin one up quickly.

If you use GraphQL subscriptions, also set the subscription endpoint:

```sh
# WebSocket
GRAPHQL_URI=https://prod.example.com/graphql GRAPHQL_URI_WS=wss://prod.example.com/graphql quasar build
GRAPHQL_URI=https://dev.example.com/graphql GRAPHQL_URI_WS=wss://dev.example.com/graphql quasar dev

# SSE
GRAPHQL_URI=https://prod.example.com/graphql GRAPHQL_URI_SSE=https://prod.example.com/graphql/stream quasar build
GRAPHQL_URI=https://dev.example.com/graphql GRAPHQL_URI_SSE=https://dev.example.com/graphql/stream quasar dev
```

You can [use dotenv in quasar.config](https://quasar.dev/quasar-cli-vite/handling-process-env#using-dotenv)
to manage these more conveniently.

## Usage

`src/pages/Index.vue`

```html
<template>
  <q-page class="row items-center justify-evenly">
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else-if="result && result.post">
      <div>id: {{ result.post.id }}</div>
      <div>title: {{ result.post.title }}</div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { gql } from '@apollo/client'

const { result, loading, error } = useQuery(gql`
  query getPost {
    post(id: "3") {
      id
      title
    }
  }
`)
</script>
```

## Multiple Apollo clients

Un-comment the relevant code in `src/boot/apollo.(ts|js)`. Example using `clientA`:

```ts
const { result, loading, error } = useQuery(
  gql`
    query getPost {
      post(id: "3") {
        id
        title
      }
    }
  `,
  null,
  { clientId: 'clientA' },
)
```

## Tooling

An `apollo.config.cjs` file for the
[Apollo GraphQL VSCode extension](https://www.apollographql.com/docs/devtools/editor-plugins/)
(`apollographql.vscode-apollo`) is automatically scaffolded.

Fill in the `client.service.url` property with the URL of your GraphQL server. The extension will
connect to it, read the schema, and provide autocomplete and schema error detection for your
queries.
