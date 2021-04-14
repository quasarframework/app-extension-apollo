# app-extension-apollo

## Introduction

This is the official Quasar app extension for adding GraphQL to your Quasar
project.

It uses [Apollo Client](https://www.apollographql.com) and [Vue Apollo](https://v4.apollo.vuejs.org).

## Installation

```sh
quasar ext add @quasar/apollo
```

Quasar CLI will retrieve the extension from NPM
([@quasar/quasar-app-extension-apollo](https://www.npmjs.com/package/@quasar/quasar-app-extension-apollo))

The extension will add a directory `src/extensions/apollo`.

### Prompts

You will be prompted if your app has typescript support, if you answer yes,
`*.ts` files will be added instead of `*.js`.

### App.vue

Modify `src/App.vue` as shown below:

```html
<template>
  <router-view />
</template>
<script lang="ts">
  import { defineComponent, provide } from 'vue'
  import { ApolloClients } from '@vue/apollo-composable'
  import { apolloClients } from 'src/boot/apollo'

  export default defineComponent({
    name: 'App',
    setup() {
      provide(ApolloClients, apolloClients)
    },
  })
</script>
```

## Uninstall

```sh
quasar ext remove @quasar/apollo
```

You might also wish to remove the added directory `src/extensions/apollo`.

## Apollo client options

Apollo client options can be customized in
`src/extensions/apollo/conf/index.(ts|js)`.

You will need either to set the GraphQL endpoint in it, or set it as an
environment variable before running Quasar:

```sh
GRAPHQL_URI=https://prod.example.com/graphql quasar build
GRAPHQL_URI=https://dev.example.com/graphql quasar dev
```

If you don't have a GraphQL endpoint yet, you can create one to experiment
with at [FakeQL](https://fakeql.com) or other similar services.

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

<script lang="ts">
  ...
  import { useQuery } from '@vue/apollo-composable'
  import gql from 'graphql-tag'

  export default defineComponent({
    ...
    setup () {
       ...
      const { result, loading, error } = useQuery(gql`
        query getPosts {
          post(id: "3") {
            id
            title
          }
        }
      `)

      return { /* your other items, */ result, loading, error }
    }
  })
</script>
```

## Multiple apollo clients setup

Un-comment the relevant code in `src/extensions/apollo/boot.(ts|js)`

The following is an example using `clientA` instead of the default client:

```ts
    ...
    const { result, loading, error } = useQuery(gql`
      query getPosts {
        post(id: "3") {
          id
          title
        }
      }
    `, null, { clientId: 'clientA' })
    ...
```
