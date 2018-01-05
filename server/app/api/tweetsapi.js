'use strict';

const Tweet = require('../models/tweet');
const User = require('../models/user');
const Boom = require('boom');
const utils = require('./utils.js');

exports.findAll = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    Tweet.find({})
        .exec()
        .then(tweets => {
      reply(tweets);
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
    Tweet.findOne({ _id: request.params.id })
        .then(tweet => {
      reply(tweet);
    })
        .catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

exports.newTweet = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    const tweet = new Tweet(request.payload);
    tweet.date = new Date();
    tweet.author = utils.getUserIdFromRequest(request);
    tweet.save()
        .then(newTweet => {
          reply(newTweet).code(201);
          return Tweet.findOne(newTweet)
              .populate('author');
        }).catch(err => {
      reply(Boom.badImplementation('error creating tweet'));
    });
  },
};

exports.deleteAll = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    Tweet.remove({}).then(err => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing tweets'));
    });
  },
};

exports.deleteOne = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    Tweet.remove({ _id: request.params.id }).then(tweet => {
      reply(tweet).code(204);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};

exports.findAllForUser = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    Tweet.find({ author: request.params.id })
        .exec()
        .then(tweets => {
          reply(tweets);
        })
        .catch(err => {
          reply(Boom.notFound('id not found'));
        });
  },
};

exports.findAllByFollowing = {
  auth: {
    strategy: 'jwt',
  },
  handler: function (request, reply) {
    User.find({ _id: request.params.id })
        .then(user => {
          const timeline = [];
          user[0].following.forEach(author => {
            Tweet.find({ author: author })
                .exec()
                .then(tweets => {
                  tweets.forEach(function (tweet) {
                    timeline.push(tweet);
                  });

                  timeline.sort(function (a, b) {
                    return b.date - a.date;
                  });

                  reply(timeline);
                })
                .catch(err => {
                  reply(Boom.notFound('author not found'));
                });
          });
        })
        .catch(err => {
          reply(Boom.notFound('id not found'));
        });
  },
};
