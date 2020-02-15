import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import fetch from 'node-fetch'
import getApolloClientConfig from './get-apollo-client-config'

// `true` when this code runs on server (node environment), `false` when on
// client (web browser for example)
// https://quasar.dev/quasar-cli/cli-documentation/handling-process-env#Values-supplied-by-Quasar-CLI
const onServer = process.env.SERVER

// function that returns an 'apollo client' instance
export default function ({ app, router, store, ssrContext, urlPath, redirect }) {
  const cfg = getApolloClientConfig({ app, router, store, ssrContext, urlPath, redirect })

  // when on server, we use 'node-fetch' polyfill
  // https://www.apollographql.com/docs/link/links/http/#fetch-polyfill
  if (onServer) { cfg.httpLinkConfig.fetch = fetch }

  // create apollo client link
  const link = new HttpLink(cfg.httpLinkConfig)

  // create apollo client cache
  const cache = new InMemoryCache(cfg.cacheConfig)
  // If on the client, recover the cache state injected by the server
  if (!onServer && typeof window !== 'undefined' && window.__APOLLO_STATE__) {
    cache.restore(window.__APOLLO_STATE__.defaultClient)
  }

  // create and return an `apollo client` instance
  return new ApolloClient({ link, cache, ...cfg.additionalConfig })
}
