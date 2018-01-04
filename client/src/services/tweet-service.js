import {inject} from 'aurelia-framework';
import Fixtures from './fixtures';
import {LoginStatus, TotalUpdate} from './messages';
import {EventAggregator} from 'aurelia-event-aggregator';
import AsyncHttpClient from './async-http-client';

@inject(Fixtures, EventAggregator, AsyncHttpClient)
export default class TweetService {

  users = [];
  tweets = [];
  total = 0;

  constructor(data, ea, ac) {
    this.ea = ea;
    this.ac = ac;
  }

  register(firstName, lastName, email, password) {
    const newUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    };
    this.ac.post('/api/users', newUser)
      .then(res => {
        this.getUsers();
      });
  }

  login(email, password) {
    const user = {
      email: email,
      password: password
    };
    this.ac.authenticate('/api/users/authenticate', user);
  }

  logout() {
    const status = {
      success: false,
      message: ''
    };
    this.ac.clearAuthentication();
    this.ea.publish(new LoginStatus(status));
  }

  newTweet(text) {
    let tweet = {
      text: text
    };
    this.ac.post('/api/tweets', tweet)
      .then(res => {
        this.tweets.push(res.content);
        this.total = this.tweets.length;
        console.log('New tweet added: \"' + tweet.text + '\". ' + this.total + ' tweets in total.');
        this.ea.publish(new TotalUpdate(this.total));
      });
  }

  getTweets() {
    this.ac.get('/api/tweets').then(res => {
      this.tweets = res.content;
    });
  }

  getUsers() {
    this.ac.get('/api/users').then(res => {
      this.users = res.content;
    });
  }

  isAuthenticated() {
    return this.ac.isAuthenticated();
  }
}
