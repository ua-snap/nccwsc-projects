/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  ChangeDetectorRef,
} from "@angular/core";
import { LocalJsonService } from "../local-json.service";
import { SearchService } from "../search.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../../environments/environment";
import { Location } from "@angular/common";
import { UrlService } from "../url.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort, Sort } from "@angular/material/sort";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-topics",
  templateUrl: "./topics.component.html",
  styleUrls: ["./topics.component.scss", "../shared.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class TopicsComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;

  sub = null;
  topic = null;
  page_title = null;

  topics = {
    "drought-fire-extremes": "588244b0e4b0b3d9add24391",
    landscapes: "5882456be4b0b3d9add24395",
    "science-tools": "5b6212e7e4b03f4cf7599b82",
    "indigenous-peoples": "588246dae4b0b3d9add243a1",
    "water-coasts-ice": "5882464ce4b0b3d9add2439a",
    "wildlife-plants": "58824220e4b0b3d9add2438b",
  };
  topic_names = {
    "drought-fire-extremes": "Drought, Fire and Extreme Weather",
    landscapes: "Landscapes",
    "science-tools": "Science Tools for Managers",
    "indigenous-peoples": "Indigenous Peoples",
    "water-coasts-ice": "Water, Coasts and Ice",
    "wildlife-plants": "Wildlife and Plants",
  };

  topics_url = environment.baseURL;
  project_url = environment.baseURL + "/project";

  faSearch = faSearch;
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
  topicKeys = Object.keys(this.topics);
  filtered_topic_keys = [];
  projectsList = [];
  filteredProjectsList = [];
  dataLoading = true;
  searchTerm = "";
  selectedTopic: any;

  subtopicsFilter: string[] = null;

  constructor(
    private route: ActivatedRoute,
    private localJson: LocalJsonService,
    private searchService: SearchService,
    private router: Router,
    private location: Location,
    private aroute: ActivatedRoute,
    private urlService: UrlService,
    private cdr: ChangeDetectorRef,
  ) {
    this.dataSource = new MatTableDataSource<any>();
  }

  displayedColumns: string[] = [
    "fiscal_year",
    "title",
    "csc_name",
    "subtopics_formatted",
    "status",
  ];

  clearFilters() {
    this.current_subtopic = ["All Subtopics"];
    this.current_fy = ["All Fiscal Years"];
    this.current_status = ["All Statuses"];
    this.current_type = "Project";
    this.current_csc = ["All CASCs"];
    this.searchTerm = "";
    this.applyFilter();
    this.filterProjectsList();
  }

  onSelectClick() {
    // Sets the selectedTopic to an empty string to use the default value when select is clicked
    this.selectedTopic = "";
  }

  onTopicChange(event: any) {
    this.selectedTopic = event.target.value;
    this.clearFilters();
    this.router.navigate(["/topics", this.selectedTopic]);
  }

  changeCurrentCASC(event: any = null) {
    if (event.checked) {
      const index = this.current_csc.indexOf("All CASCs");
      if (index != -1) {
        this.current_csc.splice(index, 1);
      }
      this.current_csc.push(event.source.value);
    } else {
      const index = this.current_csc.indexOf(event.source.value);
      if (index != -1) {
        this.current_csc.splice(index, 1);
      }
    }
    if (this.current_csc.length == 0) {
      this.current_csc.push("All CASCs");
    }

    this.filterProjectsList();
  }

  changeCurrentSubTopic(event: any = null) {
    if (event.checked) {
      const index = this.current_subtopic.indexOf("All Subtopics");
      if (index != -1) {
        this.current_subtopic.splice(index, 1);
      }
      this.current_subtopic.push(event.source.value);
    } else {
      const index = this.current_subtopic.indexOf(event.source.value);
      if (index != -1) {
        this.current_subtopic.splice(index, 1);
      }
    }
    if (this.current_subtopic.length == 0) {
      this.current_subtopic.push("All Subtopics");
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

  changeCurrentYear(event: any = null) {
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

  filterProjectsList() {
    this.filteredProjectsList = [];

    for (const project of this.projectsList) {
      if (
        !this.isMatched(
          project.subtopics || [],
          this.current_subtopic,
          "All Subtopics",
        )
      )
        continue;
      if (
        !this.isMatched(project.types || [], [this.current_type], "All Types")
      )
        continue;
      if (
        !this.isMatched(
          [project.fiscal_year],
          this.current_fy,
          "All Fiscal Years",
        )
      )
        continue;
      if (
        !this.isMatched([project.status], this.current_status, "All Statuses")
      )
        continue;
      if (
        !this.isMatched(
          [project.csc?.name || ""],
          this.current_csc,
          "All CASCs",
        )
      )
        continue;

      this.filteredProjectsList.push(project);
    }

    this.updateUrl();
    this.dataSource.data = [...this.filteredProjectsList];
  }

  isMatched(projectFilters, currentFilter, all) {
    if (currentFilter.indexOf(all) === -1) {
      for (const attribute of projectFilters) {
        if (currentFilter.includes(attribute)) {
          return true;
        }
      }
      return false;
    }
    return true;
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
    for (const topicSubtopic in this.subtopicsFilter) {
      if (subtopic == this.subtopicsFilter[topicSubtopic]["label"]) {
        return true;
      }
    }
    return false;
  }

  //TODO: put this code in a utility function/service
  updateUrl() {
    const params: any = {};
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

  applyFilter() {
    // This works in conjunction with the sidebar filters to filter the table
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.dataLoading = true;
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

      this.searchService.getTopics().subscribe((topics) => {
        for (const topic in topics) {
          if (topics[topic].label == this.page_title) {
            this.subtopicsFilter = topics[topic].subtopics;
          }
        }
      });

      this.subtopics = [];
      this.fiscal_years = [];
      this.statuses = [];
      this.cscs = [];

      this.localJson
        .loadTopic(encodeURIComponent(this.topic_names[this.topic]))
        .subscribe((data) => {
          this.filtered_topic_keys = this.topicKeys.filter(
            (key) => this.topic_names[key] !== this.page_title,
          );
          this.projectsList = data;
          for (const project in this.projectsList) {
            for (const subtopic in this.projectsList[project].topics) {
              if (this.subtopicsFilter != null) {
                for (const topicSubtopic in this.subtopicsFilter) {
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
              this.fiscal_years.indexOf(
                this.projectsList[project].fiscal_year,
              ) < 0
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
              for (const this_type of this.projectsList[project].types) {
                if (this.types.indexOf(this_type) < 0) {
                  if (this_type != null) {
                    this.types.push(this_type);
                  }
                }
              }
            }

            this.filteredProjectsList.push(this.projectsList[project]);

            // cscs and year

            for (const project of this.filteredProjectsList) {
              project.csc_name = project.csc?.name || "N/A";

              // subtopics
              project.subtopics_formatted = "";
              if (project.subtopics != null) {
                project.subtopics_formatted = "<ul>";
                for (const st of project.subtopics) {
                  if (
                    this.isOnTopic(st) &&
                    project.subtopics_formatted.indexOf(st) < 0
                  ) {
                    project.subtopics_formatted += "<li>" + st + "</li>";
                  }
                }
                project.subtopics_formatted += "</ul>";
              }
              // status
              if (!project.status) {
                project.status = "N/A";
              }
            }
          }

          this.current_type = "Project";
          this.filterProjectsList();
          this.dataLoading = false;
          // Waits until the data is loaded to render the table
          this.cdr.detectChanges();
          // Sets selectedTopic to default
          this.selectedTopic = "drought-fire-extremes";
          // Applies the sorting to the table after it is available in the DOM
          this.dataSource.sort = this.sort;
          // Sets the default sorting to the fiscal year column to show the downward arrow
          this.setInitialSort();

          this.dataSource.filterPredicate = (data, filter) => {
            return (
              data.fiscal_year.toString().includes(filter) ||
              data.title.toLowerCase().includes(filter) ||
              data.csc_name.toLowerCase().includes(filter) ||
              data.subtopics_formatted.toLowerCase().includes(filter) ||
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
