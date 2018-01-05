'use strict';

const User = require('../models/user');
const Boom = require('boom');
const utils = require('./utils');

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

exports.createAdmin = {
  auth: false,
  handler: function (request, reply) {
    const user = new User(request.payload);
    user.admin = true;
    user.save()
        .then(newUser => {
          reply(newUser).code(201);
        }).catch(err => {
      reply(Boom.badImplementation('error creating user'));
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

exports.findAdmins = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    User.find({ admin: true })
        .then(user => {
          reply(user);
        }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

exports.findNonAdmins = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    User.find({ admin: false })
        .then(user => {
          reply(user);
        }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

exports.deleteOne = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    User.remove({ _id: request.params.id })
        .then(user => {
          reply(user).code(204);
        }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

exports.deleteAll = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    User.remove({ admin: false })
        .then(err => {
          reply().code(204);
        }).catch(err => {
      reply(Boom.badImplementation('error removing users'));
    });
  },
};

exports.updateDetails = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    const newDetails = request.payload;
    const userId = utils.getUserIdFromRequest(request);
    User.findOne({ _id: userId })
        .then(user => {
          user.firstName = newDetails.firstName;
          user.lastName = newDetails.lastName;
          user.email = newDetails.email;
          user.password = newDetails.password;
          user.save()
              .then(user => {
                reply(user).code(201);
              })
              .catch(err => {
                reply(Boom.badImplementation('error updating details'));
              });
        })
        .catch(err => {
          reply(Boom.notFound('internal db failure, User not found'));
          console.log('User not found');
        });
  },
};

exports.follow = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    const userIdToFollow = request.url.query._id;
    console.log('userToFollow ' + userIdToFollow);
    const currentUserId = request.params.id;
    console.log(currentUserId);
    User.findOne({ _id: currentUserId })
        .then(user => {
          const index = user.following.indexOf(userIdToFollow);
          if (index === -1) {
            // prevent duplication
            user.following.push(userIdToFollow);
          }

          user.save()
            .then(user => {
              reply(user).code(201);
            })
            .catch(err => {
              reply(Boom.badImplementation('error following user'));
            });
        })
        .catch(err => {
      reply(Boom.notFound('internal db failure, User not found'));
    });
  },
};


exports.unfollow = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    const userIdToUnfollow = request.url.query._id;
    console.log('userToFollow ' + userIdToUnfollow);
    const currentUserId = request.params.id;
    console.log(currentUserId);
    User.findOne({ _id: currentUserId })
        .then(user => {
          const index = user.following.indexOf(userIdToUnfollow);
          if (index > -1) {
            // ensure item in in array before attempting to remove
            user.following.splice(index, 1);
          }

          user.save()
            .then(user => {
              reply(user).code(201);
            })
            .catch(err => {
              reply(Boom.badImplementation('error following user'));
            });
        })
        .catch(err => {
      reply(Boom.notFound('internal db failure, User not found'));
    });
  },
};
