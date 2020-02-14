import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import fetch from 'node-fetch'
import conf from 'app/quasar.extensions.json'

// function that returns an 'apollo client' instance
// https://www.apollographql.com/docs/react/api/apollo-client/
export default function () {
  // `true` when this code runs on server (node environment), `false` when on
  // client (web browser for example)
  // https://quasar.dev/quasar-cli/cli-documentation/handling-process-env#Values-supplied-by-Quasar-CLI
  const onServer = process.env.SERVER

  // https://www.apollographql.com/docs/link/links/http/#options
  const httpLinkOptions = {
    // you can define the 'uri' in 'src/params.js' or using an env variable when
    // running quasar commands, for example:
    // `GRAPHQL_URI=https://api.example.com quasar build`
    uri: process.env.GRAPHQL_URI || conf['@quasar/graphql'].graphql_uri
  }
  // when on server, we use 'node-fetch' polyfill
  // https://www.apollographql.com/docs/link/links/http/#fetch-polyfill
  if (onServer) { httpLinkOptions.fetch = fetch }
  // create apollo client link
  const link = new HttpLink(httpLinkOptions)

  // https://www.apollographql.com/docs/react/caching/cache-configuration/#configuring-the-cache
  const cache = new InMemoryCache()
  // If on the client, recover the injected state
  if (!onServer && typeof window !== 'undefined' && window.__APOLLO_STATE__) {
    // If you have multiple clients, use `state.<client_id>`
    cache.restore(window.__APOLLO_STATE__.defaultClient)
  }

  // https://www.apollographql.com/docs/react/api/apollo-client/#optional-fields
  // https://apollo.vuejs.org/guide/ssr.html#create-apollo-client
  const apolloClientExtraOptions = onServer
    ? { ssrMode: true }
    : { ssrForceFetchDelay: 100 }

  // create and return an `apollo client` instance
  return new ApolloClient({ link, cache, ...apolloClientExtraOptions })
}
