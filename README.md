# app-extension-apollo

## Introduction

This is the official Quasar app extension for adding GraphQL to your Quasar
project.

This AE uses [Apollo Client](https://www.apollographql.com) and [Vue Apollo](https://v4.apollo.vuejs.org).

## Installation

```sh
quasar ext add @quasar/apollo
```

**NOTE:** As of 2.1.0-beta.1, version 2 is now in the dev and default branch of the repository. It is also the version you'll get with the "normal" `@quasar/apollo` package. No need to use `@next` tag anymore.

> Since 2.1.0-beta.2 we externalized all deps for this AE: `graphql`, `graphql-tag`, `@apollo/client` and `@vue/apollo-composable`. If you installed a previous version, rerun `quasar ext add @quasar/apollo` command to have compatible deps added to your project `package.json`.

Version 1 has been deprecated and is no longer supported. If you wish to use it, you can install it with `@quasar/apollo@1.0.0-beta.8`.

Quasar CLI will retrieve the extension from NPM
([@quasar/quasar-app-extension-apollo](https://www.npmjs.com/package/@quasar/quasar-app-extension-apollo))

The extension will add a configuration file into `src/apollo` and a boot file.
You'll need to manually register the latter into `quasar.conf.js > boot`.

### Prompts

You will be prompted if you wish to use GraphQL subscriptions, if you
answer yes, you will be prompted which subscription transport you wish to use. Available options are:

- Web Socket ([graphql-ws](https://github.com/enisdenjo/graphql-ws))
- SSE (Server-Sent Events) ([graphql-sse](https://github.com/enisdenjo/graphql-sse))

After selecting the transport, the necessary dependencies will be installed and the initialization code
will be scaffolded for you.

## Uninstall

```sh
quasar ext remove @quasar/apollo
```

You might also wish to remove the added directory `src/apollo` and related boot file.

## Apollo client options

Apollo client options can be customized in
`src/apollo/index.(ts|js)`.

You will need either to set the GraphQL endpoint in it, or set it as an
environment variable before running Quasar:

```sh
GRAPHQL_URI=https://prod.example.com/graphql quasar build
GRAPHQL_URI=https://dev.example.com/graphql quasar dev
```

If you don't have a GraphQL endpoint yet, you can create one to experiment
with at [FakeQL](https://fakeql.com) or other similar services.

If you are using GraphQL subscriptions, you will also need to set the
WebSocket endpoint as an environment variable:

```sh
GRAPHQL_URI=https://prod.example.com/graphql GRAPHQL_WS_URI=wss://prod.example.com/graphql quasar build
GRAPHQL_URI=https://dev.example.com/graphql GRAPHQL_WS_URI=wss://dev.example.com/graphql quasar dev
```

You can [use dotenv in quasar.config file](https://quasar.dev/quasar-cli-vite/handling-process-env#using-dotenv)
to set these environment variables in a more convenient way, if you wish.

## Usage

Check the guide in [Vue Apollo docs](https://v4.apollo.vuejs.org/guide-composable/setup.html).

Example usage:

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

    ...
  </q-page>
</template>

<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'

const { result, loading, error } = useQuery(gql`
  query getPosts {
    post(id: "3") {
      id
      title
    }
  }
`)
```

## Multiple apollo clients setup

Un-comment the relevant code in `boot/apollo.(ts|js)`

The following is an example using `clientA` instead of the default client:

```ts
// ...
const { result, loading, error } = useQuery(
  gql`
    query getPosts {
      post(id: "3") {
        id
        title
      }
    }
  `,
  null,
  { clientId: 'clientA' },
)
// ...
```

## Tooling

An `apollo.config.js` configuration file for [Apollo GraphQL VSCode extension](https://www.apollographql.com/docs/devtools/editor-plugins/) ((`apollographql.vscode-apollo`)) will be automatically scaffolded.

You should fill in the `client.service.url` property with the URL of the server exposing your GraphQL schema, check [`client.service` documentation](https://www.apollographql.com/docs/devtools/apollo-config/#clientservice) to learn about other options.

This extension will automatically connect to your remote server, read your GraphQL schema and provide autocomplete/schema errors detection for your GraphQL queries.
