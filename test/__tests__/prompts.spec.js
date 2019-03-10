const prompts = require('../../src/prompts.js')

test('exports properly', () => {
	expect(Array.isArray(prompts())).toBe(true)
})
