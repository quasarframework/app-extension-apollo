import Vue from 'vue'
import VueApollo from 'vue-apollo'
import createApolloClient from '../graphql/create-apollo-client'

// Install vue-apollo plugin
Vue.use(VueApollo)

// create an 'apollo client' instance
const apolloClient = createApolloClient()

// create an 'apollo provider' instance
const apolloProvider = new VueApollo({ defaultClient: apolloClient })

export default ({ app }) => {
  // attach created 'apollo provider' instance to the app
  app.apolloProvider = apolloProvider
}
