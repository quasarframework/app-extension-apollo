/* eslint-env node */
module.exports = function () {
  return [
    // TODO: Automatically detect TS support: https://github.com/quasarframework/app-extension-apollo/discussions/107#discussioncomment-7033817
    {
      name: 'typescript',
      type: 'confirm',
      message: 'Does your app have TypeScript support?',
      default: false,
    },
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
    }
  ]
}
