/* eslint-env node */
/**
 * @param {import('@quasar/app-vite').IndexAPI} api
 */
export default function (api) {
  api.compatibleWith('quasar', '^2.0.0')
  api.compatibleWith('@quasar/app-vite', '^3.0.0-beta.1')

  api.extendQuasarConf((conf, api) => {
    // Allow overriding the graphql uri using an env variable
    // https://quasar.dev/quasar-cli-vite/handling-process-env#adding-to-process-env
    conf.build.defineEnv.GRAPHQL_URI = process.env.GRAPHQL_URI || ''
    if (api.prompts.subscriptions === true) {
      conf.build.defineEnv.GRAPHQL_URI_WS = process.env.GRAPHQL_URI_WS || ''
    }
  })
}
