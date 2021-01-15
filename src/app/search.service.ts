
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable,  BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment'
import 'rxjs/Rx';

@Injectable()
export class SearchService {
  serviceURL = environment.serviceURL
  fiscal_years:any = [];
  statuses:any = [];
  results:any = [];
  filteredResults:any = [];
  filteredResultsCount:number = 0;
  resultOrgs:any = []
  resultFY:any = []
  resultTypes:any = []
  resultStatus:any = []
  orgFilter = []
  statusFilter = []
  fyFilter = []
  typeFilter = []
  _resultOrgs = new BehaviorSubject < any > ([]);
  resultOrg$ = this._resultOrgs.asObservable();
  _resultFY = new BehaviorSubject < any > ([]);
  resultFY$ = this._resultFY.asObservable();
  _resultTypes = new BehaviorSubject < any > ([]);
  resultType$ = this._resultTypes.asObservable();
  _resultStatus = new BehaviorSubject < any > ([]);
  resultStatus$ = this._resultStatus.asObservable();
  _filteredResultsSource = new BehaviorSubject < any > ([]);
  filteredResults$ = this._filteredResultsSource.asObservable();
  _totalResultsSource = new BehaviorSubject < number > (0);
  totalItem$ = this._totalResultsSource.asObservable();
  _filteredResultsCountSource = new BehaviorSubject < number > (0);
  filteredResultsCount$ = this._filteredResultsCountSource.asObservable();

  constructor(private http: HttpClient) { }

  getTopics() {
    var topicsUrl = this.serviceURL + '/topics';
    return this.http.get<any[]>(topicsUrl);
  }

  getOrganizations() {
    var organizationsUrl = this.serviceURL + '/organizations';
    return this.http.get<any[]>(organizationsUrl);
  }

  updateResults(item) {
    this.filteredResults.push(item);
  }

  sortProjectsByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key].trim().replace(/['"]/g, '').toLowerCase(); var y = b[key].trim().replace(/['"]/g, '').toLowerCase();
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  updateTotalResults(number) {
    this._totalResultsSource.next(number);
  }

  updateFilteredResultsCount(number) {
    this._filteredResultsCountSource.next(number);
  }

  updateOrgItems(orgSource){
    this.orgFilter = orgSource;
    this.filterItems();
  }

  updateTypeItems(typeSource) {
    this.typeFilter = typeSource;
    this.filterItems();
  }

  updateStatusItems(statusSource) {
    this.statusFilter = statusSource;
    this.filterItems();
  }

  updateFYItems(fySource) {
    this.fyFilter = fySource
    this.filterItems()
  }

  resetFilters() {
    this.clearFilters()
  }

  setFilters() {
    var tempOrgs = [];
    var tempTypes = [];
    var tempStatus = [];
    var tempFY = [];

    for (var item of this.filteredResults) {
      for (var org in item.organizations) {
        if ((tempOrgs.indexOf(item.organizations[org].trim()) < 0) && item.organizations[org] != null) {
          tempOrgs.push(item.organizations[org].trim());
        }
      }
      for (var type in item.types) {
        if ((tempTypes.indexOf(item.types[type]) < 0) && (item.types[type] != null)){
          tempTypes.push(item.types[type])
        }
      }
      if ((tempFY.indexOf(item.fiscal_year) < 0) && (item.fiscal_year != null)) {
        tempFY.push(item.fiscal_year)
      }
      if ((tempStatus.indexOf(item.status) < 0) && (item.status != null)){
        tempStatus.push(item.status)
      }
      this.updateResults(item);
    }

    var value = 0;
    tempOrgs.sort();
    for (var org in tempOrgs) {
      this.resultOrgs.push({'value': value, 'label': tempOrgs[org]});
      value = value + 1;
    }
    value = 0;
    tempTypes.sort();
    for (var type in tempTypes) {
      this.resultTypes.push({'value': value, 'label': tempTypes[type]});
      value = value + 1;
    }

    value = 0;
    tempFY.sort();
    for (var fy in tempFY) {
      this.resultFY.push({'value': value, 'label': tempFY[fy]});
      value = value + 1;
    }

    value = 0;
    tempStatus.sort();
    for (var status in tempStatus) {
      this.resultStatus.push({'value': value, 'label': tempStatus[status]});
      value = value + 1;
    }

    this._resultOrgs.next(this.resultOrgs);
    this._resultFY.next(this.resultFY);
    this._resultTypes.next(this.resultTypes);
    this._resultStatus.next(this.resultStatus);
  }


  filterItems() {
    // This appears to be decrimenting the result count by 1
    // so if it starts at 0 it will be -1 after this call
    // don't remove this behavior as it is being used in search.component.ts ngOnInit
    this.updateFilteredResultsCount(-1);
    this.filteredResults = [];
    var tempOrgs = [];
    var tempTypes = [];
    var tempStatus = [];
    var tempFY = [];

    for (var item of this.results) {
      var hasOrg = false;
      var hasStatus = false;
      var hasFY = false;
      var hasType = false;
      console.log("item");
      console.log(item);

      if (this.orgFilter.length > 0) {
        if (item.organizations != [] && item.organizations != null) {
          for (var orgf of this.orgFilter) {
            for (var org in item.organizations) {
              if (item.organizations[org].trim() == this.resultOrgs[orgf.value].label.trim()) {
                hasOrg = true;
                break;
              }
            }
          }
        }
      } else {
        hasOrg = true
      }

      if (this.statusFilter.length > 0) {
        if (item.status != [] && item.status != null) {
          for (var sf of this.statusFilter) {
            if (item.status == this.resultStatus[sf.value].label) {
              hasStatus = true;
              break;
            }
          }
        }
      } else {
        hasStatus = true
      }

      if (this.fyFilter.length > 0) {
        if (item.fiscal_year != [] && item.fiscal_year != null) {
          for (var fy of this.fyFilter) {
            if (item.fiscal_year == this.resultFY[fy.value].label) {
              hasFY = true
              break;
            }
          }
        }
      } else {
        hasFY = true
      }

      if (this.typeFilter.length > 0) {
        if (item.types != [] && item.types != null) {
          for (var ft of this.typeFilter) {
            for (var type in item.types) {
              if (item.types[type] == this.resultTypes[ft.value].label) {
                hasType = true;
                break;
              }
            }
          }
        }
      } else {
        hasType = true;
      }

      if ((hasOrg) && (hasStatus) && (hasFY) && (hasType)) {
        this.filteredResults.push(item);
      }
    }

      var value = 0;
      tempOrgs.sort();
      for (var org in tempOrgs) {
        this.resultOrgs.push({'value': value, 'label': tempOrgs[org]});
        value = value + 1;
      }
      value = 0;
      tempTypes.sort();
      for (var type in tempTypes) {
        this.resultTypes.push({'value': value, 'label': tempTypes[type]});
        value = value + 1;
      }

      value = 0;
      tempFY.sort();
      for (var fy of tempFY) {
        this.resultFY.push({'value': value, 'label': fy});
        value = value + 1;
      }

      value = 0;
      tempStatus.sort();
      for (var status in tempStatus) {
        this.resultStatus.push({'value': value, 'label': tempStatus[status]});
        value = value + 1;
      }

      this._resultOrgs.next(this.resultOrgs);
      this._resultFY.next(this.resultFY);
      this._resultTypes.next(this.resultTypes);
      this._resultStatus.next(this.resultStatus);

    if (Object.keys(this.filteredResults).length == 0) {
      this.updateFilteredResultsCount(-1)
    } else {
      this.updateFilteredResultsCount(Object.keys(this.filteredResults).length);
    }
    this._filteredResultsSource.next(this.filteredResults);

  }

  clearFilters() {
    this.filteredResults = []
    this.orgFilter = []
    this.statusFilter = []
    this.fyFilter = []
    this.typeFilter = []
    this.resultOrgs = []
    this.resultFY = []
    this.resultTypes = []
    this.resultStatus = []
    this._resultOrgs.next(this.resultOrgs);
    this._resultFY.next(this.resultFY);
    this._resultTypes.next(this.resultTypes);
    this._resultStatus.next(this.resultStatus);
    this.filterItems();
  }

  wipeQuery() {
    this.results = []
    this.filteredResults = []
    this.resultOrgs = []
    this.resultFY = []
    this.resultTypes = []
    this.resultStatus = []
    this.updateTotalResults(0)
    this._filteredResultsSource.next(this.filteredResults);
    this._resultOrgs.next(this.resultOrgs);
    this._resultFY.next(this.resultFY);
    this._resultTypes.next(this.resultTypes);
    this._resultStatus.next(this.resultStatus);
  }

  searchProjects(queryString) {
    this.updateTotalResults(-1)
    this.clearFilters()
    var searchUrl = this.serviceURL + '/search' + queryString;
    this.results = [];
    this.filteredResults = [];
    return this.http.get(searchUrl).pipe(map((res:Response) => {
      this.results = this.sortProjectsByKey(res, 'title');
      var tempOrgs = [];
      var tempTypes = [];
      var tempStatus = [];
      var tempFY = [];
      this.updateTotalResults(Object.keys(this.results).length);
      this.updateFilteredResultsCount(Object.keys(this.results).length)

      for (var item of this.results) {
        for (var org in item.organizations) {
          if ((tempOrgs.indexOf(item.organizations[org].trim()) < 0) && item.organizations[org] != null) {
            tempOrgs.push(item.organizations[org].trim());
          }
        }
        for (var type in item.types) {
          if ((tempTypes.indexOf(item.types[type]) < 0) && (item.types[type] != null)){
            tempTypes.push(item.types[type])
          }
        }
        if ((tempFY.indexOf(item.fiscal_year) < 0) && (item.fiscal_year != null)) {
          tempFY.push(item.fiscal_year)
        }
        if ((tempStatus.indexOf(item.status) < 0) && (item.status != null)){
          tempStatus.push(item.status)
        }
        this.updateResults(item);
      }
      var value = 0;
      tempOrgs.sort();
      for (var org in tempOrgs) {
        this.resultOrgs.push({'value': value, 'label': tempOrgs[org]});
        value = value + 1;
      }
      value = 0;
      tempTypes.sort();
      for (var type in tempTypes) {
        this.resultTypes.push({'value': value, 'label': tempTypes[type]});
        value = value + 1;
      }

      value = 0;
      tempFY.sort();
      for (var fy in tempFY) {
        this.resultFY.push({'value': value, 'label': tempFY[fy]});
        value = value + 1;
      }

      value = 0;
      tempStatus.sort();
      for (var status in tempStatus) {
        this.resultStatus.push({'value': value, 'label': tempStatus[status]});
        value = value + 1;
      }

      this._filteredResultsSource.next(this.filteredResults);
      this._resultOrgs.next(this.resultOrgs);
      this._resultFY.next(this.resultFY);
      this._resultTypes.next(this.resultTypes);
      this._resultStatus.next(this.resultStatus);
    }));
  }
}
