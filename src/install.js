module.exports = function (api) {
  // Quasar compatibility check.
  api.compatibleWith('quasar', '>=2.0.0-beta.8 <3.0.0')
  api.compatibleWith('@quasar/app', '>=3.0.0-beta.8 <4.0.0')

  // Render templates in the app.
  if (api.prompts.typescript) {
    api.render('./templates')
  } else {
    api.render('../lib/templates')
  }
}
