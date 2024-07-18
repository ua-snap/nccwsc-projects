import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";

@Injectable()
export class LocalJsonService {
  serviceURL = environment.serviceURL;

  constructor(private http: HttpClient) {}

  loadCscProjects(csc_id) {
    var cscUrl = this.serviceURL + "/projects/" + csc_id;
    return this.http.get<any[]>(cscUrl);
  }

  loadTopics() {
    var cscUrl = this.serviceURL + "/topics/";
    return this.http.get<any[]>(cscUrl);
  }

  loadTopic(topic_name) {
    var cscUrl =
      this.serviceURL +
      "/search?query=&topics=" +
      topic_name +
      "&subtopics=&organizations=";
    return this.http.get<any[]>(cscUrl);
  }

  loadProject(csc_id, project_id) {
    var cscUrl = this.serviceURL + "/projects/" + csc_id + "/" + project_id;
    return this.http.get<any[]>(cscUrl);
  }

  private handleError(error: any): Promise<any> {
    console.error("An error occurred", error);
    return Promise.reject(error.message || error);
  }
}
