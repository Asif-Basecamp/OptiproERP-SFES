import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from 'src/constants/constants';
import { ApiUtils } from 'src/constants/apiutils';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
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

  getAllTask(): Observable<any> {
    let jObject = {
      TASK: JSON.stringify([{
        COMPANYDBNAME: localStorage.getItem(Constants.CompID),
        TASKID: "",
        RESINSTANCE: localStorage.getItem(Constants.machine),
        Warehouse: localStorage.getItem(Constants.whseId),
        Workcenter: localStorage.getItem(Constants.workCenter),
        EMPID: localStorage.getItem(Constants.EmpID),
        ReqMachine: "1",
        Username: localStorage.getItem(Constants.UserId),
        GUID: localStorage.getItem(Constants.GUID)
      }])
    };
    console.log("getAllTask jObject: "+jObject)
    return this.httpclient.post(localStorage.getItem(Constants.ServiceURL) + ApiUtils.url_GetAllTask, jObject,
      this.httpOptions);
  }

  removeLoggedInUser(): Observable<any> {
    var jObject = {
      CompanyId: localStorage.getItem(Constants.CompID),
      GUID: localStorage.getItem(Constants.GUID),
      Login: localStorage.getItem(Constants.UserId)
    };
    return this.httpclient.post(localStorage.getItem(Constants.ServiceURL) + ApiUtils.url_RemoveLoggedInUser, jObject,
      this.httpOptions);
  }

  deleteDirectory(): Observable<any> {
    var jObject = {
      UserDetailsForAttachment: JSON.stringify([{
        Username: localStorage.getItem(Constants.UserId),
        logInUserTime: localStorage.getItem(Constants.loginDateTime)
      }])
    };

    return this.httpclient.post(localStorage.getItem(Constants.ServiceURL) + ApiUtils.url_DeleteDirectory, jObject,
      this.httpOptions);
  }

  getAutoLot(itemCode: string, wo: string): Observable<any> {
    var jObject = {
      TASK: JSON.stringify([{
        COMPANYDBNAME: localStorage.getItem(Constants.CompID),
        UserId: localStorage.getItem(Constants.UserId),
        ItemCode: itemCode,
        WO: wo
      }])
    };

    return this.httpclient.post(localStorage.getItem(Constants.ServiceURL) + ApiUtils.url_GetAutoLot, jObject,
      this.httpOptions);
  }

  getExistingTaskDetail(taskId: string): Observable<any> {
    var jObject = {
      TASK: JSON.stringify([{
        COMPANYDBNAME: localStorage.getItem(Constants.CompID),
        UserId: localStorage.getItem(Constants.UserId),
        TASKID: taskId
      }])
    };

    return this.httpclient.post(localStorage.getItem(Constants.ServiceURL) + ApiUtils.url_GetExistingTaskDetail, jObject,
      this.httpOptions);
  }

  getItemManagedBy(itemCode: string): Observable<any> {
    var jObject = {
      GetItemManagedBy: JSON.stringify([{
        CompanyDBId: localStorage.getItem(Constants.CompID),
        ItemCode: itemCode
      }])
    };

    return this.httpclient.post(localStorage.getItem(Constants.ServiceURL) + ApiUtils.url_GetItemManagedBy, jObject,
      this.httpOptions);
  }

  getAttachmentColumnNames(wo: string, operNo: string): Observable<any> {
    var jObject = {
      TASK: JSON.stringify([{
        CompanyDBId: localStorage.getItem(Constants.CompID),
        WO: wo,
        OperNo: operNo,
        UserName: localStorage.getItem(Constants.UserId),
        logInUserTime: localStorage.getItem(Constants.loginDateTime)
      }])
    };

    return this.httpclient.post(localStorage.getItem(Constants.ServiceURL) + ApiUtils.url_GetAttachmentColumnNames, jObject,
      this.httpOptions);
  }

  getConfigSettings(): Observable<any> {
    var jObject = {
      TASK: JSON.stringify([{
        CompanyDBId: localStorage.getItem(Constants.CompID),
        ScreenId: "1"
      }])
    };

    return this.httpclient.post(localStorage.getItem(Constants.ServiceURL) + ApiUtils.url_getConfigSetting, jObject,
      this.httpOptions);
  }
}
