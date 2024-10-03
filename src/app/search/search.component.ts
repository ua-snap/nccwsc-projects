/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, OnDestroy } from "@angular/core";
import { SearchService } from "../search.service";
import { Subscription } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Shared } from "../shared";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss", "../shared.scss"],
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

  shared: Shared;

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

  ngOnInit() {
    this.shared = new Shared();
    this.filteredResultsSubscription =
      this.searchService.filteredResults$.subscribe((filteredResults) => {
        this.results = filteredResults;
        for (const result of this.results) {
          if (result.dates.start_date) {
            result.dates.start_date = this.shared.formatDate(
              result.dates.start_date,
            );
          }
          if (result.dates.end_date) {
            result.dates.end_date = this.shared.formatDate(
              result.dates.end_date,
            );
          }
          if (result.dates.publication_date) {
            result.dates.publication_date = this.shared.formatDate(
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
