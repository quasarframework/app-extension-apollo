# Quasar GraphQL App Extension

## Introduction

This app extension adds graphql support to your quasar projects.

It uses [Apollo GraphQL](https://www.apollographql.com) and its vue plugin [Vue Apollo](https://apollo.vuejs.org)

Server side rendering (SSR) mode is supported by this extension.

## Installation

```sh
quasar ext add @quasar/graphql
```

Quasar CLI will retrieve the extension from NPM ([@quasar/quasar-app-extension-graphql](https://www.npmjs.com/package/@quasar/quasar-app-extension-graphql))

**Note:** Some code will be added to the html template file of your app (`src/index.template.html`)

## Prompts

You will be prompted to enter the URI of your GraphQL endpoint. You can skip this and instead provide the URI using an env variable when running quasar:

```sh
GRAPHQL_URI=https://prod.example.com/graphql quasar build
GRAPHQL_URI=https://dev.example.com/graphql quasar dev
```

If you don't have a GraphQL endpoint yet, you can create one to experiment with at [FakeQL](https://fakeql.com) or other similar services.

## Uninstall

```sh
quasar ext remove @quasar/graphql
```

**Note:** The added code to the html template file (`src/index.template.html`) will be removed.

## Usage

Check the guide in [Vue Apollo docs](https://apollo.vuejs.org/guide/apollo/)

Example usage:

`src/pages/Index.vue`

```html
<template>
  <q-page>
    <!-- when the query response is not received yet, data from it is undefined,
    so before referring to it we need to use v-if -->
    <div v-if="post">
      GraphQL query result:<br>{{ post.title }}
    </div>
    <div v-else>
      loading...
    </div>
  </q-page>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'PageIndex',

  // https://apollo.vuejs.org/guide/apollo/#usage-in-vue-components
  apollo: {
    post: {
      query: gql`query {
        post(id: 5) {
          title
        }
      }`
    }
  }
}
</script>
```
