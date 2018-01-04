'use strict';

const SyncHttpService = require('./sync-http-service');
const fixtures = require('./fixtures.json');

const baseUrl = fixtures.tweetService;

class TweetService {

  constructor(baseUrl) {
    this.httpService = new SyncHttpService(baseUrl);
  }

  login(user) {
    return this.httpService.setAuth('/api/users/authenticate', user);
  }

  logout() {
    this.httpService.clearAuth();
  }

  createUser(newUser) {
    return this.httpService.post('/api/users', newUser);
  }

  getUser(id) {
    return this.httpService.get('/api/users/' + id);
  }

  getUsers() {
    return this.httpService.get('/api/users');
  }

  deleteOneUser(id) {
    return this.httpService.delete('/api/users/' + id);
  }

  deleteAllUsers() {
    return this.httpService.delete('/api/users');
  }

  newTweet(newTweet) {
    return this.httpService.post('/api/tweets', newTweet);
  }

  getTweet(id) {
    return this.httpService.get('/api/tweets/' + id);
  }

  getTweets() {
    return this.httpService.get('/api/tweets');
  }

  deleteOneTweet(id) {
    return this.httpService.delete('/api/tweets/' + id);
  }

  deleteAllTweets() {
    return this.httpService.delete('/api/tweets');
  }
}

module.exports = TweetService;
