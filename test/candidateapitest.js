'use strict';

const assert = require('chai').assert;
const request = require('sync-request');

suite('Candidate API tests', function () {

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
      firstName: 'Barnie',
      lastName: 'Grumble',
      office: 'President',
    };

    const res = request('POST', candidatesUrl, { json: newCandidate });
    const returnedCandidate = JSON.parse(res.getBody('utf8'));

    assert.equal(returnedCandidate.firstName, 'Barnie');
    assert.equal(returnedCandidate.lastName, 'Grumble');
    assert.equal(returnedCandidate.office, 'President');
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
});
