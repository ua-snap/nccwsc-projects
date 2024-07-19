/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from "@angular/core";
import { SciencebaseService } from "../sciencebase.service";
import { ActivatedRoute } from "@angular/router";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-project-resource",
  templateUrl: "./project-resource.component.html",
  styleUrls: ["./project-resource.component.scss"],
})
export class ProjectResourceComponent implements OnInit {
  sub: any;
  sbId: string;
  currentResource: any = null;
  resourceOrgs: string;
  resourceContacts: any = {};
  resourceDates: any = {};
  sbURL = environment.sbmainURL;

  constructor(
    public route: ActivatedRoute,
    private sbService: SciencebaseService,
  ) {}

  getAffiliations() {
    if (!this.currentResource.tags) {
      return null;
    }
    let orgsString = "";
    for (const tag of this.currentResource.tags) {
      if (tag.type == "Organization") {
        orgsString = orgsString + tag.name + ", ";
      }
    }
    return orgsString.substring(0, orgsString.length - 2);
  }

  getResourceContacts() {
    const contacts = {
      authors: [],
    };
    if (this.currentResource.contacts) {
      for (const contact of this.currentResource.contacts) {
        if (contact.type == "Author") {
          contacts.authors.push(contact);
        }
      }
    }
    return contacts;
  }

  getResourceDates() {
    const dates = {
      publication: null,
    };
    if (this.currentResource.dates) {
      for (const date of this.currentResource.dates) {
        if (date.type == "Publication") {
          dates.publication = date;
        }
      }
    }
    return dates;
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.sbId = params["sbId"];
    });
    this.sbService.getSciencebaseRecord(this.sbId).subscribe((data) => {
      this.currentResource = data;
      this.resourceOrgs = this.getAffiliations();
      this.resourceContacts = this.getResourceContacts();
      this.resourceDates = this.getResourceDates();
    });
  }
}
