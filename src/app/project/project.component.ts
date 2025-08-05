/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { LocalJsonService } from "../local-json.service";
import { ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { environment } from "../../environments/environment";
import { UrlService } from "../url.service";
import { Shared } from "../shared";

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

  topic_names = {
    "Drought, Fire and Extreme Weather": "drought-fire-extremes",
    "Science Tools for Managers": "science-tools",
    Landscapes: "landscapes",
    "Indigenous Peoples": "indigenous-peoples",
    "Water, Coasts and Ice": "water-coasts-ice",
    "Wildlife and Plants": "wildlife-plants",
  };

  subtopic_names = {
    Arctic: "landscapes;subtopic=Arctic",
    Forests: "landscapes;subtopic=Forests",
    "Grasslands and Plains": "landscapes;subtopic=Grasslands%20and%20Plains",
    "Other Landscapes": "landscapes;subtopic=Other%20Landscapes",
    Drought: "drought-fire-extremes;subtopic=Drought",
    "Extreme Weather": "drought-fire-extremes;subtopic=Extreme%20Weather",
    Fire: "drought-fire-extremes;subtopic=Fire",
    Birds: "wildlife-plants;subtopic=Birds",
    Fish: "wildlife-plants;subtopic=Fish",
    Mammals: "wildlife-plants;subtopic=Mammals",
    "Other Wildlife": "wildlife-plants;subtopic=Other%20Wildlife",
    Plants: "wildlife-plants;subtopic=Plants",
    "Coral Reefs": "water-coasts-ice;subtopic=Coral%20Reefs",
    "Glaciers and Permafrost":
      "water-coasts-ice;subtopic=Glaciers%20and%20Permafrost",
    "Other Water": "water-coasts-ice;subtopic=Other%20Water",
    "Rivers, Streams and Lakes":
      "water-coasts-ice;subtopic=Rivers,%20Streams%20and%20Lakes",
    "Sea-Level Rise and Coasts":
      "water-coasts-ice;subtopic=Sea-Level%20Rise%20and%20Coasts",
    Wetlands: "water-coasts-ice;subtopic=Wetlands",
    "Alaska Natives and Corporations":
      "indigenous-peoples;subtopic=Alaska%20Natives%20and%20Corporations",
    "Pacific Islander Indigenous Communities":
      "indigenous-peoples;subtopic=Pacific%20Islander%20Indigenous%20Communities",
    "Tribes and Tribal Organizations":
      "indigenous-peoples;subtopic=Tribes%20and%20Tribal%20Organizations",
    "Data Visualization & Tools":
      "science-tools;subtopic=Data%20Visualization%20&%20Tools",
    "Social Science": "science-tools;subtopic=Social%20Science",
    "State of the Science": "science-tools;subtopic=State%20of%20the%20Science",
  };

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
