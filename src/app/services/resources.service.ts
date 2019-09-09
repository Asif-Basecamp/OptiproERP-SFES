import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from 'src/constants/constants';
import { ApiUtils } from 'src/constants/apiutils';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {
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


  getResourceDetail(taskId: string, taskHdId: string): Observable<any> {
    var jObject = {
      COMPANYDBNAME: JSON.stringify([{
        COMPANYDBNAME: localStorage.getItem(Constants.CompID),
        TASKID: taskId,
        TASKHDID: taskHdId
      }])
    };

    return this.httpclient.post(localStorage.getItem(Constants.ServiceURL) + ApiUtils.url_GetResourceDetail, jObject,
      this.httpOptions);
  }

  saveResourceDetail(jObject: any): Observable<any> {
    // var jObject = {
    //   TASK: JSON.stringify([{
    //     CompanyDBId: localStorage.getItem(Constants.CompID),
    //     ScreenId: "1"
    //   }])
    // };

    return this.httpclient.post(localStorage.getItem(Constants.ServiceURL) + ApiUtils.url_SaveResourceDetail, jObject,
      this.httpOptions);
  }
}
