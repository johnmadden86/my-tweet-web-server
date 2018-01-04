'use strict';

const assert = require('chai').assert;
const TweetService = require('./tweet-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('Tweet API tests', function () {

  let users = fixtures.users;
  let tweets = fixtures.tweets;
  let newTweet = fixtures.tweets[0];

  const tweetService = new TweetService(fixtures.tweetService);

  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  beforeEach(function () {
    tweetService.login(users[0]);
    tweetService.deleteAllTweets();
  });

  afterEach(function () {
    tweetService.deleteAllTweets();
    tweetService.logout();
  });

  test('get one tweet', function () {
    for (let i = 0; i < tweets.length; i++) {
      tweetService.newTweet(tweets[i]);
    }

    const returnedTweets = tweetService.getTweets();
    const i = getRndInteger(0, tweets.length);
    const randomTweet = returnedTweets[i];
    const returnedTweet = tweetService.getTweet(randomTweet._id);
    delete returnedTweet._id;
    delete returnedTweet.__v;
    assert.deepEqual(tweets[i], returnedTweet);
  });

  test('create a tweet', function () {
    tweetService.newTweet(newTweet);
    const returnedTweets = tweetService.getTweets();
    assert.equal(returnedTweets.length, 1);
    assert.isDefined(returnedTweets[0].author);
    delete returnedTweets[0]._id;
    delete returnedTweets[0].__v;
    delete returnedTweets[0].author;
    assert.deepEqual(newTweet, returnedTweets[0]);
  });

  test('create multiple tweets', function () {
    for (let i = 0; i < tweets.length; i++) {
      tweetService.newTweet(tweets[i]);
    }

    const returnedTweets = tweetService.getTweets();
    assert.equal(returnedTweets.length, tweets.length);
    for (let i = 0; i < tweets.length; i++) {
      delete returnedTweets[i]._id;
      delete returnedTweets[i].__v;
      assert.deepEqual(tweets[i], returnedTweets[i]);
    }
  });

  test('delete all tweets', function () {
    for (let i = 0; i < tweets.length; i++) {
      tweetService.newTweet(tweets[i]);
    }

    const d1 = tweetService.getTweets();
    assert.equal(d1.length, tweets.length);
    tweetService.deleteAllTweets();
    const d2 = tweetService.getTweets();
    assert.equal(d2.length, 0);
  });

  test('delete one tweet', function () {
    const tweetCount = tweets.length;
    for (let i = 0; i < tweets.length; i++) {
      tweetService.newTweet(tweets[i]);
    }

    const returnedTweets = tweetService.getTweets();
    const randomTweet = returnedTweets[getRndInteger(0, tweets.length)];
    tweetService.deleteOneTweet(randomTweet._id);
    assert.equal(returnedTweets.length, tweetCount - 1);
  });

});
