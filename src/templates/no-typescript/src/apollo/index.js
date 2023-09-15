import { createHttpLink, InMemoryCache<% if (hasSubscriptions) { %>, split<% } %> } from '@apollo/client/core'<% if (hasSubscriptions) { %>
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'<% } %>

export /* async */ function getClientOptions(
  /* {app, router, ...} */ options
) {
  const httpLink = createHttpLink({
    uri:
      process.env.GRAPHQL_URI ||
      // Change to your graphql endpoint.
      '/graphql',
  })<% if (hasSubscriptions) { %>

  const wsLink = new GraphQLWsLink(
    createClient({
      url:
        process.env.GRAPHQL_URI_WS ||
        // Change to your graphql endpoint.
        `ws://${location.host}/graphql`,
      // If you have authentication, you can utilize connectionParams:
      /*
      connectionParams: () => {
        const session = getSession(); // Change to your way of getting the session.
        if (!session) {
          return {};
        }

        return {
          Authorization: `Bearer ${session.token}`,
        };
      },
      */
    })
  )

  const link = split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    wsLink,
    httpLink
  )<% } %>

  return Object.assign(
    // General options.
    {
      <% if (hasSubscriptions) { %>link,<% } else { %>link: httpLink,<% } %>

      cache: new InMemoryCache(),
    },

    // Specific Quasar mode options.
    process.env.MODE === 'spa'
      ? {
          //
        }
      : {},
    process.env.MODE === 'ssr'
      ? {
          //
        }
      : {},
    process.env.MODE === 'pwa'
      ? {
          //
        }
      : {},
    process.env.MODE === 'bex'
      ? {
          //
        }
      : {},
    process.env.MODE === 'cordova'
      ? {
          //
        }
      : {},
    process.env.MODE === 'capacitor'
      ? {
          //
        }
      : {},
    process.env.MODE === 'electron'
      ? {
          //
        }
      : {},

    // dev/prod options.
    process.env.DEV
      ? {
          //
        }
      : {},
    process.env.PROD
      ? {
          //
        }
      : {},

    // For ssr mode, when on server.
    process.env.MODE === 'ssr' && process.env.SERVER
      ? {
          ssrMode: true,
        }
      : {},
    // For ssr mode, when on client.
    process.env.MODE === 'ssr' && process.env.CLIENT
      ? {
          ssrForceFetchDelay: 100,
        }
      : {}
  )
}
