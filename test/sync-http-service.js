const request = require('sync-request');

class SyncHttpService {

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.authHeader = null;
  }

  setAuth(url, user) {
    const res = request('POST', this.baseUrl + url, { json: user });
    if (res.statusCode === 201) {
      const payload = JSON.parse(res.getBody('utf8'));
      if (payload.success) {
        this.authHeader = { Authorization: payload.token };
        return true;
      }
    }

    return false;
  }

  clearAuth() {
    this.authHeader = null;
  }

  get(url) {
    let returnedObj = null;
    const res = request('GET', this.baseUrl + url, { headers: this.authHeader });
    if (res.statusCode < 300) {
      returnedObj = JSON.parse(res.getBody('utf8'));
    }

    return returnedObj;
  }

  post(url, obj) {
    let returnedObj = null;
    const res = request('POST', this.baseUrl + url, { json: obj, headers: this.authHeader });
    if (res.statusCode < 300) {
      returnedObj = JSON.parse(res.getBody('utf8'));
    }

    return returnedObj;
  }

  delete (url) {
    const res = request('DELETE', this.baseUrl + url, { headers: this.authHeader });
    return res.statusCode;
  }
}

module.exports = SyncHttpService;
