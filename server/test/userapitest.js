'use strict';

const assert = require('chai').assert;
// const request = require('sync-request');
const DonationService = require('./donation-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');
const uuid = require('uuid');

suite('User API tests', function () {

  let users = fixtures.users;
  let newUser = fixtures.newUser;

  const donationService = new DonationService(fixtures.donationService);

  beforeEach(function () {
    donationService.deleteAllUsers();
  });

  afterEach(function () {
    donationService.deleteAllUsers();
  });

  test('create a user', function () {
    const returnedUser = donationService.createUser(newUser);
    assert(_.some([returnedUser], newUser), 'returnedUser must be a superset of newUser');
    assert.isDefined(returnedUser._id);
  });

  test('get user', function () {
    const u1 = donationService.createUser(newUser);
    const u2 = donationService.getUser(u1._id);
    assert.deepEqual(u1, u2);
  });

  test('get invalid user', function () {
    const id = uuid();
    const u = donationService.getUser(id);
    assert.isNull(u);
  });

  test('delete a user', function () {
    const c = donationService.createUser(newUser);
    assert(donationService.getUser(c._id) !== null);
    donationService.deleteOneUser(c._id);
    assert(donationService.getUser(c._id) === null);
  });

  test('get all users', function () {
    for (let u of users) {
      donationService.createUser(u);
    }

    const allUsers = donationService.getUsers();
    assert.equal(allUsers.length, users.length);
  });

  test('get users detail', function () {
    for (let u of users) {
      donationService.createUser(u);
    }

    const allUsers = donationService.getUsers();
    for (let i = 0; i < users.length; i++) {
      assert(_.some([allUsers[i]], users[i]), 'returnedUser must be a superset of newUser');
    }
  });

  test('get all users empty', function () {
    const allUsers = donationService.getUsers();
    assert.equal(allUsers.length, 0);
  });

  /*
  test('get users', function () {
    const url = 'http://localhost:4000/api/users';
    let res = request('GET', url);
    const users = JSON.parse(res.getBody('utf8'));
    assert.equal(3, users.length);

    assert.equal(users[0].firstName, 'Homer');
    assert.equal(users[0].lastName, 'Simpson');
    assert.equal(users[0].email, 'homer@simpson.com');
    assert.equal(users[0].password, 'secret');

    assert.equal(users[1].firstName, 'Marge');
    assert.equal(users[1].lastName, 'Simpson');
    assert.equal(users[1].email, 'marge@simpson.com');
    assert.equal(users[1].password, 'secret');

    assert.equal(users[2].firstName, 'Bart');
    assert.equal(users[2].lastName, 'Simpson');
    assert.equal(users[2].email, 'bart@simpson.com');
    assert.equal(users[2].password, 'secret');
  });

  test('get one user', function () {
    const allUsersUrl = 'http://localhost:4000/api/users';
    let res = request('GET', allUsersUrl);
    const users = JSON.parse(res.getBody('utf8'));

    const oneUserUrl = allUsersUrl + '/' + users[0]._id;
    res = request('GET', oneUserUrl);
    const oneUser = JSON.parse(res.getBody('utf8'));

    assert.equal(oneUser.firstName, 'Homer');
    assert.equal(oneUser.lastName, 'Simpson');
    assert.equal(oneUser.email, 'homer@simpson.com');
    assert.equal(oneUser.password, 'secret');

  });

  test('delete a user', function () {
    const allUsersUrl = 'http://localhost:4000/api/users';
    let res = request('GET', allUsersUrl);
    let oldUsers = JSON.parse(res.getBody('utf8'));

    function randomIndex() {
      return Math.floor(Math.random() * oldUsers.length);
    }

    let index = randomIndex();
    const oneUserUrl = allUsersUrl + '/' + oldUsers[index]._id;

    request('DELETE', oneUserUrl);
    res = request('GET', allUsersUrl);
    const newUsers = JSON.parse(res.getBody('utf8'));

    oldUsers.splice(index, 1);
    assert.deepEqual(newUsers, oldUsers);
  });

  test('delete all users', function () {
    const allUsersUrl = 'http://localhost:4000/api/users';
    request('DELETE', allUsersUrl);
    const res = request('GET', allUsersUrl);
    const newUsers = JSON.parse(res.getBody('utf8'));
    assert.deepEqual(newUsers, []);
  });
  */

});
