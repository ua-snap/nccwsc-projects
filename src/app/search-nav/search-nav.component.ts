import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'search-nav',
  templateUrl: './search-nav.component.html',
  styleUrls: ['./search-nav.component.scss']
})
export class SearchNavComponent implements OnInit {
  resultOrgsSubscription: Subscription;
  resultFYSubscription: Subscription;
  resultStatusSubscription: Subscription;
  resultTypesSubscription: Subscription;

  searchQuery:string = null
  selectedTopic: number = null
  selectedSubtopic: number = null
  selectedOrg: number = null
  selectedOrgs = []
  selectedSubtopics = [null]
  topics = null
  subtopics = null
  orgs = null
  showReset = false
  totalResults: number;
  totalResultsSubscription: Subscription; 
  multipleOrgs = true
  resultOrgs
  resultFY
  resultTypes
  resultStatus
  filteredOrg:any = [null]
  filteredFY:any = [null]
  filteredType:any = [null]
  filteredStatus:any = [null]
  orgsLoaded = false
  topicsLoaded = false

  constructor(private searchService: SearchService) { }

  resetQuery() {
    this.selectedSubtopics = []
    this.selectedTopic = null
    this.selectedOrgs = []
    this.searchQuery = null
    this.searchService.wipeQuery()
    this.subtopics = null
  }

  onQueryChange(query) {
    this.showReset = true
  }

  onTopicsChange(event) {
    console.log(event)
    var topic = this.topics[event]
    this.subtopics = topic['subtopics']
    this.showReset = true
  }

  onSubtopicsChange(event) {
    this.showReset = true
    console.log(this.selectedSubtopics)
  }

  onOrgsChange(event) {
    this.showReset = true
    console.log(this.selectedOrgs)
  }

  onOrgSourceChange(orgSource) {
    this.searchService.updateOrgItems(this.filteredOrg)
  }

  onTypeSourceChange(typeSource) {
    this.searchService.updateTypeItems(this.filteredType)
  }

  onStatusSourceChange(statusSource) {
    this.searchService.updateStatusItems(this.filteredStatus)
  }

  onFYSourceChange(fySource) {
    this.searchService.updateFYItems(this.filteredFY)
  }

  updateFilters(){
    this.filteredOrg = [null]    
    this.filteredFY = [null]
    this.filteredType = [null]
    this.filteredStatus = [null]
  }

  resetFilters() {
    this.showReset = false
    this.updateFilters();
    this.searchService.resetFilters();
  }


  onSubmit() {
    var queryString = '';
    var query = '?query=';
    var subtopics = '&subtopics=';
    this.showReset = true
    if ((this.selectedSubtopics.length > 0) && (this.selectedSubtopics[0] != null)) {
       for (var st of this.selectedSubtopics) {
         for (var thisSubtopic of this.subtopics) {
           if (thisSubtopic.value == st) {
             var query_subtopic = thisSubtopic['label']
           }
         }
         subtopics = subtopics + encodeURIComponent(query_subtopic)  + ',';
       }
       subtopics = subtopics.substring(0, subtopics.length -1)
    }
    var topic = '&topics=';
    if ((this.selectedTopic != null) && (this.selectedTopic > -1)) {
      topic = topic + encodeURIComponent(this.topics[this.selectedTopic]['label']);
    }
    var organizations = '&organizations=';
    if ((this.selectedOrgs.length > 0) && (this.selectedOrgs[0] != null)) {
      for (var org of this.selectedOrgs) {
        organizations = organizations + encodeURIComponent(this.orgs[org]['label']) + ',';
      }
      organizations = organizations.substring(0, organizations.length - 1)
    }
    if (this.searchQuery && this.searchQuery.length > 0) {
      query = query + encodeURIComponent(this.searchQuery);
    }
    queryString = query + topic + subtopics + organizations;
    this.searchService.searchProjects(queryString).subscribe(results => {
      this.updateFilters();
    });
  }

  ngOnInit() {
    this.searchService.getTopics().subscribe(topics => {
      this.topics = topics;
      this.topicsLoaded = true
    });

    this.searchService.getOrganizations().subscribe(organizations => {
      this.orgs = organizations;
      this.orgsLoaded = true
    });

    this.totalResultsSubscription = this.searchService.totalItem$.subscribe(totalItems=>
    {
      this.totalResults = totalItems;
    });

    this.resultOrgsSubscription = this.searchService.resultOrg$.subscribe(resultOrgs=>
    {
      this.resultOrgs = resultOrgs;
    });

    this.resultFYSubscription = this.searchService.resultFY$.subscribe(resultFY=>
    {
      this.resultFY = resultFY;
    });

    this.resultTypesSubscription = this.searchService.resultType$.subscribe(resultTypes=>
    {
      this.resultTypes = resultTypes;
    });
    this.resultStatusSubscription = this.searchService.resultStatus$.subscribe(resultStatus=>
    {
      this.resultStatus = resultStatus;
    });
    this.updateFilters();
    this.searchService.resetFilters();

  }

}
