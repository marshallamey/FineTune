/* eslint-disable global-require */
if (process.env.NODE_ENV === 'production') {
  // IN PRODUCTION! return production keys
  module.exports = require('./prod');
} else {
  // IN DEVELOPMENT! return dev keys
  module.exports = require('./dev');
}
/* eslint-enable */
