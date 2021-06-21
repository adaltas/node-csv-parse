require('module').prototype.options = {
  // transpile: require('./babel.config'),
  node: ['--input-type=module', '--require=esm']
}
require('coffeescript/register')
