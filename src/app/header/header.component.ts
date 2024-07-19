import { Component, OnInit } from "@angular/core";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  nccwscMenu;
  isNavbarCollapsed = true;
  isCollapsed = true;
  baseURL: string;

  fixLink(link) {
    if (link === environment.baseURL) {
      return link;
    }
    if (link.substr(0, environment.baseURL.length) === environment.baseURL) {
      if (
        link.substr(
          0,
          environment.baseURL.length + environment.projectsPath.length,
        ) ===
        environment.baseURL + environment.projectsPath
      ) {
        return link;
      } else {
        return link.replace(environment.baseURL + "/", "/");
      }
    } else {
      return environment.baseURL + "/" + link;
    }
  }

  ngOnInit() {
    this.baseURL = environment.baseURL;
  }
}
