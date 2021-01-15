import { Injectable } from '@angular/core';

declare let gtag:Function;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  constructor() { }
  public eventEmitter(
    eventAction: string,
	  eventCategory: string,
	  eventLabel: string = null,
	  eventValue: number = null ){
		gtag('event', eventAction, {
			eventCategory: eventCategory,
			eventLabel: eventLabel,
			eventValue: eventValue
		})
	}
}
