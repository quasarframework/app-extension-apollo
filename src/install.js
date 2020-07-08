const fs = require('fs')

// get the html that will be injected inside 'src/index.template.html'
let graphqlHtml
if(api.getPackageVersion('@quasar/app') >= '2.0.0') {
  graphqlHtml = require('./exportsV2').graphqlHtml
} else {
  graphqlHtml = require('./exports').graphqlHtml
}

module.exports = function (api) {
  // get the app html template
  const template = api.resolve.src('index.template.html')

  // read the template
  fs.readFile(template, 'utf8', function (err, html) {
    if (err) { return console.log(err) }

    // find the position of the closing body tag
    const bodyEnd = html.lastIndexOf('</body>')

    // add the graphql html at the end of the 'body' element
    const newHtml = html.substring(0, bodyEnd) + graphqlHtml + html.substring(bodyEnd)

    // write the resulting html to the template
    fs.writeFile(template, newHtml, 'utf8', function (err) {
      if (err) { return console.log(err) }
    })
  })

  // render templates in the app
  api.render('./templates', { prompts: api.prompts })
}
