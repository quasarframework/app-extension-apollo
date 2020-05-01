// the following will be injected in the app 'index.template.html', it contains
// the graphql query results run in the server. The client will find them in
// 'window.__APOLLO_STATE__' and uses them to initialize apollo-client cache,
// thus removing the need to run the queries again in the client
// https://ssr.vuejs.org/guide/build-config.html#manual-asset-injection
module.exports.graphqlHtml = `
    <% // added by 'quasar-app-extension-apollo' %>
    <% if (htmlWebpackPlugin.options.ctx.mode.ssr) { %>
      {{{ renderState({ contextKey: 'apolloState', windowKey: '__APOLLO_STATE__' }) }}}
    <% } %>
  `
