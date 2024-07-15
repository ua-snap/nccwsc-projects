import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";

import { AppComponent } from "./app.component";
import { routing, appRoutingProviders } from "./app.routing";
import {
  NgbModule,
  NgbActiveModal,
  NgbDropdownModule,
} from "@ng-bootstrap/ng-bootstrap";
// import { LeafletModule } from "@bluehalo/ngx-leaflet";
import { NgSelectModule } from "@ng-select/ng-select";
import { GoogleAnalyticsService } from "./google-analytics.service";
import { UmamiService } from "./umami.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { ProjectComponent } from "./project/project.component";
import { ProjectsComponent } from "./projects/projects.component";
import { SearchComponent } from "./search/search.component";
import { CscsComponent } from "./cscs/cscs.component";
import { TopicsComponent } from "./topics/topics.component";
import { MapComponent } from "./map/map.component";
import { SearchNavComponent } from "./search-nav/search-nav.component";
import { LocalJsonService } from "./local-json.service";
import { SciencebaseService } from "./sciencebase.service";
import { SearchService } from "./search.service";
import { UrlService } from "./url.service";
import { CscComponent } from "./csc/csc.component";
import { ProjectResourceComponent } from "./project-resource/project-resource.component";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BreadcrumbComponent } from "./breadcrumb/breadcrumb.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ProjectComponent,
    ProjectsComponent,
    SearchComponent,
    CscsComponent,
    TopicsComponent,
    MapComponent,
    SearchNavComponent,
    CscComponent,
    ProjectResourceComponent,
    BreadcrumbComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    routing,
    NgSelectModule,
    NgbDropdownModule,
    NgbModule,
    FontAwesomeModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    BrowserAnimationsModule,
  ],
  providers: [
    GoogleAnalyticsService,
    UmamiService,
    LocalJsonService,
    SciencebaseService,
    SearchService,
    UrlService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
