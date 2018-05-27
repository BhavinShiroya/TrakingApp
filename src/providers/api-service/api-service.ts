import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ApiServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiServiceProvider {
  serverUrl: string = "http://sos.techsofttutorials.com";
  constructor(public http: HttpClient) {
    console.log('Hello ApiServiceProvider Provider');
  }

  get(url): any {
    return this.http.get(this.serverUrl + url);
  }
  post(url, param): any {
    return this.http.post(this.serverUrl + url, param);
  }

}
