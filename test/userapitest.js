'use strict';

const assert = require('chai').assert;
const request = require('sync-request');

suite('User API tests', function () {

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

  test('create a user', function () {
    const usersUrl = 'http://localhost:4000/api/users';
    const newUser = {
      firstName: 'Maggie',
      lastName: 'Simpson',
      email: 'maggie@simpson.com',
      password: 'secret',
    };
    const res = request('POST', usersUrl, { json: newUser });
    const returnedUser = JSON.parse(res.getBody('utf8'));

    assert.equal(returnedUser.firstName, 'Maggie');
    assert.equal(returnedUser.lastName, 'Simpson');
    assert.equal(returnedUser.email, 'maggie@simpson.com');
    assert.equal(returnedUser.password, 'secret');
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
});
