import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { LocalJsonService } from "../local-json.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../environments/environment";
import { Location } from "@angular/common";
import { UrlService } from "../url.service";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-csc",
  templateUrl: "./csc.component.html",
  styleUrls: ["./csc.component.scss", "../shared.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CscComponent implements OnInit {
  sub: any;
  id: any;
  sbId: any;
  cscProjectsList = [];
  filteredCscProjectsList = [];
  dataSource = new MatTableDataSource<any>(this.filteredCscProjectsList);
  csc_url = environment.baseURL;
  topics = [];
  fiscal_years = [];
  statuses = [];
  current_topic = ["All Topics"];
  current_fy = ["All Fiscal Years"];
  current_status = ["All Statuses"];
  title = null;
  dataLoading = true;
  csc_ids = {
    "5050cb0ee4b0be20bb30eac0": "National CASC",
    "4f831626e4b0e84f6086809b": "Alaska CASC",
    "4f83509de4b0e84f60868124": "North Central CASC",
    "4f8c648de4b0546c0c397b43": "Northeast CASC",
    "4f8c64d2e4b0546c0c397b46": "Northwest CASC",
    "4f8c650ae4b0546c0c397b48": "Pacific Islands CASC",
    "4f8c652fe4b0546c0c397b4a": "South Central CASC",
    "4f8c6557e4b0546c0c397b4c": "Southeast CASC",
    "4f8c6580e4b0546c0c397b4e": "Southwest CASC",
    "5e2f3f59e4b0a79317d422af": "Midwest CASC",
  };

  csc_english_ids = {
    "national-casc": "5050cb0ee4b0be20bb30eac0",
    alaska: "4f831626e4b0e84f6086809b",
    "north-central": "4f83509de4b0e84f60868124",
    northeast: "4f8c648de4b0546c0c397b43",
    northwest: "4f8c64d2e4b0546c0c397b46",
    "pacific-islands": "4f8c650ae4b0546c0c397b48",
    "south-central": "4f8c652fe4b0546c0c397b4a",
    southeast: "4f8c6557e4b0546c0c397b4c",
    southwest: "4f8c6580e4b0546c0c397b4e",
    midwest: "5e2f3f59e4b0a79317d422af",
  };

  displayedColumns: string[] = [
    "fiscal_year",
    "title",
    "investigators_formatted",
    "topics_formatted",
    "status",
  ];

  constructor(
    private route: ActivatedRoute,
    private localJson: LocalJsonService,
    private router: Router,
    private location: Location,
    private aroute: ActivatedRoute,
    private urlService: UrlService,
  ) {}

  showAllProjects() {
    this.filteredCscProjectsList = [...this.cscProjectsList];
    // this.dataSource.data = this.filteredCscProjectsList;
  }

  sortProjectsByKey(array, key) {
    return array.sort(function (a, b) {
      var x = a[key];
      var y = b[key];
      return x > y ? -1 : x < y ? 1 : 0;
    });
  }

  changeCurrentTopic(event: any = null) {
    if (event.checked) {
      let index = this.current_topic.indexOf("All Topics");
      if (index != -1) {
        this.current_topic.splice(index, 1);
      }
      this.current_topic.push(event.source.value);
    } else {
      let index = this.current_topic.indexOf(event.source.value);
      if (index != -1) {
        this.current_topic.splice(index, 1);
      }
    }
    if (this.current_topic.length == 0) {
      this.current_topic.push("All Topics");
    }

    this.filterProjectsList(event.source.value);
  }

  changeCurrentFY(event: any = null) {
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

  filterProjectsList(event: any = null) {
    this.filteredCscProjectsList = [];
    for (var project in this.cscProjectsList) {
      var display = true;
      if (
        this.current_topic.indexOf("All Topics") === -1 &&
        this.cscProjectsList[project].topics != null
      ) {
        let matched_topic = false;
        for (let topic in this.cscProjectsList[project].topics) {
          for (let curr_topic in this.current_topic) {
            if (
              this.cscProjectsList[project].topics[topic]
                .replace(/,/g, "")
                .trim() ==
              this.current_topic[curr_topic].replace(/,/g, "").trim()
            ) {
              matched_topic = true;
              break;
            }
          }
          if (matched_topic == true) {
            break;
          }
        }
        if (matched_topic == false) {
          continue;
        }
      }
      if (this.current_fy.indexOf("All Fiscal Years") === -1) {
        let found = false;
        for (let year in this.current_fy) {
          if (
            this.cscProjectsList[project].fiscal_year === this.current_fy[year]
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
            this.cscProjectsList[project].status === this.current_status[status]
          ) {
            found = true;
            break;
          }
        }

        if (!found) {
          continue;
        }
      }

      this.filteredCscProjectsList.push(this.cscProjectsList[project]);
    }
    this.dataSource.data = this.filteredCscProjectsList;
    this.updateUrl();
    this.sortList();
  }

  updateUrl() {
    let params: any = {};
    if (this.current_topic.indexOf("All Topics") === -1) {
      params["topic"] = this.current_topic.join("+");
    }

    if (this.current_fy.indexOf("All Fiscal Years") === -1) {
      params["year"] = this.current_fy.join("+");
    }
    if (this.current_status.indexOf("All Statuses") === -1) {
      params["status"] = this.current_status.join("+");
    }
    const url = this.router
      .createUrlTree([params], { relativeTo: this.aroute })
      .toString();
    this.location.replaceState(url);
  }

  sortList() {
    this.filteredCscProjectsList.sort((a, b) => {
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
      this.id = params["id"];
      if (params["topic"]) {
        this.current_topic = params["topic"].split("+");
      }
      if (params["year"]) {
        this.current_fy = params["year"].split("+");
      }
      if (params["status"]) {
        this.current_status = params["status"].split("+");
      }
    });
    if (this.id.length != 24) {
      this.sbId = this.csc_english_ids[this.id];
    } else {
      this.sbId = this.id;
    }

    this.title = this.csc_ids[this.sbId];
    this.urlService.setPreviousTitle(this.title);
    this.urlService.setCurrentTitle(this.title);
    this.localJson.loadCscProjects(this.sbId).subscribe((data) => {
      this.cscProjectsList = data;
      for (var project in this.cscProjectsList) {
        for (var topic in this.cscProjectsList[project].topics) {
          if (
            this.topics.indexOf(this.cscProjectsList[project].topics[topic]) < 0
          ) {
            this.topics.push(this.cscProjectsList[project].topics[topic]);
          }
        }
        if (
          this.fiscal_years.indexOf(this.cscProjectsList[project].fiscal_year) <
          0
        ) {
          this.fiscal_years.push(this.cscProjectsList[project].fiscal_year);
        }
        if (this.statuses.indexOf(this.cscProjectsList[project].status) < 0) {
          this.statuses.push(this.cscProjectsList[project].status);
        }

        // Sort options
        this.fiscal_years.sort().reverse();
        this.topics.sort();
        this.statuses.sort();
        this.filteredCscProjectsList.push(this.cscProjectsList[project]);

        // Principal investigators
        if (
          this.cscProjectsList[project].contacts.principal_investigators != null
        ) {
          this.cscProjectsList[project].investigators_formatted = "";
          for (var pi of this.cscProjectsList[project].contacts
            .principal_investigators) {
            this.cscProjectsList[project].investigators_formatted +=
              pi.name + "&nbsp;<i>(" + pi.organization + "</i>)<br>";
          }
        } else {
          this.cscProjectsList[project].investigators_formatted = "N/A";
        }

        // Topics
        if (this.cscProjectsList[project].topics != null) {
          this.cscProjectsList[project].topics_formatted = "<ul>";
          for (var t of this.cscProjectsList[project].topics) {
            this.cscProjectsList[project].topics_formatted +=
              "<li>" + t + "</li>";
          }
          this.cscProjectsList[project].topics_formatted += "</ul>";
        } else {
          this.cscProjectsList[project].topics_formatted = "N/A";
        }

        // Status
        if (!this.cscProjectsList[project].status) {
          this.cscProjectsList[project].status = "N/A";
        }
      }

      this.filterProjectsList();
      this.sortList();
      this.dataLoading = false;
    });
  }
}
