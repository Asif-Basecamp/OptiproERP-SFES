import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from 'src/constants/constants';

@Injectable({
  providedIn: 'root'
})

export class LoginService {
    private url_ValidateUserLogin: string = "/api/login/ValidateUserLogin";
    private url_getWorkcenter: string = "/api/login/getWorkcenter";
    private url_getConfigSetting: string = "/api/AdvanceSFDC/getConfigSetting";
    private url_GetLicenseData: string = "/api/Login/GetLicenseData";
    private url_GetCompaniesAndLanguages: string = "/api/Login/GetCompaniesAndLanguages";
    private url_GetPSURL: string = "/api/SFDCLogin/GetPSURL";
    private url_GetWHS: string = "/api/Login/GetWHS";
    private url_GetMachine: string = "/api/SFDCLogin/GetMachine";
    private url_ValidateShiftTime: string = "/api/SFDCLogin/ValidateShiftTime";
    private url_GetMenuRecord: string = "/api/SFDCLogin/GetMenuRecord";
    private url_UserLoginLog: string = "/api/SFDCLogin/UserLoginLog";
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
      return this.httpclient.post(url+this.url_GetPSURL, jObject, this.httpOptions);
    } 
  
    getCompAndLang(): Observable<any> {
      let jObject = {
          Username: JSON.stringify([{
          Username: localStorage.getItem(Constants.UserId),
          Product: "SFES"
        }])
      };
      return this.httpclient.post(localStorage.getItem(Constants.PSURLFORADMIN) + this.url_GetCompaniesAndLanguages, jObject,
        this.httpOptions);
    }

    getWHS(compId: string): Observable<any> {
      let jObject = {
          CompanyName: JSON.stringify([{
          Username: localStorage.getItem(Constants.UserId),
          CompanyDBId: compId
        }])
      };
      return this.httpclient.post(localStorage.getItem(Constants.PSURLFORADMIN) + this.url_GetWHS, jObject,
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
      return this.httpclient.post(localStorage.getItem(Constants.PSURLFORADMIN) + this.url_getWorkcenter, jObject,
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
      return this.httpclient.post(this.config_params.service_url + this.url_GetMachine, jObject,
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
      return this.httpclient.post(localStorage.getItem(Constants.PSURLFORADMIN) + this.url_ValidateUserLogin, jObject,
        this.httpOptions);
    }
  
    /**
     * Function used for check license is available or not.
     * @param companyId 
     */
    getLicenseData(companyId: string): Observable<any> {
      let jObject = {
        LoginId: localStorage.getItem(Constants.UserId),
        CompanyId: companyId
      };
      if(this.config_params == null){
        this.loadConfig();
       }
      return this.httpclient.post(this.config_params.service_url + this.url_GetLicenseData, jObject, this.httpOptions);
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
      return this.httpclient.post(this.config_params.service_url + this.url_ValidateShiftTime, jObject, this.httpOptions);
    }

    menuRecord(): Observable<any> {
      var jObject = { 
        Permission: JSON.stringify([{ 
          UserCode: localStorage.getItem(Constants.UserId)
         }]) 
        };
      return this.httpclient.post(this.config_params.service_url + this.url_GetMenuRecord, jObject, this.httpOptions);
    }

    userLoginLog(): Observable<any> {
      var jObject = { 
        Permission: JSON.stringify([{ 
          UserCode: localStorage.getItem(Constants.UserId)
         }]) 
        };
      return this.httpclient.post(this.config_params.service_url + this.url_GetMenuRecord, jObject, this.httpOptions);
    }
  }

