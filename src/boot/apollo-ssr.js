import Vue from 'vue'
import VueApollo from 'vue-apollo'
import ApolloSSR from 'vue-apollo/ssr'
import createApolloClient from '../graphql/create-apollo-client-ssr'

// Install the vue plugin
Vue.use(VueApollo)

export default ({ app, ssrContext }) => {
  // create an 'apollo client' instance
  const apolloClient = createApolloClient()

  // create an 'apollo provider' instance
  const apolloProvider = new VueApollo({ defaultClient: apolloClient })

  // attach created 'apollo provider' instance to the app
  app.apolloProvider = apolloProvider

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
      ssrContext.apolloState = ApolloSSR.getStates(apolloProvider)
    }
  }
}
