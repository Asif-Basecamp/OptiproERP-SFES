import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Constants } from 'src/constants/constants';
import { Observable } from 'rxjs';
import { ApiUtils } from 'src/constants/apiutils';

@Injectable({
  providedIn: 'root'
})
export class TimeentryService {
  public config_params: any;
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  }

  constructor(private httpclient: HttpClient) {
    this.config_params = JSON.parse(sessionStorage.getItem('ConfigData'));
  }

  public loadConfig() {
    this.config_params = JSON.parse(sessionStorage.getItem('ConfigData'));
  }

  public getAllReasons(): Observable<any> {
    var jObject = {
      
    };

    return this.httpclient.post(localStorage.getItem(Constants.ServiceURL) + ApiUtils.url_GetAllReasons, jObject,
      this.httpOptions);
  }

  // getAttachmentColumnNames(wo: string, operNo: string): Observable<any> {
  //   var jObject = {
  //     TASK: JSON.stringify([{
  //       CompanyDBId: localStorage.getItem(Constants.CompID),
  //       WO: wo,
  //       OperNo: operNo,
  //       UserName: localStorage.getItem(Constants.UserId),
  //       logInUserTime: localStorage.getItem(Constants.loginDateTime)
  //     }])
  //   };

  //   return this.httpclient.post(localStorage.getItem(Constants.ServiceURL) + ApiUtils.url_GetAttachmentColumnNames, jObject,
  //     this.httpOptions);
  // }
}
