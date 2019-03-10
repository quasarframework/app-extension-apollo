const install = require('../../src/install.js')

test('exports properly', () => {
	expect(install()).toBe(true)
})
