import { Component } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { Location } from '@angular/common';
import { UrlService } from './url.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {
  
  title = 'Sustaining Environmental Capitol Initiative';

	currentUrl: string = null;
  constructor(private urlService: UrlService, public router: Router) {
  	this.router.events.subscribe(event => {
			if(event instanceof NavigationEnd) {
				this.urlService.setPreviousUrl(this.currentUrl);
				this.currentUrl = event.url;
			}
		}
  )}
}

