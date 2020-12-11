import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';
import { Subscription } from 'rxjs';
import{ GoogleAnalyticsService } from '../google-analytics.service';

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
  selectedSubtopic: number[] = [null]
  selectedOrg: number = null
  selectedOrgs = []
  selectedSubtopics = []
  topics:any = []
  subtopics:any = []
  orgs:any = []
  showReset = false
  totalResults: number;
  totalResultsSubscription: Subscription; 
  multipleOrgs = true
  resultOrgs
  resultFY
  resultTypes
  resultStatus
  filteredOrg:any = []
  filteredFY:any = []
  filteredType:any = []
  filteredStatus:any = []
  orgsLoaded = false
  topicsLoaded = false

  constructor(private googleAnalyticsService: GoogleAnalyticsService, private searchService: SearchService) { }

  resetQuery() {
    this.selectedSubtopics = []
    this.selectedTopic = null
    this.selectedOrgs = []
    this.searchQuery = ''
    this.searchService.wipeQuery()
    this.subtopics = []
  }

  onQueryChange(query) {
    this.showReset = true
  }

  onTopicsChange(event) {
    var topic = this.topics[event]
    this.subtopics = topic['subtopics']
    this.showReset = true
  }

  onSubtopicsChange(event) {
    this.showReset = true
  }

  onOrgsChange(event) {
    this.showReset = true
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

    this.googleAnalyticsService.eventEmitter(
      "search", "submit" 
    );

    var queryString = '';
    var query = '?query=';
    var subtopics = '&subtopics=';
    this.showReset = true
    if ((this.selectedSubtopics.length > 0) && (this.selectedSubtopics[0] != null)) {
      for (var st of this.selectedSubtopics) {
        subtopics = subtopics + encodeURIComponent(st['label'])  + ',';
      }
      subtopics = subtopics.substring(0, subtopics.length -1)
    }
    var topic = '&topics=';
    if (this.selectedTopic != null) {
      topic = topic + encodeURIComponent(this.selectedTopic['label']);
    }
    var organizations = '&organizations=';
    if ((this.selectedOrgs.length > 0) && (this.selectedOrgs[0] != null)) {
      for (var org of this.selectedOrgs) {
        organizations = organizations + encodeURIComponent(org.label) + ',';
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
      this.topics = [];
      topics.forEach(topic => {
        this.topics[topic.value] = {
          value: topic.value,
          label: topic.label,
          subtopics: topic.subtopics
        }
      })
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
