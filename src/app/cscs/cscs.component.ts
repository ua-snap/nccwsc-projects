import { Component, OnInit } from '@angular/core';
import { UrlService } from "../url.service";

declare function imageMapResize(): void;

@Component({
  selector: 'app-cscs',
  templateUrl: './cscs.component.html',
  styleUrls: ['./cscs.component.scss']
})

export class CscsComponent implements OnInit {

  config = {
    fade: true,
    alwaysOn: false,
    neverOn: false,

    // fill
    fill: true,
    fillColor: '#ffffff',
    fillOpacity: 0.4,

    // stroke
    stroke: true,
    strokeColor: '#f0ff00',
    strokeOpacity: 1,
    strokeWidth: 5,

    // shadow:
    shadow: false,
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 10
  }

  csc_ids = [
    {'id': 'alaska', 'name' : 'Alaska'},
    {'id': 'midwest', 'name': 'Midwest'},
    {'id': 'northwest', 'name' : 'Northwest'},
    {'id': 'north-central', 'name' : 'North Central'},
    {'id': 'northeast', 'name' : 'Northeast'},
    {'id': 'pacific-islands', 'name' : 'Pacific Islands'},
    {'id': 'southwest', 'name' : 'Southwest'},
    {'id': 'south-central', 'name' : 'South Central'},
    {'id': 'southeast', 'name' : 'Southeast'},
    {'id': 'national-casc', 'name' : 'National CASC'},
  ]

  topic_ids = [
    {'id': 'drought-fire-extremes', 'name': 'Drought, Fire and Extreme Weather'},
    {'id': 'landscapes', 'name': 'Landscapes'},
    {'id': 'indigenous-peoples', 'name': 'Indigenous Peoples'},
    {'id': 'science-tools', 'name': 'Science Tools for Managers'},
    {'id': 'water-coasts-ice', 'name': 'Water, Coasts and Ice'},
    {'id': 'wildlife-plants', 'name': 'Wildlife and Plants'},
  ]

  constructor(private urlService: UrlService) { }

  ngOnInit() {
    this.urlService.setPreviousTitle(null);
  }

  imageResized() {
    imageMapResize(); // Javascript function in imageMapResizer.min.js 
  }

}
