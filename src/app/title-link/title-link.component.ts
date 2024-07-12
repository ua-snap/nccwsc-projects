import { Component, Input, OnInit, Pipe, PipeTransform } from "@angular/core";

@Component({
  selector: "app-title-link",
  template: ` <a class="app-title-link" href="{{ href }}">{{ value }}</a> `,
  styleUrls: ["./title-link.component.scss"],
})
export class TitleLinkComponent implements OnInit {
  // renderValue;
  href: string;

  @Input() value: string | number;
  @Input() rowData: any;

  ngOnInit() {
    if (this.rowData.types.indexOf("Project") >= 0) {
      this.href = "#/project/" + this.rowData.csc["id"] + "/" + this.rowData.id;
    } else {
      this.href = "#/component/" + this.rowData.id;
    }
  }
}
