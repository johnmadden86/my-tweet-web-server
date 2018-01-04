'use strict';

const assert = require('chai').assert;
const TweetService = require('./tweet-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');
const uuid = require('uuid');

suite('User API tests', function () {

  let users = fixtures.users;
  let newUser = fixtures.newUser;

  const tweetService = new TweetService(fixtures.tweetService);

  beforeEach(function () {
    tweetService.login(users[0]);

    //tweetService.deleteAllUsers();
  });

  afterEach(function () {
    //tweetService.deleteAllUsers();
    tweetService.logout();
  });

  test('create a user', function () {
    const returnedUser = tweetService.createUser(newUser);
    assert(_.some([returnedUser], newUser), 'returnedUser must be a superset of newUser');
    assert.isDefined(returnedUser._id);
  });

  test('get user', function () {
    const u1 = tweetService.createUser(newUser);
    const u2 = tweetService.getUser(u1._id);
    assert.deepEqual(u1, u2);
  });

  test('get invalid user', function () {
    const u1 = tweetService.getUser(uuid());
    assert.isNull(u1);
  });

  test('delete a user', function () {
    const u = tweetService.createUser(newUser);
    const returnedUsers = tweetService.getUsers();
    const userId = returnedUsers[0]._id;
    assert(tweetService.getUser(userId) != null);
    tweetService.deleteOneUser(userId);
    assert(tweetService.getUser(userId) == null);
  });

  // test('get all users', function () {
  //   for (let u of users) {
  //     tweetService.createUser(u);
  //   }
  //
  //   const allUsers = tweetService.getUsers();
  //   assert.equal(allUsers.length, users.length);
  // });

  test('get users detail', function () {
    for (let i = 0; i < users.length; i++) {
      tweetService.createUser(users[i]);
    }

    const allUsers = tweetService.getUsers();
    for (let i = 0; i < users.length; i++) {
      delete allUsers[i]._id;
      delete allUsers[i].__v;
      delete allUsers[i].tweets;
      assert.deepEqual(allUsers[i], users[i]);
    }
  });

  // test('get all users empty', function () {
  //   const allUsers = tweetService.getUsers();
  //   assert.equal(allUsers.length, 0);
  // });
});
