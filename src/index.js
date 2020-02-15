// function that will be used to extend quasar config (quasar.conf.js)
function extendConf (conf, api) {
  // select boot file depending on quasar mode
  // https://quasar.dev/quasar-cli/quasar-conf-js#The-basics
  const bootFile = api.ctx.mode.ssr ? 'apollo-ssr' : 'apollo'

  // register boot file
  conf.boot.push(`~@m8a/quasar-app-extension-apollo/src/boot/${bootFile}`)

  // make sure app extension files get transpiled
  conf.build.transpileDependencies.push(/quasar-app-extension-apollo[\\/]src/)

  // allow overriding of graphql uri using an env variable
  // https://quasar.dev/quasar-cli/cli-documentation/handling-process-env#Adding-to-process.env
  conf.build.env.GRAPHQL_URI = JSON.stringify(process.env.GRAPHQL_URI)
}

module.exports = function (api) {
  // quasar compatibility check
  api.compatibleWith('quasar', '^1.1.1')
  api.compatibleWith('@quasar/app', '^1.1.0')

  // extend quasar config
  api.extendQuasarConf(extendConf)
}
