import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import conf from 'app/quasar.extensions.json'

// function that returns an 'apollo client' instance
// https://www.apollographql.com/docs/react/api/apollo-client/
export default function () {
  // https://www.apollographql.com/docs/link/links/http/#options
  const httpLinkOptions = {
    // you can define the 'uri' in 'src/params.js' or using an env variable when
    // running quasar commands, for example:
    // `GRAPHQL_URI=https://api.example.com quasar build`
    uri: process.env.GRAPHQL_URI || conf['@ejez/graphql'].graphql_uri
  }
  const link = new HttpLink(httpLinkOptions)

  // https://www.apollographql.com/docs/react/caching/cache-configuration/#configuring-the-cache
  const cache = new InMemoryCache()

  // create and return an `apollo client` instance
  return new ApolloClient({ link, cache })
}
