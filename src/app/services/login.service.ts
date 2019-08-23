import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from 'src/constants/constants';
import { ApiUtils } from 'src/constants/apiutils';

@Injectable({
  providedIn: 'root'
})

export class LoginService {
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
  
    public loadConfig(){
      this.config_params = JSON.parse(sessionStorage.getItem('ConfigData'));
    }
  
    getPSURL(url:string): Observable<any> {
      var jObject = { CompanyName: JSON.stringify([{ CompanyDBId: "OPTIPROADMIN" }]) };
      return this.httpclient.post(url+ApiUtils.url_GetPSURL, jObject, this.httpOptions);
    } 
  
    getCompAndLang(): Observable<any> {
      let jObject = {
          Username: JSON.stringify([{
          Username: localStorage.getItem(Constants.UserId),
          Product: "SFES"
        }])
      };
      return this.httpclient.post(localStorage.getItem(Constants.PSURLFORADMIN) + ApiUtils.url_GetCompaniesAndLanguages, jObject,
        this.httpOptions);
    }

    getWHS(compId: string): Observable<any> {
      let jObject = {
          CompanyName: JSON.stringify([{
          Username: localStorage.getItem(Constants.UserId),
          CompanyDBId: compId
        }])
      };
      return this.httpclient.post(localStorage.getItem(Constants.PSURLFORADMIN) + ApiUtils.url_GetWHS, jObject,
        this.httpOptions);
    }

    getWorkcenter(compId: string, whsId: string): Observable<any> {
      let jObject = {
          Warehouse: JSON.stringify([{
          Username: localStorage.getItem(Constants.UserId),
          CompanyDBId: compId,
          Warehouse: whsId
        }])
      };
      return this.httpclient.post(localStorage.getItem(Constants.PSURLFORADMIN) + ApiUtils.url_getWorkcenter, jObject,
        this.httpOptions);
    }

    getMachine(compId: string, employeID: string, workCenter: string): Observable<any> {
      var jObject = { 
        CompanyName: JSON.stringify([{ 
          Username: localStorage.getItem(Constants.UserId), 
          CompanyDBId: compId, 
          EmpId: employeID, 
          Workcenter: workCenter }]) 
        };
      return this.httpclient.post(this.config_params.service_url + ApiUtils.url_GetMachine, jObject,
        this.httpOptions);
    }
  
    /**
     * Function for validate user login.
     * 
     * @param username
     * @param password 
     */
    validateUserLogin(username: String, password: String): Observable<any> {
      //JSON Obeject prepared to be send as a param to API.
      let jObject = {
        Login: JSON.stringify([{
          User: username,
          Password: password, 
          IsAdmin: "false"
        }])
      };
      return this.httpclient.post(localStorage.getItem(Constants.PSURLFORADMIN) + ApiUtils.url_ValidateUserLogin, jObject,
        this.httpOptions);
    }
  
    /**
     * Function used for check license is available or not.
     * @param companyId 
     */
    getLicenseData(companyId: string): Observable<any> {
      let jObject = {
        Username: JSON.stringify([{
          Username: localStorage.getItem(Constants.UserId),
          DataBase: companyId
        }])
      };

      if(this.config_params == null){
        this.loadConfig();
       }
      return this.httpclient.post(this.config_params.service_url + ApiUtils.url_GetLicenseData, jObject, this.httpOptions);
    }

    validateShiftTime(compId: string, emplId: string, workCenter: string, date: any): Observable<any> {
      var jObject = { 
        CompanyName: JSON.stringify([{ 
          Username: localStorage.getItem(Constants.UserId), 
          CompanyDBId: compId, 
          EmpId: emplId, 
          WorkCenter: workCenter,
          Date: date }]) 
        };
      return this.httpclient.post(this.config_params.service_url + ApiUtils.url_ValidateShiftTime, jObject, this.httpOptions);
    }

    menuRecord(): Observable<any> {
      var jObject = { 
        Permission: JSON.stringify([{ 
          UserCode: localStorage.getItem(Constants.UserId)
         }]) 
        };
      return this.httpclient.post(this.config_params.service_url + ApiUtils.url_GetMenuRecord, jObject, this.httpOptions);
    }

    userLoginLog(company: string, whs: string, workCenter: string, machine: string, date: string): Observable<any> {
      var jObject = { 
        LoginValues: JSON.stringify([{ 
          Username: localStorage.getItem(Constants.UserId),
          Company: company,
          Warehouse: whs,
          Workcenter: workCenter,
          Machine: machine,
          UserLogDateTime: date
         }]) 
        };
      return this.httpclient.post(this.config_params.service_url + ApiUtils.url_UserLoginLog, jObject, this.httpOptions);
    }

    createDirectory(loginDateTime: string){
      var jObject = { 
        UserDetailsForAttachment: JSON.stringify([{ 
          Username: localStorage.getItem(Constants.UserId),
          logInUserTime: loginDateTime
         }]) 
        };
      return this.httpclient.post(this.config_params.service_url + ApiUtils.url_CreateDirectory, jObject, this.httpOptions);
    }
  }

