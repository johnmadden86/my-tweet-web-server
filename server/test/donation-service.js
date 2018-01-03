'use strict';

const SyncHttpService = require('./sync-http-service');
const fixtures = require('./fixtures.json');

const baseUrl = fixtures.donationService;

class DonationService {

  constructor(baseUrl) {
    this.httpService = new SyncHttpService(baseUrl);
  }

  getCandidates() {
    return this.httpService.get('/api/candidates');
  }

  getCandidate(id) {
    return this.httpService.get('/api/candidates/' + id);
  }

  createCandidate(newCandidate) {
    return this.httpService.post('/api/candidates', newCandidate);
  }

  getUsers() {
    return this.httpService.get('/api/users');
  }

  getUser(id) {
    return this.httpService.get('/api/users/' + id);
  }

  createUser(newUser) {
    return this.httpService.post('/api/users', newUser);
  }

  deleteAllCandidates() {
    return this.httpService.delete('/api/candidates');
  }

  deleteAllUsers() {
    return this.httpService.delete('/api/users');
  }

  deleteOneCandidate(id) {
    return this.httpService.delete('/api/candidates/' + id);
  }

  deleteOneUser(id) {
    return this.httpService.delete('/api/users/' + id);
  }
}

module.exports = DonationService;
