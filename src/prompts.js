/**
 * Quasar App Extension prompts script
 *
 * Inquirer prompts
 * (answers are available as "api.prompts" in the other scripts)
 * https://www.npmjs.com/package/inquirer#question
 *
 */

module.exports = function () {
  return [
	  {
		  name: 'options',
		  type: 'checkbox',
		  required: true,
		  message:
			  'AVA Unit testing will now be installed. Please choose additional options:',
		  choices: [
			  {
				  name: 'Install Server',
				  value: 'server'
			  },
			  {
				  name: 'Install Apollo',
				  value: 'apollo'
			  }
		  ]
	  }
  ]
}
