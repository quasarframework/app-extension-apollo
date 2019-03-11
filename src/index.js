/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/IndexAPI.js
 */


const extendWithApolloClient = function (api, conf) {

  // make sure there is a boot array
  if (!conf.boot) {
    conf.boot = []
  }

  // for brevity
  let boot = conf.boot

  if (!boot.includes('apollo-client')) {
    boot.push({path: 'apollo-client' })
    console.log(` App Extension (apollo-client) Info: 'Adding apollo-client boot reference to your quasar.conf.js'`)
  }
}

module.exports = function (api, ctx) {
  api.extendQuasarConf((conf) => {
    extendWithApolloClient(api, conf)
    console.log('conf: ', conf)
  })
}
