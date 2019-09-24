const crypto = require('crypto');

module.exports = str =>
  crypto
    .createHash('sha512')
    .update(str)
    .digest('hex');
