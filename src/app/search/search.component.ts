/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, OnDestroy } from "@angular/core";
import { SearchService } from "../search.service";
import { Subscription } from "rxjs";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
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

  constructor(
    private searchService: SearchService,
    private modalService: NgbModal,
  ) {}

  open(nonProject, item) {
    this.nonProjectItem = item;
    this.modalService.open(nonProject, { size: "lg" }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  isProject(types) {
    for (const type in types) {
      if (types[type] == "Project") {
        return true;
      }
    }
    return false;
  }

  /*
  Takes a string of 'yyyy', 'yyyy-MM', or 'yyyy-MM-dd' and returns a formatted date, only using the values present:
    1981 -> 1981
  */
  static niceDate(value) {
    try {
      switch (value.split("-").length) {
        case 2:
          /* the '-01' is a fix but the reason for why it's needed is unclear. */
          return new DatePipe("en-US").transform(value + "-01", "MM/yyyy");
        case 3:
          return new DatePipe("en-US").transform(value, "MM/dd/yyyy");
        case 1:
        default:
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
            result.dates.start_date = SearchComponent.niceDate(
              result.dates.start_date,
            );
          }
          if (result.dates.end_date) {
            result.dates.end_date = SearchComponent.niceDate(
              result.dates.end_date,
            );
          }
          if (result.dates.publication_date) {
            result.dates.publication_date = SearchComponent.niceDate(
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnDestroy() {
    this.filteredResultsSubscription.unsubscribe();
    this.totalResultsSubscription.unsubscribe();
  }
}
