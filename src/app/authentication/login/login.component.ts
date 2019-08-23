import { Component, OnInit } from '@angular/core';
import { NotificationService } from '@progress/kendo-angular-notification';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Constants } from 'src/constants/constants';
import { ValidateUserLogin } from 'src/app/model/ValidateUserLogin';
import { LicenseData } from 'src/app/model/LicenseData';
import { WHS } from 'src/app/model/warehouse';
import { Workcenter } from 'src/app/model/workcenter';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { Commonservice } from '../../services/common.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { GetMachine } from 'src/app/model/machine';
import { GetCompaniesAndLanguages } from 'src/app/model/company';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isConnected: boolean = false;
  readOnlyFlag: boolean = false;
  username: string;
  password: string;
  isRememberMe: boolean = false;
  isRequireMachine: boolean = false;
  showLoader: boolean = false;
  config_params: any;
  userDetails: ValidateUserLogin[];
  licenseData: LicenseData[];
  warehouseList: WHS[];
  companyList: GetCompaniesAndLanguages[];
  workCenterList: Workcenter[];
  machineList: GetMachine[];
  selectedCompanyModel: GetCompaniesAndLanguages;
  selectedWhseModel: WHS;
  selectedWorkCenterModel: Workcenter;
  selectedMachineModel: GetMachine;

  selectedCompany: string;
  selectedEmpId: string;
  selectedWhse: string;
  selectedWorkCenter: string;
  selectedMachine: string;
  requireMachine: any;
  rememberMe: any;
  loggedInUserType: string;

  constructor(private router: Router, private notificationService: NotificationService,
    private loginService: LoginService, private commonService: Commonservice, private translate: TranslateService, private httpClient: HttpClient) {
    let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.setDefaultValueOnFields();
    });
    this.commonService.loadConfig();
    this.loggedInUserType = "user";
  }

  ngOnInit() {
    this.setDefaultValueOnFields();

    //Get cookie start
    if (this.getCookie('isRememberMe') == 'true') {
      this.username = this.getCookie(Constants.username);
      this.password = this.getCookie(Constants.password);
      this.selectedCompany = this.getCookie(Constants.CompID);
      this.selectedWhse = this.getCookie(Constants.whseId);
      this.selectedWorkCenter = this.getCookie(Constants.workCenter);
      this.selectedMachine = this.getCookie(Constants.machine);
      this.selectedEmpId = this.getCookie(Constants.EmpID);
      this.isRememberMe = true;
      this.isConnected = true;
      this.selectedCompanyModel = { OPTM_COMPID: this.selectedCompany, OPTM_EMPID: "0", cmpName: "" };
      this.selectedWhseModel = { OPTM_WHSE: this.selectedWhse, BPLid: 0 };
      this.selectedWorkCenterModel = { OPTM_WORKCENTER: this.selectedWorkCenter };
      this.selectedMachineModel = { U_O_EQUP_ID: this.selectedMachine };
      if(this.getCookie('isRequireMachine') == 'true'){
        this.isRequireMachine = true;
      }
    } else {
      this.username = '';
      this.password = '';
      this.selectedCompany = '';
      this.selectedWhse = '';
      this.selectedWorkCenter = '';
      this.selectedMachine = '';
      this.selectedEmpId = '';
      this.isRememberMe = false;
      this.isRequireMachine = false;
      this.isConnected = false;
    }

    this.httpClient.get('./assets/config.json').subscribe(
      data => {
        sessionStorage.setItem('ConfigData', JSON.stringify(data));
        this.config_params = JSON.parse(sessionStorage.getItem('ConfigData'));
        localStorage.setItem(Constants.ServiceURL, this.config_params.service_url);
        this.loginService.getPSURL(this.config_params.service_url).subscribe(
          data => {
            console.log("getPSURL data:" + data);
            if (data != null) {
              console.log('success data ps url:' + data);
              localStorage.setItem(Constants.PSURLFORADMIN, data);
            }
          },
          error => {
            this.show('There is some error to connect with server' + error);
            this.showLoader = false;
          }
        )
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    );
  }

  public show(message: string): void {
    this.notificationService.show({
      content: message,
      hideAfter: 1500,
      cssClass: 'button-notification',
      animation: { type: 'slide', duration: 400 },
      position: { horizontal: 'right', vertical: 'top' },
      // type: { style: 'success', icon: true },
      type: { style: 'success', icon: false },
      closable: false
    });
  }

  /**
   * Function for connect
   */
  public async connect() {
    if (this.username == "" || this.password == "") {
      this.show(this.translate.instant("UnPwdBlankErrorMsg"));
      return true;
    }

    this.showLoader = true;
    if (!this.isConnected) {
      this.validateLogin();
    } else {
      this.selectedCompany = document.getElementById("companyId").innerText.trim();
      if (this.validateFields()) {
        this.showLoader = false;
        return;
      }
      this.getLicenseData();
    }
  }

  private validateLogin() {
    this.loginService.validateUserLogin(this.username, this.password).subscribe(
      data => {
        this.userDetails = data.Table;
        this.handleValidateLoginResponse();
      },
      error => {
        this.show(this.translate.instant("InvalidUnPwdErrMsg"));
        this.showLoader = false;
      }
    );
  }

  /**
   * Function that is validate fields before login into application.
   */
  private validateFields(): boolean {
    if ((document.getElementById("companyId").innerText.trim() == this.translate.instant("SelectCompany")
      || document.getElementById("companyId").innerText.trim() == '')
      && (document.getElementById("whseId").innerText.trim() == this.translate.instant("SelectWarehouse") ||
        document.getElementById("whseId").innerText.trim() == '')) {
      this.showLoader = false;
      this.show(this.translate.instant("SelectRequiredFields"));
      return true;
    } else if (document.getElementById("companyId").innerText.trim() == this.translate.instant("SelectCompany")
      || document.getElementById("companyId").innerText.trim() == '') {
      this.showLoader = false;
      this.show(this.translate.instant("SelectCompanyMsg"));
      return true;
    } else if (document.getElementById("whseId").innerText.trim() == this.translate.instant("SelectWarehouse") ||
      document.getElementById("whseId").innerText.trim() == '') {
      this.showLoader = false;
      this.show(this.translate.instant("SelectwarehouseMsg"));
      return true;
    } else if (document.getElementById("workCenterId").innerText.trim() == this.translate.instant("SelectWorkCenter") ||
      document.getElementById("workCenterId").innerText.trim() == '') {
      this.showLoader = false;
      this.show(this.translate.instant("SelectWorkcenterMsg"));
      return true;
    } else if (this.isRequireMachine) {
      if (document.getElementById("machineId").innerText.trim() == this.translate.instant("SelectRequireMachine") ||
        document.getElementById("machineId").innerText.trim() == '') {
        this.showLoader = false;
        this.show(this.translate.instant("SelectMachineMsg"));
        return true;
      }
    }
    return false;
  }

  /**
   * Function used for check login user
   */
  private getLicenseData() {
    this.showLoader = true;
    this.loginService.getLicenseData(this.selectedCompany).subscribe(
      data => {
        this.licenseData = data.LICData;
        if (this.licenseData != null && this.licenseData != undefined) {
          this.handleLicenseDataResponse();
        } else {
          this.showLoader = false;
          this.show(this.translate.instant("license Failed"));
        }
      },
      error => {
        this.showLoader = false;
        this.show(this.translate.instant("license Failed"));
      }
    );
  }

  private handleLicenseDataResponse() {
    console.log("in handle license data success response");
    this.selectedWhse = document.getElementById("whseId").innerText.trim();
    this.showLoader = false;
    if (this.licenseData.length > 0) {
      //Check if the Length of licenseData is greater than 0 or not
      // if(true){
      if (this.licenseData[0].ErrMessage === "" || this.licenseData[0].ErrMessage === null) {
        localStorage.setItem(Constants.GUID, this.licenseData[0].GUID);
        localStorage.setItem(Constants.username, this.username);
        localStorage.setItem(Constants.CompID, this.selectedCompany);
        localStorage.setItem(Constants.EmpID, this.selectedCompanyModel.OPTM_EMPID);
        localStorage.setItem(Constants.whseId, this.selectedWhse);
        localStorage.setItem(Constants.workCenter, this.selectedWorkCenter);
        localStorage.setItem(Constants.machine, this.selectedMachine);
        localStorage.setItem("LogonOnFirstTime", "1");
        localStorage.setItem("LogInUserTime", "1");
        // code for remember me 
        if (this.isRememberMe == true) {
          this.setCookie(Constants.username, this.username, 365);
          this.setCookie(Constants.password, this.password, 365);
          this.setCookie(Constants.CompID, this.selectedCompany, 365);
          this.setCookie(Constants.EmpID, this.selectedCompanyModel.OPTM_EMPID, 365);
          this.setCookie(Constants.whseId, this.selectedWhse, 365);
          this.setCookie(Constants.workCenter, this.selectedWorkCenter, 365);
          this.setCookie(Constants.machine, this.selectedMachine, 365);
          this.setCookie('isRequireMachine', "true", 365);
          this.setCookie('isRememberMe', "true", 365);
        } else {
          this.setCookie(Constants.username, "", 365);
          this.setCookie(Constants.password, "", 365);
          this.setCookie(Constants.CompID, "", 365);
          this.setCookie(Constants.EmpID, "", 365);
          this.setCookie(Constants.whseId, "", 365);
          this.setCookie(Constants.workCenter, "", 365);
          this.setCookie(Constants.machine, "", 365);
          this.setCookie('isRequireMachine', "false", 365);
          this.setCookie('isRememberMe', "false", 365);
        }

        //to get the Login Date and Time
        var loggedInUserTime = new Date();
        var loginmonth = loggedInUserTime.getMonth() + 1;
        var dateStr = "" + loggedInUserTime.getDate() + "-" + loginmonth + "-" + loggedInUserTime.getFullYear() + "_" + loggedInUserTime.getHours() + "_" + loggedInUserTime.getMinutes() + "_" + loggedInUserTime.getSeconds() + "_" + loggedInUserTime.getMilliseconds();
        this.getUserLoginLog(dateStr);

        if (this.loggedInUserType == "manager") {
          // Do code for manager
        } else {
          // Do code for normal user
          var loggedInUserTime = new Date();
          var loginmonth = loggedInUserTime.getMonth() + 1;
          var dateStr = "" + loggedInUserTime.getDate() + "-" + loginmonth + "-" + loggedInUserTime.getFullYear() + "_" + loggedInUserTime.getHours() + "_" + loggedInUserTime.getMinutes() + "_" + loggedInUserTime.getSeconds() + "_" + loggedInUserTime.getMilliseconds();
          sessionStorage.setItem(Constants.loginDateTime, dateStr);
          this.createDirectory(dateStr);
        }
        this.router.navigateByUrl('/dashboard');
      } else {
        this.show(this.licenseData[0].ErrMessage);
        return false;
      }
    } else {
      this.show(this.licenseData[0].ErrMessage);
    }
  }

  private handleValidateLoginResponse() {
    this.setDefaultValueOnFields();

    this.showLoader = false;
    if (this.userDetails == null || this.userDetails.length < 1) {
      this.show(this.translate.instant("InvalidUn"));
      return true;
    }
    if (this.userDetails[0].OPTM_ACTIVE == 0) {
      this.show(this.translate.instant("UsernotActive"));
      return true;
    }
    localStorage.setItem(Constants.UserId, this.username);
    this.isConnected = true;
    this.readOnlyFlag = true;
    this.getCompanyAndLanguageList();
  }

  /**
   * Function for fetch company data from server after validate user.
   */
  public getCompanyAndLanguageList() {
    this.loginService.getCompAndLang().subscribe(
      data => {
        this.companyList = data.Table;
        if (this.isRememberMe) {
          for (var i = 0; i < this.companyList.length; i++) {
            if (this.getCookie(Constants.CompID) == this.companyList[i].OPTM_COMPID) {
              this.selectedCompanyModel = this.companyList[i];
              this.selectedCompany = this.selectedCompanyModel.OPTM_COMPID;
              break;
            }
          }
        }
      },
      error => {
      }
    );
  }

  /**
   * Function for fetch warehouse data from server on the basis of company.
   */
  public getWarehouseList() {
    //  if (document.getElementById("companyId") != null) {
    //    this.selectedCompany = document.getElementById("companyId").innerText.trim();
    //  }

    this.loginService.getWHS(this.selectedCompany).subscribe(
      data => {
        this.warehouseList = data.Table;
        if (this.isRememberMe) {
          for (var i = 0; i < this.warehouseList.length; i++) {
            if (this.getCookie(Constants.whseId) == this.warehouseList[i].OPTM_WHSE) {
              this.selectedWhseModel = this.warehouseList[i];
              this.selectedWhse = this.selectedWhseModel.OPTM_WHSE;
              break;
            }
          }
        }
      },
      error => {
      }
    );
  }

  /**
   * Function for fetch work center data from server on the basis 
   * of company and warehouse.
   */
  public getWorkCenterList() {
    // if (document.getElementById("companyId") != null && document.getElementById("whseId") != null) {
    //   this.selectedCompany = document.getElementById("companyId").innerText.trim();
    //   this.selectedWhse = document.getElementById("whseId").innerText.trim();
    // }

    this.loginService.getWorkcenter(this.selectedCompany, this.selectedWhse).subscribe(
      data => {
        this.workCenterList = data.Table;
        if (this.isRememberMe) {
          for (var i = 0; i < this.workCenterList.length; i++) {
            if (this.getCookie(Constants.workCenter) == this.workCenterList[i].OPTM_WORKCENTER) {
              this.selectedWorkCenterModel = this.workCenterList[i];
              this.selectedWorkCenter = this.selectedWorkCenterModel.OPTM_WORKCENTER;
              break;
            }
          }
        }
      },
      error => {
      }
    );
  }

  /**
   * Function for fetch machine data from server on the basis of 
   * company, warehouse and work center.
   */
  public getMachineList() {
    // if (document.getElementById("companyId") != null && document.getElementById("whseId") != null) {
    //   this.selectedCompany = document.getElementById("companyId").innerText.trim();
    //   //this.selectedWhseValue = document.getElementById("whseId").innerText.trim();
    //   this.selectedWorkCenter = document.getElementById("workCenterId").innerText.trim();
    // }

    this.loginService.getMachine(this.selectedCompany, this.selectedCompanyModel.OPTM_EMPID, this.selectedWorkCenter).subscribe(
      data => {
        this.machineList = data.Table;
        if (this.isRememberMe) {
          for (var i = 0; i < this.machineList.length; i++) {
            if (this.getCookie(Constants.machine) == this.machineList[i].U_O_EQUP_ID) {
              this.selectedMachineModel = this.machineList[i];
              this.selectedMachine = this.selectedMachineModel.U_O_EQUP_ID;
              break;
            }
          }
        }
      },
      error => {
      }
    );
  }

  /**
   * Function called when user do check/uncheck.
   * @param event
   * @param type 
   */
  onCheckChange(event: any, type: string) {
    if ('remember' == type) {
      //this.isRememberMe = !this.isRememberMe;
    } else if ('machine' == type) {
      //this.isRequireMachine = !this.isRequireMachine;
      if (this.isRequireMachine) {
        this.getMachineList();
      } else {
        this.selectedMachineModel = { U_O_EQUP_ID: this.translate.instant("SelectRequireMachine") };
        this.selectedMachine = this.selectedMachineModel.U_O_EQUP_ID;
      }
    }
  }

  /**
   * Function called on login button clicked.
   */
  login() {
    if (this.validateFields()) {
      this.showLoader = false;
      return;
    }
    this.getLicenseData();
  }

  /**
   * 
   */
  getValidateShiftTime() {
    this.loginService.validateShiftTime(this.selectedCompany,
      this.selectedCompanyModel.OPTM_EMPID, this.selectedWorkCenter, "").subscribe(
        data => {

          console.log("getValidateShiftTime data: " + data);
        },
        error => {
          console.log("getValidateShiftTime error: " + error);
        }
      );
  }

  /**
   * 
   */
  getMenuRecord() {
    this.loginService.menuRecord().subscribe(
      data => {

        console.log("getMenuRecord data: " + data);
      },
      error => {
        console.log("getMenuRecord error: " + error);
      }
    );
  }

  /**
   * 
   */
  getUserLoginLog(loginDateTime) {
    var machine = "";
    if (this.isRequireMachine) {
      machine = this.selectedMachine;
    }
    this.loginService.userLoginLog(this.selectedCompany, this.selectedWhse, this.selectedWorkCenter, machine, loginDateTime).subscribe(
      data => {

        console.log("getUserLoginLog data: " + data);
      },
      error => {
        console.log("getUserLoginLog error: " + error);
      }
    );
  }

  /**
   * Function for get cookie data
   * @param cname 
   */
  public getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  /**
   * Function for set cookie data.
   * @param cname 
   * @param cvalue 
   * @param exdays 
   */
  public setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  /**
   * Function used for reset form fields.
   * @param form 
   */
  reset(form: any) {
    this.isConnected = false;
    form.resetForm();
    this.readOnlyFlag = false;
    this.setCookie(Constants.username, "", 365);
    this.setCookie(Constants.password, "", 365);
    this.setCookie(Constants.CompID, "", 365);
    this.setCookie(Constants.whseId, "", 365);
    this.setCookie('isRememberMe', "false", 365);
    this.setCookie('isRequireMachine', "false", 365);
    this.companyList = [];
    this.warehouseList = [];
    this.workCenterList = [];
    this.machineList = [];
    this.selectedCompanyModel = null;
    this.selectedWhseModel = null;
    this.selectedWorkCenterModel = null;
    this.selectedMachineModel = null;

    this.selectedCompany = "";
    this.selectedWhse = "";
    this.selectedWorkCenter = "";
    this.selectedMachine = "";
    this.requireMachine = "";
    this.rememberMe = "";
  }

  /**
   * Function used for reset kendo dropdown fields.
   */
  setDefaultValueOnFields() {
    this.selectedCompanyModel = { OPTM_COMPID: this.translate.instant("SelectCompany"), OPTM_EMPID: "0", cmpName: "" };
    this.selectedCompany = this.selectedCompanyModel.OPTM_COMPID;

    this.selectedWhseModel = { OPTM_WHSE: this.translate.instant("SelectWarehouse"), BPLid: 0 };
    this.selectedWhse = this.selectedWhseModel.OPTM_WHSE;

    this.selectedWorkCenterModel = { OPTM_WORKCENTER: this.translate.instant("SelectWorkCenter") };
    this.selectedWorkCenter = this.selectedWorkCenterModel.OPTM_WORKCENTER;

    this.selectedMachineModel = { U_O_EQUP_ID: this.translate.instant("SelectRequireMachine") };
    this.selectedMachine = this.selectedMachineModel.U_O_EQUP_ID;
  }

  /**
   * Function called when user select any item from kendo dropdown list.
   * 
   * @param value 
   * @param fieldType 
   */
  public selectionChange(value: any, fieldType: string): void {
    console.log('selectionChange', value);
    if ("company" == fieldType) { // executed on company selection.
      this.selectedCompanyModel = value;
      this.selectedCompany = this.selectedCompanyModel.OPTM_COMPID;
      this.getWarehouseList();
    } else if ("warehouse" == fieldType) { // executed on warehouse selection.
      this.selectedWhseModel = value;
      this.selectedWhse = this.selectedWhseModel.OPTM_WHSE;
      this.getWorkCenterList();
    } else if ("workcenter" == fieldType) { // executed on workcenter selection.
      this.selectedWorkCenterModel = value;
      this.selectedWorkCenter = this.selectedWorkCenterModel.OPTM_WORKCENTER;
      this.getMachineList();
    } else if ("machine" == fieldType) { // executed on workcenter selection.
      this.selectedMachineModel = value;
      this.selectedMachine = this.selectedMachineModel.U_O_EQUP_ID;
    }
  }

  createDirectory(loginDateTime: string) {
    this.loginService.createDirectory(loginDateTime).subscribe(
      data => {
        console.log("create directory data: " + data);
      },
      error => {
      }
    );
  }
}
