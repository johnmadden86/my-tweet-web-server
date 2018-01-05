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
    // tweetService.deleteAllTweets();
    tweetService.logout();
  });

  test('create a tweet', function () {
    let returnedTweets = tweetService.getTweets();
    const oldLength = returnedTweets.length;
    tweetService.newTweet(newTweet);
    returnedTweets = tweetService.getTweets();
    const newLength = returnedTweets.length;
    assert.equal(newLength - oldLength, 1);
    assert.isDefined(returnedTweets[0]._id);
    assert.isDefined(returnedTweets[0].date);
    assert.isDefined(returnedTweets[0].author);
    assert.deepEqual(newTweet.text, returnedTweets[0].text);
  });

  test('get one tweet (by id), get all tweets', function () {
    for (let i = 0; i < tweets.length; i++) {
      tweetService.newTweet(tweets[i]);
    }

    const returnedTweets = tweetService.getTweets();
    const i = getRndInteger(0, tweets.length);
    const randomTweet = returnedTweets[i];
    const returnedTweet = tweetService.getTweet(randomTweet._id);
    assert.isDefined(returnedTweet._id);
    assert.isDefined(returnedTweet.date);
    assert.isDefined(returnedTweet.author);
    assert.deepEqual(returnedTweet.text, tweets[i].text);

    // get all tweets

    assert.equal(returnedTweets.length, tweets.length);
  });

  test('delete one tweet, all tweets', function () {
    const tweetCount = tweets.length;
    for (let i = 0; i < tweets.length; i++) {
      tweetService.newTweet(tweets[i]);
    }

    let returnedTweets = tweetService.getTweets();
    const randomTweetId = returnedTweets[getRndInteger(0, tweets.length)]._id;
    tweetService.deleteOneTweet(randomTweetId);
    returnedTweets = tweetService.getTweets();
    assert.isNull(tweetService.getTweet(randomTweetId.toString));
    assert.equal(returnedTweets.length, tweetCount - 1);

    returnedTweets = tweetService.getTweets();
    assert.isAbove(returnedTweets.length, 0);
    tweetService.deleteAllTweets();
    returnedTweets = tweetService.getTweets();
    assert.equal(returnedTweets.length, 0);
  });

  test('get all tweets for user', function () {
    const allUsers = tweetService.getUsers();
    console.log(allUsers.length);
    tweetService.logout();
    allUsers.forEach(function (user) {
      tweets.forEach(function (tweet) {
        const newTweet = {
          text: tweet.text + ' ' + user.firstName,
        };
        tweetService.login(user);
        tweetService.newTweet(newTweet);
        tweetService.logout();
      });
    });

    tweetService.login(allUsers[0]);
    const rndUser = allUsers[getRndInteger(0, allUsers.length)];
    const allTweetsForUser = tweetService.getAllTweetsForUser(rndUser._id);
    const rndTweet = allTweetsForUser[getRndInteger(0, allTweetsForUser.length)];
    assert.equal(rndTweet.author, rndUser._id);
    assert.include(rndTweet.text, rndUser.firstName);
    assert.equal(allTweetsForUser.length, tweets.length);
  });

  test('get all tweets by follows (timeline', function () {
    let allUsers = tweetService.getUsers();
    tweetService.deleteAllUsers();
    for (let i = 0; i < users.length; i++) {
      tweetService.createUser(users[i]);
    }

    tweetService.login(allUsers[0]);
    allUsers = tweetService.getUsers();
    tweetService.logout();
    allUsers.forEach(function (user) {
      tweets.forEach(function (tweet) {
        const newTweet = {
          text: tweet.text + ' ' + user.firstName,
        };
        tweetService.login(user);
        tweetService.newTweet(newTweet);
        tweetService.logout();
      });
    });

    tweetService.login(allUsers[0]);
    let array = [];
    for (let i = 1; i < allUsers.length; i++) {
      tweetService.follow(allUsers[0]._id, allUsers[i]._id);
      array.concat(tweetService.getAllTweetsForUser(allUsers[i]._id));
    }

    const timeline = tweetService.getTimeline(allUsers[0]._id);

    array.sort(function (a, b) {
      return b.date - a.date;
    });

    assert.deepEqual(array, timeline);
  });
});
