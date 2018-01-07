import {inject} from 'aurelia-framework';
import TweetService from '../../services/tweet-service';

@inject(TweetService)
export class Users {

  users = [];

  constructor(ts) {
    this.tweetService = ts;
    this.users = this.tweetService.allUsers;
    this.users.forEach(user => {
      user.fullName = user.firstName + ' ' + user.lastName;
    });
  }
}
