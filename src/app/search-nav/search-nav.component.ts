import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';
import { Subscription } from 'rxjs';
import{ UmamiService } from '../umami.service';

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
  resultOrgs:any = []
  resultFY:any = []
  resultTypes:any = []
  resultStatus:any = []
  filteredOrg:any = []
  filteredFY:any = []
  filteredType:any = []
  filteredStatus:any = []
  orgsLoaded = false
  topicsLoaded = false

  constructor(private umamiService: UmamiService, private searchService: SearchService) { }

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
    this.showResetFilters = true
  }

  onTypeSourceChange(typeSource) {
    this.sendAnalytics()
    this.searchService.updateTypeItems(this.filteredType)
    this.showResetFilters = true
  }

  onStatusSourceChange(statusSource) {
    this.sendAnalytics()
    this.searchService.updateStatusItems(this.filteredStatus)
    this.showResetFilters = true
  }

  onFYSourceChange(fySource) {
    this.sendAnalytics()
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

  combineLabels(arr) {
    return arr.map(x => x['label']).join(', ')
  }

  sendAnalytics() {
    // The CSV export script expects every event to have the full set of
    // field keys. So, initialize all fields with blank strings to start with.
    let payload = {
      query: '',
      topic: '',
      payload: '',
      organizations: '',
      type: '',
      fy: '',
      status: ''
    }

    if (this.searchQuery) {
      payload['query'] = this.searchQuery
    }
    if (this.selectedTopic) {
      payload['topic'] = this.selectedTopic['label']
    }
    if (this.selectedSubtopics) {
      payload['subtopics'] = this.combineLabels(this.selectedSubtopics)
    }
    if (this.selectedOrgs) {
      payload['organizations'] = this.combineLabels(this.selectedOrgs)
    }
    if (this.filteredType) {
      payload['type'] = this.combineLabels(this.filteredType)
    }
    if (this.filteredFY) {
      payload['fy'] = this.combineLabels(this.filteredFY)
    }
    if (this.filteredStatus) {
      payload['status'] = this.combineLabels(this.filteredStatus)
    }
    this.umamiService.eventEmitter("Search Submission", payload)
  }

  onSubmit() {

    // Wipe previous query on new search
    this.searchService.wipeQuery()

    var queryString = '';
    var query = '?query=';
    var subtopics = '&subtopics=';
    this.showReset = true
    if ((this.selectedSubtopics.length > 0) && (this.selectedSubtopics[0] != null)) {
      for (var st of this.selectedSubtopics) {
        subtopics = subtopics + encodeURIComponent(st['label'])  + ',';
      }
      subtopics = subtopics.substring(0, subtopics.length -1);
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
      organizations = organizations.substring(0, organizations.length - 1);
    }
    if (this.searchQuery && this.searchQuery.length > 0) {
      query = query + encodeURIComponent(this.searchQuery);
    }

    this.sendAnalytics()

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
