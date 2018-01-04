const UsersApi = require('./app/api/usersapi');
const TweetsApi = require('./app/api/tweetsapi');

module.exports = [
  { method: 'GET', path: '/api/users/{id}', config: UsersApi.findOne },
  { method: 'GET', path: '/api/users', config: UsersApi.findAll },
  { method: 'POST', path: '/api/users', config: UsersApi.create },
  { method: 'POST', path: '/api/users/authenticate', config: UsersApi.authenticate },
  { method: 'DELETE', path: '/api/users/{id}', config: UsersApi.deleteOne },
  { method: 'DELETE', path: '/api/users', config: UsersApi.deleteAll },

  { method: 'POST', path: '/api/tweets', config: TweetsApi.newTweet },

  { method: 'GET', path: '/api/tweets/{id}', config: TweetsApi.findOne },
  { method: 'GET', path: '/api/tweets', config: TweetsApi.findAll },
    // find All for User


  { method: 'DELETE', path: '/api/tweets/{id}', config: TweetsApi.deleteOne },
  { method: 'DELETE', path: '/api/tweets', config: TweetsApi.deleteAll },
    // delete all for user
];

