import {inject} from 'aurelia-framework';
import TweetService from '../../services/tweet-service';

@inject(TweetService)
export class Timeline {

  tweets = [];

  constructor(ts) {
    this.tweetService = ts;
    this.tweets = this.tweetService.timelineTweets;
    this.tweets.forEach(tweet => {
      tweet.author.fullName = tweet.author.firstName + ' ' + tweet.author.lastName;
    });
  }
}
