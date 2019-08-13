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
  selectedWhse: string;
  selectedWorkCenter: string;
  selectedMachine: string;
  requireMachine: any;
  rememberMe: any;
  
  constructor(private router: Router, private notificationService: NotificationService, 
    private loginService: LoginService, private commonService: Commonservice, private translate: TranslateService, private httpClient: HttpClient) { 
      let userLang = navigator.language.split('-')[0];
    userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
    translate.use(userLang);
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.selectedCompany = translate.instant("SelectCompany");
      //this.defaultWHS = { OPTM_WHSE: translate.instant("SelectWarehouse"), BPLid: 0 };
    });
    this.commonService.loadConfig();
  }

  ngOnInit() {
    this.selectedCompany = this.translate.instant("SelectCompany");
    //this.selectedWorkCenter = "";//{ OPTM_WHSE: this.translate.instant("SelectWarehouse"), BPLid: 0 }
    //this.defaultWHS = { OPTM_WHSE: this.translate.instant("SelectWarehouse"), BPLid: 0 }

    // Get cookie start
    // if (this.getCookie('cookieEmail') != '' && this.getCookie('cookiePassword') != '') {
    //   this.username = this.getCookie('cookieEmail');
    //   this.password = this.getCookie('cookiePassword');
    //   this.isRememberMe = true;
    // } else {
    this.username = '';
    this.password = '';
    this.isRememberMe = false;
    // }

    // Apply classes on Body
    // const element = document.getElementsByTagName("body")[0];
    // element.className = "";
    // element.classList.add("login");
    // element.classList.add("opti_account-module");
    // console.log("init", "init");

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
      cssClass: 'button-notification',
      animation: { type: 'slide', duration: 400 },
      position: { horizontal: 'right', vertical: 'top' },
      type: { style: 'success', icon: true },
      closable: true
    });
  }

  // public listItems: Array<string> = [
  //   'Baseball', 'Basketball', 'Cricket', 'Field Hockey',
  //   'Football', 'Table Tennis', 'Tennis', 'Volleyball'
  // ];


  /**
   * Function for login
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

  private validateFields(): boolean {
    if (this.selectedCompany == this.translate.instant("SelectCompany") || this.selectedCompany == '') {
      this.showLoader = false;
      this.show(this.translate.instant("SelectCompanyMsg"));
      return true;
    }
    if (document.getElementById("whseId").innerText.trim() == this.translate.instant("SelectWarehouse") ||
      document.getElementById("whseId").innerText.trim() == "") {
      this.showLoader = false;
      this.show(this.translate.instant("SelectCompanyMsg"));
      return true;
    }
    return false;
  }

  private getLicenseData() {
    this.showLoader = true;
    this.loginService.getLicenseData(this.selectedCompany).subscribe(
      data => {
        this.licenseData = data;
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
    if (this.licenseData.length > 1) {
      if (this.licenseData[1].ErrMessage == "" || this.licenseData[1].ErrMessage == null) {
        if (this.licenseData[0].Message == "True") {
          this.selectedCompany = document.getElementById("companyId").innerText.trim();
          localStorage.setItem(Constants.GUID, this.licenseData[1].GUID);
          localStorage.setItem(Constants.CompID, this.selectedCompany);
          localStorage.setItem(Constants.whseId, this.selectedWhse);
          localStorage.setItem(Constants.Token, this.licenseData[0].Token);
          if (this.licenseData[0].DefaultValues.length == 8) {
            localStorage.setItem("DefaultValues", JSON.stringify(this.licenseData[0].DefaultValues));
            localStorage.setItem("DecimalPrecision", this.licenseData[0].DefaultValues[3].DefaultValue);
            localStorage.setItem("DecimalSeparator", this.licenseData[0].DefaultValues[4].DefaultValue);
            localStorage.setItem("ThousandSeparator", this.licenseData[0].DefaultValues[5].DefaultValue);
            localStorage.setItem("DATEFORMAT", this.licenseData[0].DefaultValues[6].DefaultValue);
          } else {
            localStorage.setItem("DefaultValues", JSON.stringify(this.licenseData[0].DefaultValues));
            localStorage.setItem("DecimalPrecision", this.licenseData[0].DefaultValues[0].DefaultValue);
            localStorage.setItem("DecimalSeparator", this.licenseData[0].DefaultValues[1].DefaultValue);
            localStorage.setItem("ThousandSeparator", this.licenseData[0].DefaultValues[2].DefaultValue);
            localStorage.setItem("DATEFORMAT", this.licenseData[0].DefaultValues[3].DefaultValue);
          }

          // code for remember me 
          if (this.isRememberMe == true) {
            this.setCookie('cookieEmail', this.username, 365);
            this.setCookie('cookiePassword', this.password, 365);
            this.setCookie(Constants.CompID, this.selectedCompany, 365);
            this.setCookie('whseId', this.selectedWhse, 365);
            this.setCookie('WorkCenter', this.selectedWorkCenter, 365);
            this.setCookie('machineId', this.selectedMachine, 365);
          } else {
            this.setCookie('cookieEmail', "", 365);
            this.setCookie('cookiePassword', "", 365);
            this.setCookie(Constants.CompID, "", 365);
            this.setCookie('whseId', "", 365);
            this.setCookie('WorkCenter', "", 365);
            this.setCookie('machineId', "", 365);
          }
          this.router.navigateByUrl('home/dashboard');
        } else {
          alert(this.licenseData[0].Message + " " + this.licenseData[0].Token);
        }
      } else {
        alert(this.licenseData[1].ErrMessage);
      }
    } else {
      alert(this.licenseData[0].ErrMessage);
    }
  }

  private handleValidateLoginResponse() {
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

  public getCompanyAndLanguageList() {
    this.loginService.getCompAndLang().subscribe(
      data => {
        this.companyList = data.Table;
        // compData.forEach(element => {
        //   this.companyList.push(element.OPTM_COMPID);
        // });

        if (this.isRememberMe) {
          for (var i = 0; i < this.companyList.length; i++) {
            if (this.getCookie(Constants.CompID) == this.companyList[i].OPTM_COMPID) {
              this.selectedCompanyModel = this.companyList[i];
              this.selectedCompany = this.selectedCompanyModel.OPTM_COMPID;
              break;
            }
          }
        } else if (this.companyList.length > 0) {
          this.selectedCompanyModel = this.companyList[0];
          this.selectedCompany = this.selectedCompanyModel.OPTM_COMPID;
        }
        console.log("Selected company: " + this.selectedCompany);
        this.getWarehouseList();
      },
      error => {
      }
    );
  }

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
        } else if (this.warehouseList.length > 0) {
          this.selectedWhseModel = this.warehouseList[0];
          this.selectedWhse = this.selectedWhseModel.OPTM_WHSE;
        }
        console.log("Selected warehouse: " + this.selectedWhse);
        this.getWorkCenterList();
      },
      error => {
      }
    );
  }

  public getWorkCenterList() {
    if (document.getElementById("companyId") != null && document.getElementById("whseId") != null) {
      this.selectedCompany = document.getElementById("companyId").innerText.trim();
      this.selectedWhse = document.getElementById("whseId").innerText.trim();
    }

    this.loginService.getWorkcenter(this.selectedCompany, this.selectedWhse).subscribe(
      data => {
        this.workCenterList = data.Table;
        if (this.isRememberMe) {
          for (var i = 0; i < this.workCenterList.length; i++) {
            if (this.getCookie(Constants.workcenter) == this.workCenterList[i].OPTM_WORKCENTER) {
              this.selectedWorkCenterModel = this.workCenterList[i];
              this.selectedWorkCenter = this.selectedWorkCenterModel.OPTM_WORKCENTER;
              break;
            }
          }
        } else if (this.workCenterList.length > 0) {
          this.selectedWorkCenterModel = this.workCenterList[0];
          this.selectedWorkCenter = this.selectedWorkCenterModel.OPTM_WORKCENTER;
        }


        console.log("Selected workcenter: " + this.selectedWorkCenter);
      },
      error => {
      }
    );
  }

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
        } else if (this.machineList.length > 0) {
          this.selectedMachineModel = this.machineList[0];
          this.selectedMachine = this.selectedMachineModel.U_O_EQUP_ID;
        }
        console.log("Selected machine: " + this.selectedMachine);
      },
      error => {
      }
    );
  }

  onCheckChange(event: any, type: string) {
    if ('remember' == type) {
      this.isRememberMe = !this.isRememberMe;
    } else if ('machine' == type) {
      this.isRequireMachine = !this.isRequireMachine;
      if (this.isRequireMachine) {
        this.getMachineList();
      }
    }
  }

  /**
   * Function called on login button clicked.
   */
  login() {
    this.getLicenseData();
  }

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

  getUserLoginLog() {
    this.loginService.userLoginLog().subscribe(
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
   * Function for set cookie data
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
}
