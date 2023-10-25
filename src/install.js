/* eslint-env node */
const { join } = require('path')

// https://github.com/quasarframework/quasar-testing/blob/75e4fb524fd7767492a1cac66fe8169a5b29b6a6/packages/e2e-cypress/src/install.js#L11-L39
// We need to use this because only the last `api.extendPackageJson` is executed, if multiple calls are made.
/**
 * Performs a deep merge of objects and returns new object. Does not modify
 * objects (immutable) and merges arrays via concatenation.
 * based on https://stackoverflow.com/a/49798508
 *
 * @param {...object} sources - Objects to merge
 * @returns {object} New object with merged key/values
 */

function __mergeDeep(...sources) {
  let result = {}
  for (const source of sources) {
    if (source instanceof Array) {
      if (!(result instanceof Array)) {
        result = []
      }
      result = [...result, ...source]
    } else if (source instanceof Object) {
      // eslint-disable-next-line prefer-const
      for (let [key, value] of Object.entries(source)) {
        if (value instanceof Object && key in result) {
          value = __mergeDeep(result[key], value)
        }
        result = { ...result, [key]: value }
      }
    }
  }
  return result
}

// https://github.com/quasarframework/quasar-testing/blob/75e4fb524fd7767492a1cac66fe8169a5b29b6a6/packages/e2e-cypress/src/install.js#L41-L55
// We use devDependencies instead of peerDependencies because devDependencies are usually the latest version
// and peerDependencies could contain a string supporting multiple major versions (e.g. "graphql": "^15.0.0 || ^16.0.0")
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

let extendPackageJson = {
  dependencies: getCompatibleDevDependencies([
    '@apollo/client',
    '@vue/apollo-composable',
    'graphql',
  ]),
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

  if (api.prompts.gqlTag) {
    extendPackageJson = __mergeDeep(extendPackageJson, {
      dependencies: getCompatibleDevDependencies(['graphql-tag']),
    })
  }

  if (subscriptionsTransport === 'ws') {
    extendPackageJson = __mergeDeep(extendPackageJson, {
      dependencies: getCompatibleDevDependencies(['graphql-ws']),
    })
  } else if (subscriptionsTransport === 'sse') {
    extendPackageJson = __mergeDeep(extendPackageJson, {
      dependencies: getCompatibleDevDependencies(['graphql-sse']),
    })
  }

  api.extendPackageJson(extendPackageJson)

  api.extendJsonFile('.vscode/extensions.json', {
    recommendations: ['apollographql.vscode-apollo'],
  })
}
