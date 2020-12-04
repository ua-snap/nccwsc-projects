import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AnalyticsService {
  constructor(
    private _router: Router
  ) {}

  pageView() {
    (<any>window).dataLayer.push({
      event: 'virtualPageview',
      virtualPageURL: this._router.url
    });
  }
}