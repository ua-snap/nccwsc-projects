/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { LocalJsonService } from "../local-json.service";
import { ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { environment } from "../../environments/environment";
import { UrlService } from "../url.service";
import { Shared } from "../shared";
import { SUBTOPIC_ROUTE_BY_LABEL, TOPIC_SLUG_BY_LABEL } from "../taxonomy";

@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./project.component.scss"],
})
export class ProjectComponent implements OnInit {
  sub: any;
  projectId: string;
  cscId: string;
  projectJson: any;
  previewImage: any;
  modal_image: any;
  closeResult: string;
  trustedDashboardUrl: SafeUrl;
  sbURL = environment.sbmainURL;

  shared: Shared;

  topic_names = TOPIC_SLUG_BY_LABEL;

  subtopic_names = SUBTOPIC_ROUTE_BY_LABEL;

  constructor(
    private route: ActivatedRoute,
    private localJson: LocalJsonService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private urlService: UrlService,
  ) {}

  openImage(imageModal, image) {
    this.modal_image = image;
    this.modalService.open(imageModal, {
      size: "lg",
      windowClass: "dark-modal",
    });
  }

  goodTitle(title) {
    if (title == "Thumbnail" || title.substring(0, 8) == "metadata") {
      return false;
    }
    return true;
  }

  ngOnInit() {
    this.shared = new Shared();
    this.urlService.setCurrentTitle("Project");
    this.sub = this.route.params.subscribe((params) => {
      this.projectId = params["id"];
      this.cscId = params["csc"];
      this.localJson
        .loadProject(this.cscId, this.projectId)
        .subscribe((data) => {
          this.projectJson = data;
          this.projectJson.dates.start_date = this.shared.formatDate(
            this.projectJson.dates.start_date,
          );
          this.projectJson.dates.end_date = this.shared.formatDate(
            this.projectJson.dates.end_date,
          );
          this.projectJson.dates.updated = this.shared.formatDate(
            this.projectJson.dates.updated,
          );
          if (this.projectJson.images) {
            for (const image in this.projectJson.images) {
              if (this.projectJson.images[image]["useForPreview"]) {
                this.previewImage = this.projectJson.images[image];
                this.trustedDashboardUrl =
                  this.sanitizer.bypassSecurityTrustUrl(
                    this.projectJson.images[image]["url"],
                  );
              }
            }
          }
        });
    });
  }
}
