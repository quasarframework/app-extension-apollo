import { createHttpLink, InMemoryCache } from '@apollo/client/core'<% if (hasSubscriptions) { %>
import { split } from '@apollo/client/link/core'
import { Kind, OperationTypeNode } from 'graphql';
import { getMainDefinition } from '@apollo/client/utilities'<% if (subscriptionsTransport === 'ws') { %>
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'<% } else if (subscriptionsTransport === 'sse') { %>
import { ApolloLink } from '@apollo/client/link/core'
import { Observable } from '@apollo/client/utilities'
import { print } from 'graphql'
import { createClient } from 'graphql-sse'<% } %><% } %>

export /* async */ function getClientOptions(
  // eslint-disable-next-line no-unused-vars
  /* {app, router, ...} */ options
) {
  const httpLink = createHttpLink({
    uri:
      process.env.GRAPHQL_URI ||
      // Change to your graphql endpoint.
      '/graphql',
  })<% if (hasSubscriptions) { %><% if (subscriptionsTransport === 'ws') { %>

  const subscriptionLink = new GraphQLWsLink(
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
  )<% } else if (subscriptionsTransport === 'sse') { %>

  // See https://the-guild.dev/graphql/sse/recipes#with-apollo
  class SSELink extends ApolloLink {
    constructor(options) {
      super();
      this.client = createClient(options);
    }

    request(operation) {
      return new Observable((sink) => {
        return this.client.subscribe(
          { ...operation, query: print(operation.query) },
          {
            next: sink.next.bind(sink),
            complete: sink.complete.bind(sink),
            error: sink.error.bind(sink),
          },
        );
      });
    }
  }
  const subscriptionLink = new SSELink({
    url:
      process.env.GRAPHQL_URI_SSE ||
      // Change to your graphql endpoint.
      `http://${location.host}/graphql/stream`,
    // If you have authentication, you can utilize headers:
    /*
    headers: () => {
      const session = getSession(); // Change to your way of getting the session.
      if (!session) {
        return {};
      }

      return {
        Authorization: `Bearer ${session.token}`,
      };
    },
    */
  })<% } %>

  const link = split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === Kind.OPERATION_DEFINITION &&
        definition.operation === OperationTypeNode.SUBSCRIPTION
      )
    },
    subscriptionLink,
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
