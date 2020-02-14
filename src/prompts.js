module.exports = function () {
  return [
    {
      // address of the graphql backend server
      // you can override this 'uri' by using an env variable when running
      // quasar commands, for example:
      // `GRAPHQL_URI=https://prod.example.com/graphql quasar build`
      // `GRAPHQL_URI=https://dev.example.com/graphql quasar dev`
      name: 'graphql_uri',
      type: 'input',
      required: false,
      message: 'GraphQL endpoint URI (You can skip it now and set it later)',
      default: 'http://api.example.com'
    }
  ]
}
