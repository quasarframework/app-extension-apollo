/* eslint-env node */

function extendConf (conf) {
  // register our boot file
  conf.boot.push('~@quasar/quasar-app-extension-apollo/src/boot/apollo.ts')
}

module.exports = function (api) {
  // Quasar compatibility check.
  api.compatibleWith('quasar', '^2.0.0')
  if (api.hasVite === true) {
    api.compatibleWith('@quasar/app-vite', '^1.0.0')
  } else {
    api.compatibleWith('@quasar/app', '^3.0.0')
  }

  // Render templates in the app.
  if (api.prompts.typescript) {
    api.render('./templates')
  } else {
    api.render('../lib/templates')
  }

  api.extendJsonFile('.vscode/extensions.json', {
    recommendations: ['apollographql.vscode-apollo'],
  })
