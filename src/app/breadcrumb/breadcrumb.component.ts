import { Component, OnInit, Input } from '@angular/core';
import { UrlService } from "../url.service";
import { faHome } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  
  faHome = faHome;
  previousUrl: string = '';
  previousTitle: string = '';
  currentTitle: string = '';

  constructor(private urlService: UrlService) { }

  is_project() {
    if (this.previousUrl != null) {
      if (this.previousUrl.includes('project')) {
        return true;
      }
   }
  }

  ngOnInit() {
    this.urlService.previousUrl$
    .subscribe((previous_url: string) => {
      if (previous_url != null) {
        this.previousUrl = "#" + previous_url;
      }
    });
    this.urlService.previousTitle$
    .subscribe((previous_title: string) => {
      this.previousTitle = previous_title;
    });
    this.urlService.currentTitle$
    .subscribe((current_title: string) => {
      this.currentTitle = current_title;
    });
  }

}
