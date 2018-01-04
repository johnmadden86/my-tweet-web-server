import { inject, Aurelia } from 'aurelia-framework';

@inject(Aurelia)
export class Home {

  constructor(au) {
    this.aurelia = au;
  }

  configureRouter(config, router) {
    config.map([
      { route: ['', 'home'], name: 'new-tweet', moduleId: 'view-models/new-tweet/new-tweet', nav: true, title: 'New Tweet' },
      { route: 'timeline', name: 'timeline', moduleId: 'view-models/timeline/timeline', nav: true, title: 'Timeline' },
      { route: 'stats', name: 'stats', moduleId: 'view-models/stats/stats', nav: true, title: 'Stats' },
      { route: 'dashboard', name: 'dashboard', moduleId: 'view-models/dashboard/dashboard', nav: true, title: 'Dashboard' }
    ]);
    this.router = router;

    config.mapUnknownRoutes(instruction => {
      return 'home';
    });
  }
}
