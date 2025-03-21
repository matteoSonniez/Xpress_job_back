var jwt = require('jsonwebtoken');

const signJwt = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET);
}

module.exports = signJwt;
