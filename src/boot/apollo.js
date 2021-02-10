import Vue from 'vue';
import VueApollo from 'vue-apollo';
import getApolloClientConfig from '../graphql/get-apollo-client-config';
import createApolloClient from '../graphql/create-apollo-client';
import {
  apolloProviderBeforeCreate,
  apolloProviderAfterCreate
} from 'src/apollo/apollo-provider-hooks';

// Install vue-apollo plugin
Vue.use(VueApollo);

export default ({ app, router, store, urlPath, redirect }) => {
  const cfg = getApolloClientConfig({ app, router, store, urlPath, redirect });

  // create an 'apollo client' instance
  const apolloClient = createApolloClient({
    cfg,
    app,
    router,
    store,
    urlPath,
    redirect
  });

  const apolloProviderConfigObj = { defaultClient: apolloClient };

  // run hook before creating apollo provider instance
  apolloProviderBeforeCreate({
    apolloProviderConfigObj,
    app,
    router,
    store,
    urlPath,
    redirect
  });

  // create an 'apollo provider' instance
  const apolloProvider = new VueApollo(apolloProviderConfigObj);

  // run hook after creating apollo provider instance
  apolloProviderAfterCreate({
    apolloProvider,
    app,
    router,
    store,
    urlPath,
    redirect
  });

  // attach created 'apollo provider' instance to the app
  app.apolloProvider = apolloProvider;
};
