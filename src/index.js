/* eslint-env node */
/**
 * @param {import('@quasar/app-vite').IndexAPI} api
 */
module.exports = function (api) {
  // Quasar compatibility check.
  api.compatibleWith('quasar', '^2.0.0')
  if (api.hasVite) {
    // PromptsAPI and hasTypescript() are only available from v1.6.0 onwards
    api.compatibleWith('@quasar/app-vite', '^1.6.0 || ^2.0.0-beta.9');
  } else if (api.hasWebpack) {
    // PromptsAPI and hasTypescript() are only available from v3.11.0 onwards
    api.compatibleWith('@quasar/app-webpack', '^3.11.0 || ^4.0.0-beta.1');
  }

  api.extendQuasarConf((conf, api) => {
    // Allow overriding the graphql uri using an env variable
    // https://quasar.dev/quasar-cli/handling-process-env#Adding-to-process.env
    conf.build.env.GRAPHQL_URI = process.env.GRAPHQL_URI || ''
    if (api.prompts.subscriptions === true) {
      conf.build.env.GRAPHQL_URI_WS = process.env.GRAPHQL_URI_WS || ''
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
