import merge from 'webpack-merge'
import config from 'src/quasar-app-extension-graphql/apollo-client-config'

// quasar mode (spa, ssr,...)
const quasarMode = process.env.MODE

// `true` when this code runs on server (node environment), `false` when on
// client (web browser for example)
// https://quasar.dev/quasar-cli/cli-documentation/handling-process-env#Values-supplied-by-Quasar-CLI
const onServer = process.env.SERVER

export default function () {
  // merge provided configs.
  // specific mode configs will be merged to the default config
  return merge(
    config.default,
    config[quasarMode],
    (process.env.DEV ? config.dev : {}),
    (process.env.PROD ? config.prod : {}),
    ((quasarMode === 'ssr' && onServer) ? config.ssrOnServer : {}),
    ((quasarMode === 'ssr' && !onServer) ? config.ssrOnClient : {})
  )
}
