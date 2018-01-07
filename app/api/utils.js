const jwt = require('jsonwebtoken');
const User = require('../models/user');
const utils = require('./utils.js');
const Boom = require('boom');

const tokenPassword = 'secretpasswordnotrevealedtoanyone';

exports.createToken = function (user) {
  return jwt.sign(
      { id: user._id, email: user.email }, tokenPassword, {
    algorithm: 'HS256',
    expiresIn: '1h',
  });
};

exports.decodeToken = function (token) {
  const userInfo = {};
  try {
    const decoded = jwt.verify(token, tokenPassword);
    console.log('decoded:' + decoded);
    userInfo.userId = decoded.id;
    userInfo.email = decoded.email;
  } catch (e) {
    console.log('error decoding token');
  }

  return userInfo;
};

exports.validate = function (decoded, request, callback) {
  User.findOne({ _id: decoded.id })
      .then(user => {
        if (user !== null) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      })
      .catch(err => {
        callback(null, false);
      });
};

exports.getUserIdFromRequest = function (request) {
  let userId = null;
  try {
    // removed 'bearer' prefix in authorization header
    // no longer need split by space
    const token = request.headers.authorization;
    const decodedToken = utils.decodeToken(token);
    userId = decodedToken.userId;
  } catch (e) {
    userId = null;
  }

  return userId;
};
