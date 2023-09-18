/* eslint-env node */
const { join } = require('path')

// https://github.com/quasarframework/quasar-testing/blob/75e4fb524fd7767492a1cac66fe8169a5b29b6a6/packages/e2e-cypress/src/install.js#L41-L55
// We use devDependencies instead of peerDependencies because devDependencies are usually the latest version
// and peerDependencies could contain a string supporting multiple major versions (e.g. "cypress": "^12.2.0 || ^13.1.0")
const { devDependencies: aeDevDependencies } = require(
  join(__dirname, '..', 'package.json'),
)

/**
 * @param {string[]} packageNames
 * @returns {Record<string, string>}
 */
function getCompatibleDevDependencies(packageNames) {
  const devDependencies = {}

  for (const packageName of packageNames) {
    devDependencies[packageName] = aeDevDependencies[packageName]
  }

  return devDependencies
}

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
  const subscriptionsTransport = api.prompts.subscriptionsTransport

  api.render('./templates/base')
  const hasTypescript = api.prompts.typescript === true
  api.render(`./templates/${hasTypescript ? 'typescript' : 'no-typescript'}`, {
    hasVite: api.hasVite,
    hasSubscriptions,
    subscriptionsTransport,
  })

  if (subscriptionsTransport === 'ws') {
    api.extendPackageJson({
      dependencies: getCompatibleDevDependencies(['graphql-ws']),
    })
  } else if (subscriptionsTransport === 'sse') {
    api.extendPackageJson({
      dependencies: getCompatibleDevDependencies(['graphql-sse']),
    })
  }

  api.extendJsonFile('.vscode/extensions.json', {
    recommendations: ['apollographql.vscode-apollo'],
  })
}
