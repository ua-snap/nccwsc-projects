/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  ChangeDetectorRef,
} from "@angular/core";
import { LocalJsonService } from "../local-json.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../environments/environment";
import { Location } from "@angular/common";
import { UrlService } from "../url.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort, Sort } from "@angular/material/sort";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-csc",
  templateUrl: "./csc.component.html",
  styleUrls: ["./csc.component.scss", "../shared.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CscComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort = new MatSort();

  faSearch = faSearch;
  csc = null;
  sub: any;
  id: any;
  sbId: any;
  cscProjectsList = [];
  filteredCscProjectsList = [];
  csc_url = environment.baseURL;
  topics = [];
  fiscal_years = [];
  statuses = [];
  current_topic = ["All Topics"];
  current_fy = ["All Fiscal Years"];
  current_status = ["All Statuses"];
  title = null;
  dataLoading = true;
  searchTerm = "";
  selectedCasc: any;
  csc_ids = {
    "5050cb0ee4b0be20bb30eac0": "National CASC",
    "4f831626e4b0e84f6086809b": "Alaska CASC",
    "5e2f3f59e4b0a79317d422af": "Midwest CASC",
    "4f83509de4b0e84f60868124": "North Central CASC",
    "4f8c648de4b0546c0c397b43": "Northeast CASC",
    "4f8c64d2e4b0546c0c397b46": "Northwest CASC",
    "4f8c650ae4b0546c0c397b48": "Pacific Islands CASC",
    "4f8c652fe4b0546c0c397b4a": "South Central CASC",
    "4f8c6557e4b0546c0c397b4c": "Southeast CASC",
    "4f8c6580e4b0546c0c397b4e": "Southwest CASC",
  };

  csc_english_ids = {
    "national-casc": "5050cb0ee4b0be20bb30eac0",
    alaska: "4f831626e4b0e84f6086809b",
    midwest: "5e2f3f59e4b0a79317d422af",
    "north-central": "4f83509de4b0e84f60868124",
    northeast: "4f8c648de4b0546c0c397b43",
    northwest: "4f8c64d2e4b0546c0c397b46",
    "pacific-islands": "4f8c650ae4b0546c0c397b48",
    "south-central": "4f8c652fe4b0546c0c397b4a",
    southeast: "4f8c6557e4b0546c0c397b4c",
    southwest: "4f8c6580e4b0546c0c397b4e",
  };

  csc_paths = {
    "national-casc": "National CASC",
    alaska: "Alaska CASC",
    midwest: "Midwest CASC",
    "north-central": "North Central CASC",
    northeast: "Northeast CASC",
    northwest: "Northwest CASC",
    "pacific-islands": "Pacific Islands CASC",
    "south-central": "South Central CASC",
    southeast: "Southeast CASC",
    southwest: "Southwest CASC",
  };

  csc_identifiers = Object.keys(this.csc_paths);
  filtered_csc_identifiers = this.csc_identifiers;

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
    private cdr: ChangeDetectorRef,
  ) {
    this.dataSource = new MatTableDataSource<any>();
  }

  onCascChange(event: any) {
    this.selectedCasc = event.target.value;
    this.router.navigate(["/casc", this.selectedCasc]);
  }

  showAllProjects() {
    this.filteredCscProjectsList = [...this.cscProjectsList];
  }

  changeCurrentTopic(event) {
    if (event.checked) {
      const index = this.current_topic.indexOf("All Topics");
      if (index != -1) {
        this.current_topic.splice(index, 1);
      }
      this.current_topic.push(event.source.value);
    } else {
      const index = this.current_topic.indexOf(event.source.value);
      if (index != -1) {
        this.current_topic.splice(index, 1);
      }
    }
    if (this.current_topic.length == 0) {
      this.current_topic.push("All Topics");
    }

    this.filterProjectsList();
  }

  changeCurrentFY(event: any = null) {
    if (event.checked) {
      const index = this.current_fy.indexOf("All Fiscal Years");
      if (index != -1) {
        this.current_fy.splice(index, 1);
      }
      this.current_fy.push(event.source.value);
    } else {
      const index = this.current_fy.indexOf(event.source.value);
      if (index != -1) {
        this.current_fy.splice(index, 1);
      }
    }
    if (this.current_fy.length == 0) {
      this.current_fy.push("All Fiscal Years");
    }
    this.filterProjectsList();
  }

  changeCurrentStatus(event: any = null) {
    if (event.checked) {
      const index = this.current_status.indexOf("All Statuses");
      if (index != -1) {
        this.current_status.splice(index, 1);
      }
      this.current_status.push(event.source.value);
    } else {
      const index = this.current_status.indexOf(event.source.value);
      if (index != -1) {
        this.current_status.splice(index, 1);
      }
    }
    if (this.current_status.length == 0) {
      this.current_status.push("All Statuses");
    }

    this.filterProjectsList();
  }

  filterProjectsList() {
    this.filteredCscProjectsList = [];
    for (const project in this.cscProjectsList) {
      if (
        this.current_topic.indexOf("All Topics") === -1 &&
        this.cscProjectsList[project].topics != null
      ) {
        let matched_topic = false;
        for (const topic in this.cscProjectsList[project].topics) {
          for (const curr_topic in this.current_topic) {
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
        for (const year in this.current_fy) {
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
        for (const status in this.current_status) {
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

    this.updateUrl();
    this.dataSource.data = [...this.filteredCscProjectsList];
  }

  updateUrl() {
    const params = {};
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

  applyFilter() {
    // This works in conjunction with the sidebar filters to filter the table
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.dataLoading = true;
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

      if (this.id.length != 24) {
        this.sbId = this.csc_english_ids[this.id];
      } else {
        this.sbId = this.id;
      }

      this.topics = [];
      this.fiscal_years = [];
      this.statuses = [];

      this.title = this.csc_ids[this.sbId];
      this.urlService.setPreviousTitle(this.title);
      this.urlService.setCurrentTitle(this.title);
      this.localJson.loadCscProjects(this.sbId).subscribe((data) => {
        this.filtered_csc_identifiers = this.csc_identifiers.filter(
          (key) => this.csc_paths[key] !== this.title,
        );
        this.cscProjectsList = data;
        for (const project in this.cscProjectsList) {
          for (const topic in this.cscProjectsList[project].topics) {
            if (
              this.topics.indexOf(this.cscProjectsList[project].topics[topic]) <
              0
            ) {
              this.topics.push(this.cscProjectsList[project].topics[topic]);
            }
          }
          if (
            this.fiscal_years.indexOf(
              this.cscProjectsList[project].fiscal_year,
            ) < 0
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
            this.cscProjectsList[project].contacts.principal_investigators !=
            null
          ) {
            this.cscProjectsList[project].investigators_formatted = "<ul>";
            for (const pi of this.cscProjectsList[project].contacts
              .principal_investigators) {
              this.cscProjectsList[project].investigators_formatted +=
                "<li>" + pi.name + "<i> (" + pi.organization + "</i>)</li>";
            }
            this.cscProjectsList[project].investigators_formatted += "</ul>";
          } else {
            this.cscProjectsList[project].investigators_formatted = "N/A";
          }

          // Topics
          if (this.cscProjectsList[project].topics != null) {
            this.cscProjectsList[project].topics_formatted = "<ul>";
            for (const t of this.cscProjectsList[project].topics) {
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
        this.dataLoading = false;
        // Waits until the data is loaded to render the table
        this.cdr.detectChanges();
        // Sets the selectedCasc to the default option
        this.selectedCasc = "";
        // Applies the sorting to the table after it is available in the DOM
        this.dataSource.sort = this.sort;
        // Sets the default sorting to the fiscal year column to show the downward arrow
        this.setInitialSort();

        this.dataSource.filterPredicate = (data, filter) => {
          return (
            data.fiscal_year.toString().includes(filter) ||
            data.title.toLowerCase().includes(filter) ||
            data.investigators_formatted.toLowerCase().includes(filter) ||
            data.topics_formatted.toLowerCase().includes(filter) ||
            data.status.toLowerCase().includes(filter)
          );
        };
      });
    });
  }
  setInitialSort() {
    // This sets the initial sort to the fiscal year column in descending order
    const sortState: Sort = { active: "fiscal_year", direction: "desc" };
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
  }

  onSortChange(sortState: Sort) {
    // This catches the case where the sortState would normally not have a direction
    // and instead switches it to ascending order. This is to prevent the sort from
    // going from descending to no sort at all.
    if (sortState.direction === "") {
      this.sort.direction = "asc";
    }
  }
}
