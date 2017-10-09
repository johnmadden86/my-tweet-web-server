'use strict';

const Joi = require('joi');
const User = require('../models/user');

function setCookie(request, userId) {
  request.cookieAuth.set({
    loggedIn: true,
    loggedInUser: userId,
  });
}

exports.main = {
  auth: false,
  handler: function (request, reply) {
    reply.view('main', { title: 'Welcome to Donations' });
  },
};

exports.signup = {
  auth: false,
  handler: function (request, reply) {
    reply.view('signup', { title: 'Sign up for Donations' });
  },
};

exports.login = {
  auth: false,

  handler: function (request, reply) {
    reply.view('login', { title: 'Login to Donations' });
  },
};

exports.register = {
  auth: false,

  validate: {
    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
    options: {
      abortEarly: false,
    },
    failAction: function (request, reply, source, error) {
      reply.view('signup', {
        title: 'Sign up error',
        errors: error.data.details,
      }).code(400);
    },
  },

  handler:
      function (request, reply) {
        const user = new User(request.payload);
        user.save().then(newUser => {
          setCookie(request, user._id);
          reply.redirect('/home');
        }).catch(err => {
          reply.redirect('/');
        });
      },
};

exports.authenticate = {
  auth: false,

  validate: {
    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    options: {
      abortEarly: false,
    },

    failAction: function (request, reply, source, error) {
      reply.view('login', {
        title: 'Sign up error',
        errors: error.data.details,
      }).code(400);
    },
  },

  handler: function (request, reply) {
    const user = request.payload;
    User.findOne({ id: user._id }).then(foundUser => {
      if (foundUser && foundUser.password === user.password) {
        setCookie(request, user._id);
        reply.redirect('/home');
      } else {
        reply.redirect('/login');
      }
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.logout = {
  auth: false,
  handler: function (request, reply) {
    reply.redirect('/');
  },
};

exports.viewSettings = {
  handler: function (request, reply) {
    const userId = request.auth.credentials.loggedInUser;
    User.findOne({ id: userId }).then(foundUser => {
      reply.view('settings', { title: 'Edit Account Settings', user: foundUser });
    }).catch(err => {
      reply.redirect('/home');
    });
  },
};

exports.updateSettings = {
  validate: {
    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
    options: {
      abortEarly: false,
    },
    failAction: function (request, reply, source, error) {
      reply.view('settings', {
        title: 'Sign up error',
        errors: error.data.details,
      }).code(400);
    },
  },

  handler: function (request, reply) {
    const currentUserId = request.auth.credentials.loggedInUser;
    const updatedUser = request.payload;
    User.findOne({ id: currentUserId }).then(foundUser => {
      foundUser.firstName = updatedUser.firstName;
      foundUser.lastName = updatedUser.lastName;
      foundUser.email = updatedUser.email;
      foundUser.password = updatedUser.password;
      return foundUser.save();
    }).then(user => {
      reply.view('settings', { title: 'Edit Account Settings', user: user });
    });
  },
};

