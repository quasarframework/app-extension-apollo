/* eslint-env node */
module.exports = function () {
  return [
    {
      name: 'subscriptions',
      type: 'confirm',
      message: 'Does your app use GraphQL subscriptions?',
      default: false,
    },
    {
      name: 'subscriptionsTransport',
      type: 'list',
      when: ({ subscriptions }) => subscriptions === true,
      message: 'Which transport do you use for GraphQL subscriptions?',
      choices: [
        {
          name: 'Web Socket (graphql-ws)',
          value: 'ws',
        },
        {
          name: 'SSE (Server-Sent Events) (graphql-sse)',
          value: 'sse',
        },
      ],
    },
  ]
}
