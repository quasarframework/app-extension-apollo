import { ApolloClient /*, createHttpLink */ } from '@apollo/client'
import { boot } from 'quasar/wrappers'
import { getClientOptions } from 'src/extensions/apollo/conf'

export let apolloClients

export default boot(
  /* async */ (/* {app, router, ...} */) => {
    // Default client.
    const options = /* await */ getClientOptions(/* {app, router ...} */)
    const apolloClient = new ApolloClient(options)

    // // Additional client `clientA`
    // const optionsA = { ...options }
    // // Modify options as needed.
    // optionsA.link = createHttpLink({ uri: 'http://clientA.example.com' })
    // const clientA = new ApolloClient(optionsA)

    // // Additional client `clientB`
    // const optionsB = { ...options }
    // // Modify options as needed.
    // optionsB.link = createHttpLink({ uri: 'http://clientB.example.com' })
    // const clientB = new ApolloClient(optionsB)

    apolloClients = {
      default: apolloClient,
      // clientA,
      // clientB,
    }
  }
)
