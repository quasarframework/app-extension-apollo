import merge from 'webpack-merge';
import config from 'src/apollo/apollo-client-config';

// quasar mode (spa, ssr,...)
const quasarMode = process.env.MODE;

// `true` when this code runs on server (node environment), `false` when on
// client (web browser for example)
// https://quasar.dev/quasar-cli/cli-documentation/handling-process-env#Values-supplied-by-Quasar-CLI
const onServer = process.env.SERVER;

export default async function ({
  app,
  router,
  store,
  ssrContext,
  urlPath,
  redirect
}) {
  // get raw configuration provided by the app
  const rawConfig = await config({
    app,
    router,
    store,
    ssrContext,
    urlPath,
    redirect
  });

  // merge provided configs.
  // specific mode configs will be merged to the default config
  return merge(
    rawConfig.default,
    rawConfig[quasarMode],
    process.env.DEV ? rawConfig.dev : {},
    process.env.PROD ? rawConfig.prod : {},
    quasarMode === 'ssr' && onServer ? rawConfig.ssrOnServer : {},
    quasarMode === 'ssr' && !onServer ? rawConfig.ssrOnClient : {}
  );
}
