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

  /**
   * Common api service method for StartResume, AbortRecord, Interrupt, Submit and Finish.
   * @param request 
   */
  public saveTask(methodName: string, request: any): Observable<any> {
    var URL;
    var jObject;
    if (methodName == Constants.mStartResume) {
      URL = ApiUtils.url_SaveTaskDetail;
      jObject = { SAVETASK: JSON.stringify([request])};
    } else if (methodName == Constants.mAbortRecord) {
      URL = ApiUtils.url_AbortRecord;
      jObject = { TASK: JSON.stringify([request])};
    } else if (methodName == Constants.mInterrupt) {
      URL = ApiUtils.url_SaveInteruptTaskDetail;
      jObject = { SAVETASK: JSON.stringify([request]) };
    } else if (methodName == Constants.mSubmit) {
      URL = ApiUtils.url_SubmitTask;
      jObject = { SUBMITTASKDETAILS: JSON.stringify([request])};
    } else if (methodName == Constants.mFinish) {
      URL = ApiUtils.url_SaveTaskDetail;
      jObject = { SAVETASK: JSON.stringify([request])};
    }
    return this.httpclient.post(localStorage.getItem(Constants.ServiceURL) + URL, jObject, this.httpOptions);
  }
}
