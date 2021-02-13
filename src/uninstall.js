const fs = require('fs');

module.exports = function (api) {
// get the graphql html that will be removed from 'src/index.template.html'
  let graphqlHtml

  if (api.getPackageVersion('@quasar/app') >= '2.0.0') {
    graphqlHtml = require('./exportsV2').graphqlHtml
  } else {
    graphqlHtml = require('./exports').graphqlHtml
  }

  // get the app html template
  const template = api.resolve.src('index.template.html');

  // read the template
  fs.readFile(template, 'utf8', function (err, html) {
    if (err) {
      return console.log(err);
    }

    // remove the graphql html
    const newHtml = html.replace(graphqlHtml, '');

    // write the resulting html to the template
    fs.writeFile(template, newHtml, 'utf8', function (err) {
      if (err) {
        return console.log(err);
      }
    });
  });

  // remove added directory
  api.removePath('src/apollo');
};
