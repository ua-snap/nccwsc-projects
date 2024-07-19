/* eslint-disable @typescript-eslint/no-explicit-any */
import { catchError } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";

@Injectable()
export class SciencebaseService {
  constructor(public http: HttpClient) {}

  getSciencebaseRecord(sbId) {
    const sbURL =
      environment.sbmainURL + "/catalog/item/" + sbId + "?format=json";
    return this.http.get<any[]>(sbURL).pipe(catchError(this.handleError));
  }

  private handleError(error: any): Promise<any> {
    console.error("An error occurred", error);
    return Promise.reject(error.message || error);
  }
}
