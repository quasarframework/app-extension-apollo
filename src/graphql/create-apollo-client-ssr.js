import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'node-fetch';
import getApolloClientConfig from './get-apollo-client-config';
import {
  apolloClientBeforeCreate,
  apolloClientAfterCreate
} from 'src/apollo/apollo-client-hooks';

// `true` when this code runs on server (node environment), `false` when on
// client (web browser for example)
// https://quasar.dev/quasar-cli/cli-documentation/handling-process-env#Values-supplied-by-Quasar-CLI
const onServer = process.env.SERVER;

// function that returns an 'apollo client' instance
export default function ({
  app,
  router,
  store,
  ssrContext,
  urlPath,
  redirect
}) {
  const cfg = getApolloClientConfig({
    app,
    router,
    store,
    ssrContext,
    urlPath,
    redirect
  });

  // when on server, we use 'node-fetch' polyfill
  // https://www.apollographql.com/docs/link/links/http/#fetch-polyfill
  if (onServer) {
    cfg.httpLinkConfig.fetch = fetch;
  }

  // create apollo client link
  const link = new HttpLink(cfg.httpLinkConfig);

  // create apollo client cache
  const cache = new InMemoryCache(cfg.cacheConfig);
  // If on the client, recover the cache state injected by the server
  if (!onServer && typeof window !== 'undefined' && window.__APOLLO_STATE__) {
    cache.restore(window.__APOLLO_STATE__.defaultClient);
  }

  // object that will be used to instantiate apollo client
  const apolloClientConfigObj = { link, cache, ...cfg.additionalConfig };

  // run hook before creating apollo client instance
  apolloClientBeforeCreate({
    apolloClientConfigObj,
    app,
    router,
    store,
    ssrContext,
    urlPath,
    redirect
  });

  // create an `apollo client` instance
  const apolloClient = new ApolloClient(apolloClientConfigObj);

  // run hook after creating apollo client instance
  apolloClientAfterCreate({
    apolloClient,
    app,
    router,
    store,
    ssrContext,
    urlPath,
    redirect
  });

  // return `apollo client` instance
  return apolloClient;
}
