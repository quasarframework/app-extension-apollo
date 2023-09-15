/* eslint-env node */
/**
 * @param {import('@quasar/app-vite').IndexAPI} api
 */
module.exports = function (api) {
  api.extendQuasarConf((conf) => {
    // Allow overriding the graphql uri using an env variable
    // https://quasar.dev/quasar-cli/handling-process-env#Adding-to-process.env
    conf.build.env.GRAPHQL_URI = process.env.GRAPHQL_URI
  })
}
