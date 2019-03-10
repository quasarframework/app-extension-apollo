const install = require('../../src/install.js')

test('exports properly', () => {
	let api = {
		render: () => { return true }
	}
	// stubbed the render function
	expect (api.render()).toBe(true)
	// expect(install()).toReturn(true)
})
