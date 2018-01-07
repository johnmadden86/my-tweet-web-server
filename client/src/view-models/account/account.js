import {inject} from 'aurelia-framework';
import TweetService from '../../services/tweet-service';

@inject(TweetService)
export class Account {

  id;
  details = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };

  constructor(ts) {
    this.tweetService = ts;
    this.id = this.tweetService.currentUser._id;
    this.details.firstName = this.tweetService.currentUser.firstName;
    this.details.lastName = this.tweetService.currentUser.lastName;
    this.details.email = this.tweetService.currentUser.email;
    this.details.password = this.tweetService.currentUser.password;
  }

  updateDetails(e) {
    console.log(this.id, this.details);
    this.tweetService.updateUserDetails(this.id, this.details);
  }
}
