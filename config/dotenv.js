const dotenv = require('dotenv');
var dotenvExpand = require('dotenv-expand');
const result = dotenvExpand(dotenv.config());

if (result.error) {
  throw result.error;
}

const { parsed: envs } = result;

module.exports = envs;
