import { Component, OnInit } from "@angular/core";
import { LocalJsonService } from "../local-json.service";
import { SearchService } from "../search.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../environments/environment";
import { Location } from "@angular/common";
import { UrlService } from "../url.service";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-topics",
  templateUrl: "./topics.component.html",
  styleUrls: ["./topics.component.scss", "../shared.scss"],
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
    "wildlife-plants": "58824220e4b0b3d9add2438b",
  };
  topic_names = {
    "drought-fire-extremes": "Drought, Fire and Extreme Weather",
    "science-tools": "Science Tools for Managers",
    landscapes: "Landscapes",
    "indigenous-peoples": "Indigenous Peoples",
    "water-coasts-ice": "Water, Coasts and Ice",
    "wildlife-plants": "Wildlife and Plants",
  };

  topics_url = environment.baseURL;
  project_url = environment.baseURL + "/project";

  url: any;
  subtopics = [];
  fiscal_years = [];
  statuses = [];
  cscs = [];
  types = ["Project"];
  current_subtopic = ["All Subtopics"];
  current_type = "Project";
  current_fy = ["All Fiscal Years"];
  current_status = ["All Statuses"];
  current_csc = ["All CASCs"];
  topicKeys;
  projectsList = [];
  filteredProjectsList = [];
  dataLoading = true;
  dataSource = new MatTableDataSource<any>(this.filteredProjectsList);

  subtopicsFilter: string[] = null;

  constructor(
    private route: ActivatedRoute,
    private localJson: LocalJsonService,
    private searchService: SearchService,
    private router: Router,
    private location: Location,
    private aroute: ActivatedRoute,
    private urlService: UrlService,
  ) {}

  displayedColumns: string[] = [
    "fiscal_year",
    "title",
    "csc_name",
    "subtopics_formatted",
    "status",
  ];

  changeCurrentCASC(event: any = null) {
    if (event.checked) {
      let index = this.current_csc.indexOf("All CASCs");
      if (index != -1) {
        this.current_csc.splice(index, 1);
      }
      this.current_csc.push(event.source.value);
    } else {
      let index = this.current_csc.indexOf(event.source.value);
      if (index != -1) {
        this.current_csc.splice(index, 1);
      }
    }
    if (this.current_csc.length == 0) {
      this.current_csc.push("All CASCs");
    }

    this.filterProjectsList(event.source.value);
  }

  changeCurrentSubTopic(event: any = null) {
    if (event.checked) {
      let index = this.current_subtopic.indexOf("All Subtopics");
      if (index != -1) {
        this.current_subtopic.splice(index, 1);
      }
      this.current_subtopic.push(event.source.value);
    } else {
      let index = this.current_subtopic.indexOf(event.source.value);
      if (index != -1) {
        this.current_subtopic.splice(index, 1);
      }
    }
    if (this.current_subtopic.length == 0) {
      this.current_subtopic.push("All Subtopics");
    }

    this.filterProjectsList(event.source.value);
  }

  changeCurrentStatus(event: any = null) {
    if (event.checked) {
      let index = this.current_status.indexOf("All Statuses");
      if (index != -1) {
        this.current_status.splice(index, 1);
      }
      this.current_status.push(event.source.value);
    } else {
      let index = this.current_status.indexOf(event.source.value);
      if (index != -1) {
        this.current_status.splice(index, 1);
      }
    }
    if (this.current_status.length == 0) {
      this.current_status.push("All Statuses");
    }

    this.filterProjectsList(event.source.value);
  }

  changeCurrentYear(event: any = null) {
    if (event.checked) {
      let index = this.current_fy.indexOf("All Fiscal Years");
      if (index != -1) {
        this.current_fy.splice(index, 1);
      }
      this.current_fy.push(event.source.value);
    } else {
      let index = this.current_fy.indexOf(event.source.value);
      if (index != -1) {
        this.current_fy.splice(index, 1);
      }
    }
    if (this.current_fy.length == 0) {
      this.current_fy.push("All Fiscal Years");
    }

    this.filterProjectsList(event.source.value);
  }

  filterProjectsList(event: any = null) {
    this.filteredProjectsList = [];
    for (var project in this.projectsList) {
      if (
        this.current_subtopic.indexOf("All Subtopics") === -1 &&
        this.projectsList[project].subtopics != null
      ) {
        var matched_subtopic = false;
        for (let subtopic in this.projectsList[project].subtopics) {
          for (let curr_subtopic in this.current_subtopic) {
            if (
              this.projectsList[project].subtopics[subtopic] ==
              this.current_subtopic[curr_subtopic]
            ) {
              matched_subtopic = true;
              break;
            }
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
      if (this.current_fy.indexOf("All Fiscal Years") === -1) {
        let found = false;
        for (let year in this.current_fy) {
          if (
            this.projectsList[project].fiscal_year === this.current_fy[year]
          ) {
            found = true;
            break;
          }
        }

        if (!found) {
          continue;
        }
      }
      if (this.current_status.indexOf("All Statuses") === -1) {
        let found = false;
        for (let status in this.current_status) {
          if (
            this.projectsList[project].status === this.current_status[status]
          ) {
            found = true;
            break;
          }
        }

        if (!found) {
          continue;
        }
      }
      if (this.current_csc.indexOf("All CASCs") === -1) {
        let found = false;
        for (let csc in this.current_csc) {
          if (
            this.projectsList[project].csc["name"] === this.current_csc[csc]
          ) {
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
    this.dataSource.data = this.filteredProjectsList;
    this.updateUrl();
    this.sortList();
  }

  showAllProjects() {
    this.filteredProjectsList = this.projectsList;
    this.current_subtopic = [];
    this.current_fy = [];
    this.current_status = [];
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
    if (this.current_subtopic.indexOf("All Subtopics") === -1) {
      params["subtopic"] = this.current_subtopic.join("+");
    }
    if (this.current_fy.indexOf("All Fiscal Years") === -1) {
      params["year"] = this.current_fy.join("+");
    }
    if (this.current_status.indexOf("All Statuses") === -1) {
      params["status"] = this.current_status.join("+");
    }
    if (this.current_type != "All Types") {
      params["type"] = this.current_type;
    }
    if (this.current_csc.indexOf("All CASCs") == -1) {
      params["csc"] = this.current_csc.join("+");
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
    this.sub = this.route.params.subscribe((params) => {
      this.topic = params["topic"];
      if (params["subtopic"]) {
        this.current_subtopic = params["subtopic"].split("+");
      }
      if (params["year"]) {
        this.current_fy = params["year"].split("+");
      }
      if (params["status"]) {
        this.current_status = params["status"].split("+");
      }
      if (params["type"]) {
        this.current_type = params["type"];
      }
      if (params["csc"]) {
        this.current_csc = params["csc"].split("+");
      }

      this.page_title = this.topic_names[this.topic];
      this.urlService.setPreviousTitle(this.page_title);
      this.urlService.setCurrentTitle(this.page_title);
    });
    this.searchService.getTopics().subscribe((topics) => {
      var topics = topics;
      for (var topic in topics) {
        if (topics[topic].label == this.page_title) {
          this.subtopicsFilter = topics[topic].subtopics;
        }
      }
    });
    this.localJson
      .loadTopic(encodeURIComponent(this.topic_names[this.topic]))
      .subscribe((data) => {
        this.projectsList = data;
        for (var project in this.projectsList) {
          for (var subtopic in this.projectsList[project].topics) {
            if (this.subtopicsFilter != null) {
              for (var topicSubtopic in this.subtopicsFilter) {
                if (
                  this.projectsList[project].subtopics[subtopic] ==
                    this.subtopicsFilter[topicSubtopic]["label"] &&
                  this.subtopics.indexOf(
                    this.projectsList[project].subtopics[subtopic],
                  ) < 0
                ) {
                  this.subtopics.push(
                    this.projectsList[project].subtopics[subtopic],
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
            if (
              this.projectsList[project].status != null &&
              this.projectsList[project].status != "N/A"
            ) {
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

          this.filteredProjectsList.push(this.projectsList[project]);

          // Prepares data for sortable table

          // cscs and year
          for (var project in this.filteredProjectsList) {
            this.projectsList[project].csc_name =
              this.projectsList[project].csc["name"];

            // subtopics
            this.projectsList[project].subtopics_formatted = "";
            if (this.projectsList[project].subtopics != null) {
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
            }
            // status
            if (!this.projectsList[project].status) {
              this.projectsList[project].status = "N/A";
            }
          } //end for project
        }

        this.current_type = "Project";
        this.filterProjectsList();
        this.sortList();
        this.dataLoading = false;
      });
  }
}
