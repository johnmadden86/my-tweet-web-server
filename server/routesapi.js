const UsersApi = require('./app/api/usersapi');
const TweetsApi = require('./app/api/tweetsapi');

module.exports = [
  { method: 'POST', path: '/api/users/authenticate', config: UsersApi.authenticate },

  { method: 'POST', path: '/api/users', config: UsersApi.create },
  { method: 'POST', path: '/api/users/admin', config: UsersApi.createAdmin },

  { method: 'GET', path: '/api/users/{id}', config: UsersApi.findOne },
  { method: 'GET', path: '/api/users', config: UsersApi.findAll },
  { method: 'GET', path: '/api/users/admin', config: UsersApi.findAdmins },
  { method: 'GET', path: '/api/users/~', config: UsersApi.findNonAdmins },

  { method: 'DELETE', path: '/api/users/{id}', config: UsersApi.deleteOne },
  { method: 'DELETE', path: '/api/users', config: UsersApi.deleteAll },

  { method: 'POST', path: '/api/users/{id}', config: UsersApi.updateDetails },
  { method: 'GET', path: '/api/users/{id}/follow', config: UsersApi.follow },
  { method: 'GET', path: '/api/users/{id}/unfollow', config: UsersApi.unfollow },

  { method: 'POST', path: '/api/tweets', config: TweetsApi.newTweet },

  { method: 'GET', path: '/api/tweets/{id}', config: TweetsApi.findOne },
  { method: 'GET', path: '/api/tweets', config: TweetsApi.findAll },
  // TODO { method: 'GET', path: '/api/tweets', config: TweetsApi.findAllForUser },
  // TODO { method: 'GET', path: '/api/tweets', config: TweetsApi.findAllBySearchString },
  // TODO { method: 'GET', path: '/api/tweets', config: TweetsApi.findAllByFollowing },

  { method: 'DELETE', path: '/api/tweets/{id}', config: TweetsApi.deleteOne },
  { method: 'DELETE', path: '/api/tweets', config: TweetsApi.deleteAll },
  // TODO { method: 'DELETE', path: '/api/tweets', config: TweetsApi.deleteAllForUser },
  // TODO { method: 'DELETE', path: '/api/tweets', config: TweetsApi.deleteAllBySearchString },
];

