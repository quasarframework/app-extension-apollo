import Vue from 'vue';
import VueApollo from 'vue-apollo';
import ApolloSSR from 'vue-apollo/ssr';
import getApolloClientConfig from '../graphql/get-apollo-client-config';
import createApolloClient from '../graphql/create-apollo-client-ssr';
import {
  apolloProviderBeforeCreate,
  apolloProviderAfterCreate
} from 'src/apollo/apollo-provider-hooks';

// Install the vue plugin
Vue.use(VueApollo);

export default async ({ app, router, store, ssrContext, urlPath, redirect }) => {
 const cfg = getApolloClientConfig({
    app,
    router,
    store,
    ssrContext,
    urlPath,
    redirect
  });

  const apolloClient = await createApolloClient({
    app,
    router,
    store,
    ssrContext,
    urlPath,
    redirect
  });

  const apolloProviderConfigObj = { defaultClient: apolloClient };

  // run hook before creating apollo provider instance
  await apolloProviderBeforeCreate({
    apolloProviderConfigObj,
    app,
    router,
    store,
    ssrContext,
    urlPath,
    redirect
  });

  // create an 'apollo provider' instance
  const apolloProvider = new VueApollo(apolloProviderConfigObj);

  // run hook after creating apollo provider instance
  await apolloProviderAfterCreate({
    apolloProvider,
    app,
    router,
    store,
    ssrContext,
    urlPath,
    redirect
  });

  // attach created 'apollo provider' instance to the app
  app.apolloProvider = apolloProvider;

  // when on server:
  if (ssrContext) {
    // This `rendered` hook is called when the app has finished rendering
    // https://ssr.vuejs.org/guide/data.html#final-state-injection
    ssrContext.rendered = () => {
      // when the app has finished rendering in the server, the graphql queries
      // are resolved and their results are ready to be attached to the ssr
      // context, these query results are then retrieved in the html template
      // and made available to the client via 'window.__APOLLO_STATE__'
      // https://apollo.vuejs.org/guide/ssr.html#server-entry
      // https://quasar.dev/quasar-cli/developing-ssr/configuring-ssr#Boot-Files
      ssrContext.apolloState = ApolloSSR.getStates(apolloProvider);
    };
  }
};
