import { Component } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { Location } from '@angular/common';
import { AnalyticsService } from './analytics.service';
import { DataLayerCustomDimensions } from './data-layer-custom-dimensions';

declare var ga: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {
  
  title = 'Sustaining Environmental Capitol Initiative';

  constructor(private _analytics: AnalyticsService, public router: Router) {
  	this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this._analytics.pageView();
      }
    });
  }
}

