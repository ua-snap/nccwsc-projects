import { Component, OnInit } from '@angular/core';
import { LocalJsonService } from '../local-json.service';
import { SearchService } from '../search.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { TitleLinkComponent } from '../title-link/title-link.component';
import { Location } from '@angular/common';
import { UrlService } from '../url.service';

@Component({
  selector: "app-topics",
  templateUrl: "./topics.component.html",
  styleUrls: ["./topics.component.scss", "../shared.scss"]
})
export class TopicsComponent implements OnInit {
  sub = null;
  topic = null;
  page_title = null;

  topics = {
    "drought-fire-extremes": "588244b0e4b0b3d9add24391",
    "science-tools": "5b6212e7e4b03f4cf7599b82",
    landscapes: "5882456be4b0b3d9add24395",
    "indigenous-peoples": "588246dae4b0b3d9add243a1",
    "water-coasts-ice": "5882464ce4b0b3d9add2439a",
    "wildlife-plants": "58824220e4b0b3d9add2438b"
  };
  topic_names = {
    "drought-fire-extremes": "Drought, Fire and Extreme Weather",
    "science-tools": "Science Tools for Managers",
    landscapes: "Landscapes",
    "indigenous-peoples": "Indigenous Peoples",
    "water-coasts-ice": "Water, Coasts and Ice",
    "wildlife-plants": "Wildlife and Plants"
  };

  settings = {
    columns: {
      fiscal_year: {
        title: "FY",
        width: "6%"
      },
      title: {
        title: "Title",
        type: "custom",
        renderComponent: TitleLinkComponent
      },
      csc_name: {
        title: "CASC"
      },
      subtopics_formatted: {
        title: "Subtopic(s)",
        type: "html"
      },
      status: {
        title: "Status",
        width: "10%"
      }
    },
    actions: false,
    hideSubHeader: true,
    pager: {
      display: false
    }
    // this.source.setSort([{ field: 'id', direction: 'asc' }]);
  };

  topics_url = environment.baseURL;
  project_url = environment.baseURL + "/project";

  url: any;
  subtopics = ["All Subtopics"];
  fiscal_years = ["All Fiscal Years"];
  statuses = ["All Statuses"];
  cscs = [];
  types = ["Project"];
  current_subtopic = "All Subtopics";
  current_type = "Project";
  current_fy = "All Fiscal Years";
  current_status = "All Statuses";
  current_csc = ["All CASCs"];
  topicKeys;
  projectsList = [];
  filteredProjectsList = [];
  dataLoading = true;

  subtopicsFilter: string[] = null;

  constructor(
    private route: ActivatedRoute,
    private localJson: LocalJsonService,
    private searchService: SearchService,
    private router: Router,
    private location: Location,
    private aroute: ActivatedRoute,
    private urlService: UrlService
  ) {}

  changeCurrentCASC(event: any = null) {
    if (event.target.checked == true) {

      let index = this.current_csc.indexOf("All CASCs")
      if (index != -1) {
        this.current_csc.splice(index, 1)
      }
      this.current_csc.push(event.target.value)
    } else {
      let index = this.current_csc.indexOf(event.target.value)
      if (index != -1) {
        this.current_csc.splice(index, 1)
      }
    }
    if (this.current_csc.length == 0) {    
      this.current_csc.push("All CASCs")
    }

    this.filterProjectsList(event.target.value)
  }

  filterProjectsList(event: any = null) {
    
    this.filteredProjectsList = [];
    for (var project in this.projectsList) {
      if (
        this.current_subtopic != "All Subtopics" &&
        this.projectsList[project].subtopics != null
      ) {
        var matched_subtopic = false;
        for (var subtopic in this.projectsList[project].subtopics) {
          if (
            this.projectsList[project].subtopics[subtopic] ==
            this.current_subtopic
          ) {
            matched_subtopic = true;
            break;
          }
        }
        if (!matched_subtopic) {
          continue;
        }
      }
      var matchedType = false;
      if (this.current_type != "All Types") {
        for (var thisType in this.projectsList[project].types) {
          var matchedType = true;
          if (
            this.projectsList[project].types[thisType] !== this.current_type
          ) {
            matchedType = false;
          } else {
            break;
          }
        }
        if (!matchedType) {
          continue;
        }
      }
      if (this.current_fy != "All Fiscal Years") {
        if (this.projectsList[project].fiscal_year !== this.current_fy) {
          continue;
        }
      }
      if (this.current_status != "All Statuses") {
        if (this.projectsList[project].status !== this.current_status) {
          continue;
        }
      }
      if (this.current_csc.indexOf("All CASCs") === -1) {
        let found = false;
        for (let csc in this.current_csc) {
          if (this.projectsList[project].csc["name"] == this.current_csc[csc]) {
            found = true;
            break;
          }
        }

        if (!found) {
          continue;
        }
      }
      this.filteredProjectsList.push(this.projectsList[project]);
    }
    this.updateUrl();
    this.sortList();
  }

  showAllProjects() {
    this.filteredProjectsList = this.projectsList;
    this.current_subtopic = "All Subtopics";
    this.current_fy = "All Fiscal Years";
    this.current_status = "All Statuses";
    this.current_type = "Project";
    this.current_csc = [];
  }

