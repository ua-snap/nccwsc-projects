import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class UrlService {
  private previousUrl: BehaviorSubject<string> = new BehaviorSubject<string>(
    null,
  );
  private previousTitle: BehaviorSubject<string> = new BehaviorSubject<string>(
    null,
  );
  private currentTitle: BehaviorSubject<string> = new BehaviorSubject<string>(
    null,
  );

  public previousUrl$: Observable<string> = this.previousUrl.asObservable();
  public previousTitle$: Observable<string> = this.previousTitle.asObservable();
  public currentTitle$: Observable<string> = this.currentTitle.asObservable();

  setPreviousUrl(previousUrl: string) {
    this.previousUrl.next(previousUrl);
  }

  setPreviousTitle(previousTitle: string) {
    this.previousTitle.next(previousTitle);
  }

  setCurrentTitle(currentTitle: string) {
    this.currentTitle.next(currentTitle);
  }
}
