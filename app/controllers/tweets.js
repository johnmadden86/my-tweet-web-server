'use strict';

const Joi = require('joi');
const Tweet = require('../models/tweet');
const User = require('../models/user');

function getLoggedInUser(request) {
  const userId = request.auth.credentials.loggedInUser;
  return User.findOne({ _id: userId });
}

function getAllUsers() {
}

exports.home = {
  handler: function (request, reply) {
    getLoggedInUser(request).then(user => {
      reply.view('home', {
        title: 'New Tweet',
        user: user,
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.timeline = {
  handler: function (request, reply) {
    getLoggedInUser(request).then(loggedInUser => {
      User.find({}).then(user => {
        Tweet.find({}).populate('author')
            .then(allTweets => {
              reply.view('timeline', {
                title: 'Timeline',
                tweets: allTweets,
                user: loggedInUser,
              });
            }).catch(err => {
          reply.redirect('./home');
        });
      });
    });
  },
};

exports.profile = {
  handler: function (request, reply) {
    getLoggedInUser(request).then(user => {
      Tweet.find({ author: user }).populate('author')
          .then(allTweets => {
            reply.view('profile', {
              title: 'Profile',
              tweets: allTweets,
              user: user,
            });
          }).catch(err => {
        reply.redirect('./home');
      });
    });
  },
};


exports.tweet = {
  validate: {
    payload: {
      text: Joi.required(),
    },
    options: {
      abortEarly: false,
    },
    failAction: function (request, reply, source, error) {
      getLoggedInUser(request).then(user => {
            reply.view('home', {
              title: 'New Tweet',
              user: user,
              errors: error.data.details,
            }).code(400);
          }).catch(err => {
        reply.redirect('./home');
      });

    },
  },

  handler: function (request, reply) {
    getLoggedInUser(request).then(user => {
      const data = request.payload;
      data.date = new Date();
      data.author = user;
      new Tweet(data).save()
          .then(newTweet => {
            reply.redirect('./timeline');
          }).catch(err => {
        reply.redirect('/home');
      });
    });
  },
};
