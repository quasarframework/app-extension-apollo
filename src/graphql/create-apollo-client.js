import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import {
  apolloClientBeforeCreate,
  apolloClientAfterCreate
} from 'src/apollo/apollo-client-hooks';

// function that returns an 'apollo client' instance
export default async function ({ cfg, app, router, store, urlPath, redirect }) {
  // create apollo client link
  const link = new HttpLink(cfg.httpLinkConfig);

  // create apollo client cache
  const cache = new InMemoryCache(cfg.cacheConfig);

  // object that will be used to instantiate apollo client
  const apolloClientConfigObj = { link, cache, ...cfg.additionalConfig };

  // run hook before creating apollo client instance
  await apolloClientBeforeCreate({
    apolloClientConfigObj,
    app,
    router,
    store,
    urlPath,
    redirect
  });

  // create an `apollo client` instance
  const apolloClient = new ApolloClient(apolloClientConfigObj);

  // run hook after creating apollo client instance
  await apolloClientAfterCreate({
    apolloClient,
    app,
    router,
    store,
    urlPath,
    redirect
  });

  // return `apollo client` instance
  return apolloClient;
}
