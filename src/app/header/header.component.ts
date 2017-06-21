import { Component, OnInit } from '@angular/core';
import { NccwscDrupalService } from '../nccwsc-drupal.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  nccwscMenu;
  isNavbarCollapsed:boolean = true;
  isCollapsed = true
  constructor(private nccwscDrupal: NccwscDrupalService) { }

  fixLink(link) {
    if ((link.substr(0, 24) == 'https://nccwsc.usgs.gov/')  || (link.substr(0, 32) == 'https://my-beta.usgs.gov/nccwsc/')) {
      if ((link.substr(0,43) == 'https://my-beta.usgs.gov/nccwsc/projects/#/') || (link.substr(0, 35) == 'https://nccwsc.usgs.gov/projects/#/')) {
        return link
      } else {
        return link.replace('https://nccwsc.usgs.gov/', '');
      }
    } else {
      return link;
    }
  }

  ngOnInit() {
     this.nccwscDrupal.loadMenu().subscribe(data => {
       data[0].url = "";
       this.nccwscMenu = data;
       console.log(this.nccwscMenu)
     });


  }

}
