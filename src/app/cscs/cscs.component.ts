import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cscs',
  templateUrl: './cscs.component.html',
  styleUrls: ['./cscs.component.scss']
})
export class CscsComponent implements OnInit {

  csc_ids = [
    {'id': 'alaska', 'name' : 'Alaska'},
    {'id': 'midwest', 'name': 'Midwest CASC'},
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
    {'id': 'landscapes', 'name': 'Landscapes'},
    {'id': 'drought-fire-extremes', 'name': 'Drought, Fire and Extreme Weather'},
    {'id': 'wildlife-plants', 'name': 'Wildlife and Plants'},
    {'id': 'water-coasts-ice', 'name': 'Water, Coasts and Ice'},
    {'id': 'native-communities', 'name': 'Native Communities'},
    {'id': 'science-tools', 'name': 'Science Tools for Managers'},
  ]

  constructor() { }

  ngOnInit() {
  }

}
