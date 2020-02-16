import Vue from 'vue'
import VueApollo from 'vue-apollo'
import createApolloClient from '../graphql/create-apollo-client'

// Install vue-apollo plugin
Vue.use(VueApollo)

export default ({ app, router, store, urlPath, redirect }) => {
  // create an 'apollo client' instance
  const apolloClient = createApolloClient({ app, router, store, urlPath, redirect })

  // create an 'apollo provider' instance
  const apolloProvider = new VueApollo({ defaultClient: apolloClient })

  // attach created 'apollo provider' instance to the app
  app.apolloProvider = apolloProvider
}
