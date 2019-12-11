const extract = require('./lib/extract');
const init = require('./lib/init');
const create = require('./lib/create');

module.exports = {
  extract,
  initialize: init,
  makeSnippet: create,
};
