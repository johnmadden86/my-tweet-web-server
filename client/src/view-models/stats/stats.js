import {inject} from 'aurelia-framework';
import {TotalUpdate} from '../../services/messages';
import {EventAggregator} from 'aurelia-event-aggregator';
import TweetService from '../../services/tweet-service';

@inject(EventAggregator, TweetService)
export class Stats {

  total = 0;

  constructor(ea, ts) {
    this.ts = ts;
    ea.subscribe(TotalUpdate, msg => {
      this.total = msg.total;
    });
  }

  attached() {
    this.total = this.ts.total;
  }
}
