import { Injectable } from '@angular/core';
import { umami } from 'umami';

function _window() : any {
  return window;
}

declare let umami:Function;

@Injectable({
  providedIn: 'root'
})
export class UmamiService {

  constructor() { }
  public eventEmitter(eventLabel: string, eventData: object) {
    _window().umami.trackEvent(eventLabel, eventData )
  }
}
