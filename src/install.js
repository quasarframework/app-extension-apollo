/* eslint-env node */

/**
 * @param {import('@quasar/app-vite').InstallAPI} api
 */
module.exports = function (api) {
  // Quasar compatibility check.
  api.compatibleWith('quasar', '^2.0.0')
  if (api.hasVite === true) {
    api.compatibleWith('@quasar/app-vite', '^1.0.0')
  } else {
    api.compatibleWith('@quasar/app-webpack', '^3.3.3')
  }

  const hasSubscriptions = api.prompts.subscriptions === true

  api.render('./templates/base')
  const hasTypescript = api.prompts.typescript === true
  api.render(`./templates/${hasTypescript ? 'typescript' : 'no-typescript'}`, {
    hasVite: api.hasVite,
    hasSubscriptions
  })

  if (hasSubscriptions) {
    api.extendPackageJson({
      dependencies: {
        'graphql-ws': '^5.14.0'
      },
    })
  }

  api.extendJsonFile('.vscode/extensions.json', {
    recommendations: ['apollographql.vscode-apollo'],
  })
}
