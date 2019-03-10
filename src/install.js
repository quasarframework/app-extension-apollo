/**
 * Quasar App Extension install script
 *
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/InstallAPI.js
 */

/**
 * @param {function} api
 * @returns {boolean}
 */
module.exports = function (api) {
	console.log('NOT READY FOR USE')
	api.render('./base', {}, true)
	return true
}
