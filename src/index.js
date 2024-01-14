/* eslint-env node */
/**
 * @param {import('@quasar/app-vite').IndexAPI} api
 */
module.exports = function (api) {
  api.extendQuasarConf((conf, api) => {
    // Allow overriding the graphql uri using an env variable
    // https://quasar.dev/quasar-cli/handling-process-env#Adding-to-process.env
    conf.build.env.GRAPHQL_URI = process.env.GRAPHQL_URI
    if (api.prompts.subscriptions === true) {
      conf.build.env.GRAPHQL_URI_WS = process.env.GRAPHQL_URI_WS
    }

    // `graphql` package does not work with Vite, so apply a workaround
    // See: https://github.com/quasarframework/app-extension-apollo/issues/154
    if (api.hasVite) {
      conf.build.rawDefine = {
        ...conf.build.rawDefine,
        'globalThis.process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }
  })
}
