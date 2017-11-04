'use strict';

const assert = require('chai').assert;
const request = require('sync-request');

suite('Tweet API tests', function () {

  test('get tweets', function () {
    const url = 'http://localhost:4000/api/tweets';
    let res = request('GET', url);
    const tweets = JSON.parse(res.getBody('utf8'));
    assert.equal(3, tweets.length);

    assert.equal(tweets[0].text, 'my first tweet');
    //assert.typeof(tweets[0].date, 'date');
    assert.isNotNull(tweets[0].author);

    assert.equal(tweets[1].text, 'my second tweet');
    assert.typeof(tweets[1].date, 'date');
    assert.isNotNull(tweets[1].author);

    assert.equal(tweets[2].text, 'my third tweet');
    assert.typeof(tweets[2].date, 'date');
    assert.isNotNull(tweets[2].author);
  });

  test('get one tweet', function () {
    const allTweetsUrl = 'http://localhost:4000/api/tweets';
    let res = request('GET', allTweetsUrl);
    const tweets = JSON.parse(res.getBody('utf8'));

    const oneTweetUrl = allTweetsUrl + '/' + tweets[0]._id;
    res = request('GET', oneTweetUrl);
    const oneTweet = JSON.parse(res.getBody('utf8'));

    assert.equal(oneTweet.firstName, 'Homer');
    assert.equal(oneTweet.lastName, 'Simpson');
    assert.equal(oneTweet.email, 'homer@simpson.com');
    assert.equal(oneTweet.password, 'secret');

  });

  test('create a tweet', function () {
    const tweetsUrl = 'http://localhost:4000/api/tweets';
    const newTweet = {
      firstName: 'Maggie',
      lastName: 'Simpson',
      email: 'maggie@simpson.com',
      password: 'secret',
    };
    const res = request('POST', tweetsUrl, { json: newTweet });
    const returnedTweet = JSON.parse(res.getBody('utf8'));

    assert.equal(returnedTweet.firstName, 'Maggie');
    assert.equal(returnedTweet.lastName, 'Simpson');
    assert.equal(returnedTweet.email, 'maggie@simpson.com');
    assert.equal(returnedTweet.password, 'secret');
  });

  test('delete a tweet', function () {
    const allTweetsUrl = 'http://localhost:4000/api/tweets';
    let res = request('GET', allTweetsUrl);
    let oldTweets = JSON.parse(res.getBody('utf8'));

    function randomIndex() {
      return Math.floor(Math.random() * oldTweets.length);
    }

    let index = randomIndex();
    const oneTweetUrl = allTweetsUrl + '/' + oldTweets[index]._id;

    request('DELETE', oneTweetUrl);
    res = request('GET', allTweetsUrl);
    const newTweets = JSON.parse(res.getBody('utf8'));

    oldTweets.splice(index, 1);
    assert.deepEqual(newTweets, oldTweets);
  });

  test('delete all tweets', function () {
    const allTweetsUrl = 'http://localhost:4000/api/tweets';
    request('DELETE', allTweetsUrl);
    const res = request('GET', allTweetsUrl);
    const newTweets = JSON.parse(res.getBody('utf8'));
    assert.deepEqual(newTweets, []);
  });
});
