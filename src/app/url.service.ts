import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class UrlService {
  private previousUrl: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private currentUrl: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private previousTitle: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  public previousUrl$: Observable<string> = this.previousUrl.asObservable();
  public currentUrl$: Observable<string> = this.currentUrl.asObservable();
  public previousTitle$: Observable<string> = this.previousTitle.asObservable();
  
  setPreviousUrl(previousUrl: string) {
      this.previousUrl.next(previousUrl);
  }

  setCurrentUrl(currentUrl: string) {
    this.currentUrl.next(currentUrl);
  }

  setPreviousTitle(previousTitle: string) {
    this.previousTitle.next(previousTitle);
  }
}

