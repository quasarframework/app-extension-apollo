import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import getApolloClientConfig from './get-apollo-client-config'

// function that returns an 'apollo client' instance
export default function ({ app, router, store, urlPath, redirect }) {
  const cfg = getApolloClientConfig({ app, router, store, urlPath, redirect })

  // create apollo client link
  const link = new HttpLink(cfg.httpLinkConfig)

  // create apollo client cache
  const cache = new InMemoryCache(cfg.cacheConfig)

  // create and return an `apollo client` instance
  return new ApolloClient({ link, cache, ...cfg.additionalConfig })
}
