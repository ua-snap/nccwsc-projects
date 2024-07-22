/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, OnDestroy } from "@angular/core";
import { SearchService } from "../search.service";
import { Subscription } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DatePipe } from "@angular/common";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit, OnDestroy {
  results = [];
  total_results: number;
  filteredResultsCount: number;
  closeResult: string;
  noResult: boolean;
  filteredResultsSubscription: Subscription;
  filteredResultsCountSubscription: Subscription;
  totalResultsSubscription: Subscription;
  nonProjectItem: any;
  sbURL = environment.sbmainURL;

  // Define date formats
  MONTH_YEAR_FORMAT = "MM/yyyy";
  FULL_DATE_FORMAT = "MM/dd/yyyy";

  // Create an instance of DatePipe
  datePipe = new DatePipe("en-US");

  constructor(
    private searchService: SearchService,
    private modalService: NgbModal,
  ) {}

  open(nonProject, item) {
    this.nonProjectItem = item;
    this.modalService.open(nonProject, { size: "lg" });
  }

  isProject(types) {
    for (const type in types) {
      if (types[type] == "Project") {
        return true;
      }
    }
    return false;
  }

  formatDate(value) {
    try {
      const segments = value.split("-");
      switch (segments.length) {
        case 2:
          return (
            this.datePipe.transform(`${value}-01`, this.MONTH_YEAR_FORMAT) ||
            value
          );
        case 3:
          return this.datePipe.transform(value, this.FULL_DATE_FORMAT) || value;
        case 1:
        default:
          // Return the year if it is the only value
          return value;
      }
    } catch (error) {
      console.error(`Could not parse value: ${value}. Error: ${error}`);
      return value;
    }
  }

  ngOnInit() {
    this.filteredResultsSubscription =
      this.searchService.filteredResults$.subscribe((filteredResults) => {
        this.results = filteredResults;
        for (const result of this.results) {
          if (result.dates.start_date) {
            result.dates.start_date = this.formatDate(result.dates.start_date);
          }
          if (result.dates.end_date) {
            result.dates.end_date = this.formatDate(result.dates.end_date);
          }
          if (result.dates.publication_date) {
            result.dates.publication_date = this.formatDate(
              result.dates.publication_date,
            );
          }
        }
      });
    this.filteredResultsCountSubscription =
      this.searchService.filteredResultsCount$.subscribe(
        (filteredResultsCount) => {
          this.filteredResultsCount = filteredResultsCount;
        },
      );
    this.totalResultsSubscription = this.searchService.totalItem$.subscribe(
      (totalItems) => {
        // If no results are returned, totalItems returns a -1, then 0
        // This code checks to see if a -1 has been returned, then it modifies the noResult message
        this.noResult = this.total_results < 0;
        this.total_results = totalItems;
      },
    );
  }

  ngOnDestroy() {
    this.filteredResultsSubscription.unsubscribe();
    this.totalResultsSubscription.unsubscribe();
  }
}
