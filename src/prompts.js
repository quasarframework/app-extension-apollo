/* eslint-env node */
module.exports = function () {
  return [
    {
      name: 'typescript',
      type: 'confirm',
      message: 'Does your app have typescript support?',
      default: false,
    },
  ]
}
