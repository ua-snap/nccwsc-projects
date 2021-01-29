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
  showResetFilters = false
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
    this.googleAnalyticsService.eventEmitter(
      "Topic Change: " + topic['label'], "search"
    );
    this.showReset = true
  }

  onSubtopicsChange(event) {
    this.selectedSubtopics.forEach(subtopic => {
      this.googleAnalyticsService.eventEmitter(
        "Subtopic Change: " + subtopic['label'], "search"
      );
    })
    this.showReset = true
  }

  onOrgsChange(event) {
    this.selectedOrgs.forEach(org => {
      this.googleAnalyticsService.eventEmitter(
        "Organization Change: " + org['label'], "search"
      );
    })
    this.showReset = true
  }

  onOrgSourceChange(orgSource) {
    this.filteredOrg.forEach(org => {
      this.googleAnalyticsService.eventEmitter(
        "Filter Organization Results: " + org['label'], "search"
      );
    })
    this.searchService.updateOrgItems(this.filteredOrg)
    this.showResetFilters = true
  }

  onTypeSourceChange(typeSource) {
    this.filteredType.forEach(type => {
      this.googleAnalyticsService.eventEmitter(
        "Filter Data Type Results: " + type['label'], "search"
      );
    })
    this.searchService.updateTypeItems(this.filteredType)
    this.showResetFilters = true
  }

  onStatusSourceChange(statusSource) {
    this.filteredStatus.forEach(status => {
      this.googleAnalyticsService.eventEmitter(
        "Filter Project Status Results: " + status['label'], "search"
      );
    })
    this.searchService.updateStatusItems(this.filteredStatus)
    this.showResetFilters = true
  }

  onFYSourceChange(fySource) {
    this.filteredFY.forEach(fy => {
      this.googleAnalyticsService.eventEmitter(
        "Filter Fiscal Year Results: " + fy['label'], "search"
      );
    })
    this.searchService.updateFYItems(this.filteredFY)
    this.showResetFilters = true
  }

  updateFilters(){
    this.filteredOrg = []
    this.filteredFY = []
    this.filteredType = []
    this.filteredStatus = []
  }

  resetFilters() {
    this.showResetFilters = false;
    this.updateFilters();
    this.searchService.resetFilters();
  }


  onSubmit() {

    var queryString = '';
    var query = '?query=';
    var subtopics = '&subtopics=';
    var gaSubtopics = "", gaTopic = "", gaOrgs = "", gaQuery = "";
    this.showReset = true
    if ((this.selectedSubtopics.length > 0) && (this.selectedSubtopics[0] != null)) {
      for (var st of this.selectedSubtopics) {
        subtopics = subtopics + encodeURIComponent(st['label'])  + ',';
        gaSubtopics = gaSubtopics + st['label'] + ',';
      }
      subtopics = subtopics.substring(0, subtopics.length -1);
      gaSubtopics = gaSubtopics.substring(0, gaSubtopics.length -1);
    }
    var topic = '&topics=';
    if (this.selectedTopic != null) {
      topic = topic + encodeURIComponent(this.selectedTopic['label']);
      gaTopic = gaTopic + this.selectedTopic['label'];
    }
    var organizations = '&organizations=';
    if ((this.selectedOrgs.length > 0) && (this.selectedOrgs[0] != null)) {
      for (var org of this.selectedOrgs) {
        organizations = organizations + encodeURIComponent(org.label) + ',';
        gaOrgs = gaOrgs + org.label + ',';
      }
      organizations = organizations.substring(0, organizations.length - 1);
      gaOrgs = gaOrgs.substring(0, gaOrgs.length -1);
    }
    if (this.searchQuery && this.searchQuery.length > 0) {
      query = query + encodeURIComponent(this.searchQuery);
    }

    var submission = "Search Submission - Query: " + this.searchQuery + " Topic: " + gaTopic + " Subtopics: " + gaSubtopics + " Organizations: " + gaOrgs;

    this.googleAnalyticsService.eventEmitter(
      submission, "engagement"
    );

    queryString = query + topic + subtopics + organizations;
    this.searchService.searchProjects(queryString).subscribe(results => {
      this.updateFilters();
    });
  }

  ngOnInit() {
    this.resetQuery();

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