  isOnTopic(subtopic) {
    for (var topicSubtopic in this.subtopicsFilter) {
      if (subtopic == this.subtopicsFilter[topicSubtopic]["label"]) {
        return true;
      }
    }
    return false;
  }

  //TODO: put this code in a utility function/service
  updateUrl() {
    let params: any = {};
    if (this.current_subtopic != "All Subtopics") {
      params["subtopic"] = this.current_subtopic;
    }
    if (this.current_fy != "All Fiscal Years") {
      params["year"] = this.current_fy;
    }
    if (this.current_status != "All Statuses") {
      params["status"] = this.current_status;
    }
    if (this.current_type != "All Types") {
      params["type"] = this.current_type;
    }
    if (this.current_csc.indexOf("All CASCs") == -1) {
      params["csc"] = this.current_csc.join('+');
    }

    const url = this.router
      .createUrlTree([params], { relativeTo: this.aroute })
      .toString();

    this.location.replaceState(url);
  }

  sortList() {
    // First sorts projects by year, then by title
    this.filteredProjectsList.sort((a, b) => {
      function sortByTitle(a, b) {
        if (a.title == b.title) {
          return 0;
        }
        return a.title < b.title ? -1 : 1;
      }

      if (a.fiscal_year == b.fiscal_year) {
        return sortByTitle(a, b);
      }
      return a.fiscal_year > b.fiscal_year ? -1 : 1;
    });
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.topic = params["topic"];
      if (params["subtopic"]) {
        this.current_subtopic = params["subtopic"];
      }
      if (params["year"]) {
        this.current_fy = params["year"];
      }
      if (params["status"]) {
        this.current_status = params["status"];
      }
      if (params["type"]) {
        this.current_type = params["type"];
      }
      if (params["csc"]) {
        this.current_csc = params["csc"].split('+');
      }

      this.page_title = this.topic_names[this.topic]
      this.urlService.setPreviousTitle(this.page_title);
      this.urlService.setCurrentTitle(this.page_title);

    });
    this.searchService.getTopics().subscribe(topics => {
      var topics = topics;
      for (var topic in topics) {
        if (topics[topic].label == this.page_title) {
          this.subtopicsFilter = topics[topic].subtopics;
        }
      }
    });
    this.localJson
      .loadTopic(encodeURIComponent(this.topic_names[this.topic]))
      .subscribe(data => {
        this.projectsList = data;
        for (var project in this.projectsList) {
          for (var subtopic in this.projectsList[project].topics) {
            if (this.subtopicsFilter != null) {
              for (var topicSubtopic in this.subtopicsFilter) {
                if (
                  this.projectsList[project].subtopics[subtopic] ==
                    this.subtopicsFilter[topicSubtopic]["label"] &&
                  this.subtopics.indexOf(
                    this.projectsList[project].subtopics[subtopic]
                  ) < 0
                ) {
                  this.subtopics.push(
                    this.projectsList[project].subtopics[subtopic]
                  );
                }
              }
            }
          }
          if (
            this.fiscal_years.indexOf(this.projectsList[project].fiscal_year) <
            0
          ) {
            if (this.projectsList[project].fiscal_year != null) {
              this.fiscal_years.push(this.projectsList[project].fiscal_year);
            }
          }
          if (this.statuses.indexOf(this.projectsList[project].status) < 0) {
            if (this.projectsList[project].status != null) {
              this.statuses.push(this.projectsList[project].status);
            }
          }
          if (this.cscs.indexOf(this.projectsList[project].csc["name"]) < 0) {
            this.cscs.push(this.projectsList[project].csc["name"]);
          }
          if (this.projectsList[project].types) {
            for (var this_type of this.projectsList[project].types) {
              if (this.types.indexOf(this_type) < 0) {
                if (this_type != null) {
                  this.types.push(this_type);
                }
              }
            }
          }

          this.fiscal_years.sort().reverse();
          this.subtopics.sort();
          this.statuses.sort();
          this.cscs.sort();

          // After sorting, move All CASCs to top of sorted list.
          var temp = this.cscs[0];
          this.cscs[0] = this.cscs[1];
          this.cscs[1] = temp;

          this.filteredProjectsList.push(this.projectsList[project]);
          this.dataLoading = false;

          // Prepares data for sortable table

          // cscs and year
          for (var project in this.filteredProjectsList) {
            this.projectsList[project].csc_name = this.projectsList[
              project
            ].csc["name"];

            // subtopics
            this.projectsList[project].subtopics_formatted = "<ul>";
            for (var st of this.projectsList[project].subtopics) {
              if (
                this.isOnTopic(st) &&
                this.projectsList[project].subtopics_formatted.indexOf(st) < 0
              ) {
                this.projectsList[project].subtopics_formatted +=
                  "<li>" + st + "</li>";
              }
            }
            this.projectsList[project].subtopics_formatted += "</ul>";

            // status
            if (!this.projectsList[project].status) {
              this.projectsList[project].status = "N/A";
            }
          } //end for project
        }

        this.current_type = "Project";
        this.filterProjectsList();
        this.sortList();
      });
  }
}
