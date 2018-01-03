'use strict';

const assert = require('chai').assert;
// const request = require('sync-request');
const DonationService = require('./donation-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('Candiate API tests', function () {

  let candidates = fixtures.candidates;
  let newCandidate = fixtures.newCandidate;

  const donationService = new DonationService(fixtures.donationService);

  beforeEach(function () {
    donationService.deleteAllCandidates();
  });

  afterEach(function () {
    donationService.deleteAllCandidates();
  });

  test('create a candidate', function () {
    const returnedCandidate = donationService.createCandidate(newCandidate);
    assert(_.some([returnedCandidate], newCandidate), 'returnedCandidate must be a superset of newCandidate');
    assert.isDefined(returnedCandidate._id);
  });

  test('get candidate', function () {
    const c1 = donationService.createCandidate(newCandidate);
    const c2 = donationService.getCandidate(c1._id);
    assert.deepEqual(c1, c2);
  });

  test('get invalid candidate', function () {
    const c1 = donationService.getCandidate('1234');
    assert.isNull(c1);
    const c2 = donationService.getCandidate('012345678901234567890123');
    assert.isNull(c2);
  });

  test('delete a candidate', function () {
    const c = donationService.createCandidate(newCandidate);
    assert(donationService.getCandidate(c._id) !== null);
    donationService.deleteOneCandidate(c._id);
    assert(donationService.getCandidate(c._id) === null);
  });

  test('get all candidates', function () {
    for (let c of candidates) {
      donationService.createCandidate(c);
    }

    const allCandidates = donationService.getCandidates();
    assert.equal(allCandidates.length, candidates.length);
  });

  test('get candidates detail', function () {
    for (let c of candidates) {
      donationService.createCandidate(c);
    }

    const allCandidates = donationService.getCandidates();
    for (let i = 0; i < candidates.length; i++) {
      assert(_.some([allCandidates[i]], candidates[i]), 'returnedCandidate must be a superset of newCandidate');
    }
  });

  test('get all candidates empty', function () {
    const allCandidates = donationService.getCandidates();
    assert.equal(allCandidates.length, 0);
  });

  /*
  test('get candidates', function () {
    const url = 'http://localhost:4000/api/candidates';
    let res = request('GET', url);
    const candidates = JSON.parse(res.getBody('utf8'));
    assert.equal(2, candidates.length);

    assert.equal(candidates[0].firstName, 'Lisa');
    assert.equal(candidates[0].lastName, 'Simpson');
    assert.equal(candidates[0].office, 'President');

    assert.equal(candidates[1].firstName, 'Donald');
    assert.equal(candidates[1].lastName, 'Simpson');
    assert.equal(candidates[1].office, 'President');

  });

  test('get one candidate', function () {
    const allCandidatesUrl = 'http://localhost:4000/api/candidates';
    let res = request('GET', allCandidatesUrl);
    const candidates = JSON.parse(res.getBody('utf8'));

    const oneCandidateUrl = allCandidatesUrl + '/' + candidates[0]._id;
    res = request('GET', oneCandidateUrl);
    const oneCandidate = JSON.parse(res.getBody('utf8'));

    assert.equal(oneCandidate.firstName, 'Lisa');
    assert.equal(oneCandidate.lastName, 'Simpson');
    assert.equal(oneCandidate.office, 'President');

  });

  test('create a candidate', function () {
    const candidatesUrl = 'http://localhost:4000/api/candidates';
    const newCandidate = {
      firstName: 'Maggie',
      lastName: 'Simpson',
      office: 'Vice-President',
    };
    const res = request('POST', candidatesUrl, { json: newCandidate });
    const returnedCandidate = JSON.parse(res.getBody('utf8'));

    assert.equal(returnedCandidate.firstName, 'Maggie');
    assert.equal(returnedCandidate.lastName, 'Simpson');
    assert.equal(returnedCandidate.office, 'Vice-President');
  });

  test('delete a candidate', function () {
    const allCandidatesUrl = 'http://localhost:4000/api/candidates';
    let res = request('GET', allCandidatesUrl);
    let oldCandidates = JSON.parse(res.getBody('utf8'));

    function randomIndex() {
      return Math.floor(Math.random() * oldCandidates.length);
    }

    let index = randomIndex();
    const oneCandidateUrl = allCandidatesUrl + '/' + oldCandidates[index]._id;

    request('DELETE', oneCandidateUrl);
    res = request('GET', allCandidatesUrl);
    const newCandidates = JSON.parse(res.getBody('utf8'));

    oldCandidates.splice(index, 1);
    assert.deepEqual(newCandidates, oldCandidates);
  });

  test('delete all candidates', function () {
    const allCandidatesUrl = 'http://localhost:4000/api/candidates';
    request('DELETE', allCandidatesUrl);
    const res = request('GET', allCandidatesUrl);
    const newCandidates = JSON.parse(res.getBody('utf8'));
    assert.deepEqual(newCandidates, []);
  });
  */

});
