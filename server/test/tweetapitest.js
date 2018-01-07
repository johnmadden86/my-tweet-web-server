'use strict';

const assert = require('chai').assert;
const TweetService = require('./tweet-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('Tweet API tests', function () {

  const tweetService = new TweetService(fixtures.tweetService);
  let users = fixtures.users;
  let tweetsData = fixtures.tweets;

  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  before(function () {
    tweetService.deleteAllTweets();
    tweetService.delete();
    for (let i = 0; i < users.length; i++) {
      tweetService.createUser(users[i]);
    }
  });



  beforeEach(function () {
    //tweetService.login(users[0]);
  });

  afterEach(function () {
    tweetService.logout();
  });

  test('create a tweet', function () {
    let returnedTweets = tweetService.getTweets();
    const oldLength = returnedTweets.length;
    let newTweet = tweetService.newTweet(tweetsData[0]);
    returnedTweets = tweetService.getTweets();
    const newLength = returnedTweets.length;
    assert.equal(newLength - oldLength, 1);
    assert.isDefined(newTweet._id);
    assert.isDefined(newTweet.date);
    assert.isDefined(newTweet.author);
    assert.deepEqual(newTweet.text, tweetsData[0].text);
  });

  test('get one tweet (by id), get all tweets', function () {
    let newTweet = tweetService.newTweet(tweetsData[1]);
    const returnedTweet = tweetService.getTweet(newTweet._id.toString());
    assert.isDefined(returnedTweet._id);
    assert.isDefined(returnedTweet.date);
    assert.isDefined(returnedTweet.author);
    assert.deepEqual(returnedTweet.text, newTweet.text);

    // get all tweets
    for (let i = 2; i < tweetsData.length; i++) {
      tweetService.newTweet(tweetsData[i]);
    }

    let allTweets = tweetService.getTweets();
    assert.equal(allTweets.length, tweetsData.length);
  });

  test('delete one tweet, all tweets', function () {
    let allTweets = tweetService.getTweets();
    const tweetCount = allTweets.length;

    const randomTweetId = allTweets[getRndInteger(0, allTweets.length)]._id;
    tweetService.deleteOneTweet(randomTweetId);
    allTweets = tweetService.getTweets();
    assert.isNull(tweetService.getTweet(randomTweetId.toString));
    assert.equal(allTweets.length, tweetCount - 1);

    assert.isAbove(allTweets.length, 0);
    tweetService.deleteAllTweets();
    allTweets = tweetService.getTweets();
    assert.equal(allTweets.length, 0);
  });

  test('get all tweets for user', function () {
    users.forEach(function (user) {
      tweetService.login(user);
      tweetsData.forEach(function (tweet) {
        const newTweet = {
          text: tweet.text + ' ' + user.firstName,
        };
        tweetService.newTweet(newTweet);
      });

      tweetService.logout();
    });

    for (let i = 0; i < users.length; i++) {
      tweetService.login(users[i]);
      let allUsers = tweetService.getUsers();
      let user = allUsers[i];
      let allTweetsForUser = tweetService.getAllTweetsForUser(user._id);
      const rndTweet = allTweetsForUser[getRndInteger(0, allTweetsForUser.length)];
      assert.equal(rndTweet.author._id, user._id);
      assert.include(rndTweet.text, user.firstName);
      assert.equal(allTweetsForUser.length, tweetsData.length);

      tweetService.deleteAllTweetsForUser(user._id);
      allTweetsForUser = tweetService.getAllTweetsForUser(user._id);
      assert.equal(allTweetsForUser.length, 0);
      tweetService.logout();
    }
  });

  test('get all tweets by follows - timeline', function () {
    tweetService.deleteAllTweets();
    for (let i = 2; i < users.length; i++) {
      tweetService.createUser(users[i]);
    }

    tweetService.login(users[0]);
    const allUsers = tweetService.getUsers();
    tweetService.logout();
    for (let i = 0; i< users.length; i++) {
      tweetsData.forEach(function (tweet) {
        const newTweet = {
          text: tweet.text + ' ' + users[i].firstName,
        };
        tweetService.login(users[i]);
        tweetService.newTweet(newTweet);
        tweetService.logout();
      });
    }

    tweetService.login(users[0]);
    let array = [];
    for (let i = 1; i < allUsers.length; i++) {
      tweetService.follow(allUsers[i]._id);
      array = array.concat(tweetService.getAllTweetsForUser(allUsers[i]._id));
    }

    const timeline = tweetService.getTimeline(allUsers[0]._id);

    array.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });

    assert.deepEqual(timeline, array);
  });


});
