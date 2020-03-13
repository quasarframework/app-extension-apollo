# app-extension-apollo

![official icon](https://img.shields.io/badge/Quasar%201.0-Official%20App%20Extension-blue.svg)
<a href="https://quasar.dev" target="_blank"><img src="https://badge.fury.io/js/%40quasar%2Fquasar-app-extension-apollo.svg"></a>

| Statements | Branches | Functions | Lines |
 |-------|------------|----------|-----------|
 | ![Statements](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg "Make me better!") | ![Branches](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg "Make me better!") | ![Functions](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg "Make me better!") | ![Lines](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg "Make me better!")

This is the official Quasar App-Extension for adding GraphQL to your Quasar project.

## Introduction

This app extension adds GraphQL support to your Quasar projects.

It uses [Apollo Client](https://www.apollographql.com) and the [Vue Apollo](https://apollo.vuejs.org) plugin.

Server side rendering (SSR) mode is also supported by this extension.

## Installation

```sh
quasar ext add @quasar/apollo
```

Quasar CLI will retrieve the extension from NPM ([@quasar/quasar-app-extension-apollo](https://www.npmjs.com/package/@quasar/quasar-app-extension-apollo))

**Note:** Some code will be added to the html template file of your app (`src/index.template.html`)

## Prompts

You will be prompted to enter the URI of your GraphQL endpoint. You can skip this and instead provide the URI using an environment variable when running Quasar:

```sh
GRAPHQL_URI=https://prod.example.com/graphql quasar build
GRAPHQL_URI=https://dev.example.com/graphql quasar dev
```

If you don't have a GraphQL endpoint yet, you can create one to experiment with at [FakeQL](https://fakeql.com) or other similar services.

## Uninstall

```sh
quasar ext remove @quasar/apollo
```

**Note:** The added code to the html template file (`src/index.template.html`) will be removed.

**Warning** Added directory `src/quasar-app-extension-apollo` will be removed, if you need, make a backup before uninstalling the extension.

## Configuration

Apollo client can be configured through `src/quasar-app-extension-apollo/apollo-client-config.js`.

For advanced configuration needs, the extension provides two hooks, one gets called before the apollo client instantiation and the other afterwards. The hooks are `apolloClientBeforeCreate` and `apolloClientAfterCreate`, and can be modified as needed in `src/quasar-app-extension-apollo/apollo-client-hooks.js`.

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

## IMPORTANT: Needed to get vue-apollo's components to work (with Vue)

In order for the [vue-apollo components](https://apollo.vuejs.org/guide/components/) to work, you must turn on a special transform so vue-loader doesn't fail on those new tags. Add the below code to the `build` property in your `quasar.conf.js` file.

```javascript
  chainWebpack (chain, { isServer, isClient }) {
    chain.module.rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.transpileOptions = {
          transforms: {
            dangerousTaggedTemplateString: true
          }
        }
        return options
      })
  }
```


