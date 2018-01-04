'use strict';

const User = require('../models/user');
const Boom = require('boom');
const utils = require('./utils');

exports.findAll = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    User.find({}).exec()
        .then(users => {
          reply(users);
        }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },
};

exports.findOne = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    User.findOne({ _id: request.params.id })
        .then(user => {
          reply(user);
        }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

exports.create = {
  auth: false,
  handler: function (request, reply) {
    const user = new User(request.payload);
    user.admin = false;
    user.save()
        .then(newUser => {
          reply(newUser).code(201);
        }).catch(err => {
      reply(Boom.badImplementation('error creating user'));
    });
  },
};

exports.deleteAll = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    User.remove({})
        .then(err => {
          reply().code(204);
        }).catch(err => {
      reply(Boom.badImplementation('error removing users'));
    });
  },
};

exports.deleteOne = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    User.remove({ _id: request.params.id }).then(user => {
      reply(user).code(204);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

exports.authenticate = {
  auth: false,
  handler: function (request, reply) {
    const user = request.payload;
    User.findOne({ email: user.email })
        .then(foundUser => {
          if (foundUser && foundUser.password === user.password) {
            const token = utils.createToken(foundUser);
            reply({
              success: true,
              token: token,
              user: foundUser,
            }).code(201);
          } else {
            reply({
              success: false,
              message: 'Authentication failed. User not found.',
            }).code(201);
          }
        })
        .catch(err => {
          reply(Boom.notFound('internal db failure'));
        });
  },

};
