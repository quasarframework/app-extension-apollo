module.exports = function (api) {
  api.extendQuasarConf((conf) => {
    // Register the boot file.
    conf.boot.unshift('~src/extensions/apollo/boot')

    // Allow overriding the graphql uri using an env variable
    // https://quasar.dev/quasar-cli/handling-process-env#Adding-to-process.env
    conf.build.env.GRAPHQL_URI = process.env.GRAPHQL_URI
  })
}
