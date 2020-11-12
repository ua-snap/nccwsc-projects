import { Component, OnInit, Inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { DOCUMENT } from "@angular/common";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  currentVersion: string = ''
  currentPage: string
  constructor(@Inject(DOCUMENT) private document: any) { 
    this.currentPage = this.document.location.href;
  }
  ngOnInit() {
    this.currentVersion = environment.version
    console.log('Footer initialized')
  }

}
