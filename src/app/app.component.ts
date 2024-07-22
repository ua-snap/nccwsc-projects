import { Component } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { UrlService } from "./url.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "Sustaining Environmental Capitol Initiative";

  currentUrl: string = null;
  constructor(private urlService: UrlService, public router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Check if the current URL and the event.url both contain /topics or /casc
        // If they do, then we don't want to set the previous URL. This is required
        // for when we jump between topics or CASC pages.
        if (
          (this.currentUrl &&
            this.currentUrl.includes("/topics") &&
            event.url.includes("/topics")) ||
          (this.currentUrl &&
            this.currentUrl.includes("/casc") &&
            event.url.includes("/casc"))
        ) {
          this.urlService.setPreviousUrl(null);
          this.currentUrl = event.url;
          return;
        }
        // Sets previousURL if we are not jumping between topics or CASC pages
        this.urlService.setPreviousUrl(this.currentUrl);
        this.currentUrl = event.url;
      }
    });
  }
}
