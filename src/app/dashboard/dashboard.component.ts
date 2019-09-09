import { Component, OnInit } from '@angular/core';
import { products } from '../dummyData/taskList';
import { WindowState } from '@progress/kendo-angular-dialog';
import { NotificationService } from '@progress/kendo-angular-notification';
import { Router } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';
import { GetAllTask } from '../model/GetAllTask';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from 'src/constants/constants';
import { GetAllReasons } from '../model/GetAllReasons';
import { GetExistingTaskDetail } from '../model/GetExistingTaskDetail';
import { Geneology } from '../model/Geneology';
import { ResourcesService } from '../services/resources.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public windowOpened = true;
  public windowState: WindowState = 'default';
  showLoader: boolean = false;
  public allTaskList: GetAllTask[];
  public selectedTaskModel: GetAllTask;
  interruptReasonList: GetAllReasons[];
  public existingTaskDetails: GetExistingTaskDetail;
  public resourceList: any[];
  public geneology: Geneology;
  public itemManagedBy: any;
  public attachmentColumnNames: any;
  public isGeneologyEnable = true;
  public disableStartResumeFlag;
  public disableInterruptFlag;
  public disablekFinishedFlag;
  public disableAbortFlag;
  public disableSubmitFlag;
  public disableInterruptFields;

  constructor(private router: Router, private notificationService: NotificationService,
    private dashboardService: DashboardService, private translate: TranslateService,
    private resourcesService: ResourcesService) {
  }

  ngOnInit() {
    //this.taskListToggle();
    this.getAllTask();
  }

  public close() {
    this.windowOpened = false;
  }

  public taskListOpen() {
    this.windowOpened = true;
  }

  public taskListToggle() {
    if (this.windowOpened) {
      document.getElementById("task-list").classList.add("open");
    } else {
      document.getElementById("task-list").classList.remove("open");
    }
  }
  public windowStateChange() {
    this.taskListToggle()
    if (this.windowState === 'default') {
      console.log("window is maximized");
      document.getElementById("task-list").classList.add("maximized");
    }
    if (this.windowState === 'maximized') {
      console.log("window is defalut");
      document.getElementById("task-list").classList.remove("maximized");
    }
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

  private getAllTask() {
    this.showLoader = true;

    this.dashboardService.getAllTask().subscribe(
      data => {
        if (data != undefined && data.ErrorMsg == "7001") {

        } else {
          if (data != null && data != undefined) {
            this.allTaskList = data;
            this.selectedTaskModel = this.allTaskList[0];
            localStorage.setItem(Constants.TaskId, "" + this.selectedTaskModel.TaskId);
          } else {
            this.showLoader = false;
            this.show(this.translate.instant("CommonNoDataAvailableMsg"));
          }
        }
      },
      error => {
        this.showLoader = false;
        this.show(this.translate.instant("CommonNoDataAvailableMsg"));
      }
    );
  }

  public onTabSelected(value: any) {
    console.log("onTabChange: index=" + value.index);
  }

  public onRowSelection(value: any) {
    this.selectedTaskModel = value.selectedRows[0].dataItem;
    localStorage.setItem(Constants.TaskId, "" + this.selectedTaskModel.TaskId);

    console.log("onRowSelection: task: " + this.selectedTaskModel.OPTM_WC);
    this.close();
    this.getExistingTaskDetail();
    this.getAutoLot();
    this.getAttachmentColumnNames();
    this.getItemManagedBy();
    this.getConfigSettings();
    this.getResourceDetail();
  }

  // reloadComponent() {
  //   this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  //   this.router.onSameUrlNavigation = 'reload';
  //   this.router.navigate(['/dashboard']);
  // }

  private getAutoLot() {
    this.dashboardService.getAutoLot(this.selectedTaskModel.OPTM_FGCODE, this.selectedTaskModel.OPTM_WONO).subscribe(
      data => {
        console.log("getAutoLot data: " + data);
        if (data != undefined && data.ErrorMsg == "7001") {

        } else {
          if (data != null && data != undefined) {

          } else {
            this.showLoader = false;
            this.show(this.translate.instant("CommonNoDataAvailableMsg"));
          }
        }
      },
      error => {
        this.showLoader = false;
        this.show(this.translate.instant("CommonNoDataAvailableMsg"));
      }
    );
  }

  private getExistingTaskDetail() {
    //this.showLoader = true;
    this.dashboardService.getExistingTaskDetail("" + this.selectedTaskModel.TaskId).subscribe(
      data => {
        this.showLoader = false;
        this.disableStartResumeFlag = false;
        this.disableInterruptFlag = false;
        this.disableAbortFlag = false;
        this.disablekFinishedFlag = false;
        this.disableInterruptFields = true;
        if (data != undefined && data.ErrorMsg == "7001") {

        } else {
          if (data != null && data != undefined) {
            this.existingTaskDetails = data[0];
            if (this.existingTaskDetails != null
              && (this.existingTaskDetails.OPTM_STATUS == 'S'
                || this.existingTaskDetails.OPTM_STATUS == 'R')) {
              this.disableStartResumeFlag = true;
              this.disableSubmitFlag = true;
            } else if (this.existingTaskDetails != null && this.existingTaskDetails.OPTM_STATUS == 'I') {
              this.disableInterruptFlag = true;
              this.disableSubmitFlag = true;
              this.disableInterruptFields = false;
            } else if (this.existingTaskDetails != null && this.existingTaskDetails.OPTM_STATUS == 'F') {
              this.disableStartResumeFlag = true;
              this.disableInterruptFlag = true;
              this.disablekFinishedFlag = true;
              this.disableAbortFlag = true;
            } else  if (this.existingTaskDetails != null && this.existingTaskDetails.OPTM_STATUS == 'A') {
              this.disableStartResumeFlag = true;
              this.disableInterruptFlag = true;
              this.disablekFinishedFlag = true;
              this.disableAbortFlag = true;
              this.disableSubmitFlag = true;
            } else {
              // If get data empty...
              this.disableInterruptFlag = true;
              this.disablekFinishedFlag = true;
              this.disableAbortFlag = true;
              this.disableSubmitFlag = true;
            }
          } else {
            this.show(this.translate.instant("CommonNoDataAvailableMsg"));
          }
        }
      },
      error => {
        this.showLoader = false;
        this.show(this.translate.instant("CommonNoDataAvailableMsg"));
      }
    );
  }

  private getItemManagedBy() {
    this.dashboardService.getItemManagedBy(this.selectedTaskModel.OPTM_FGCODE).subscribe(
      data => {
        if (data != undefined && data.ErrorMsg == "7001") {

        } else {
          if (data != null && data != undefined) {
            this.itemManagedBy = data;
            console.log("itemManagedBy: " + this.itemManagedBy);
            if ('Serial' == this.itemManagedBy) {
              localStorage.setItem(Constants.ItemManagedBy, "S");
            } else if ('Batch' == this.itemManagedBy) {
              localStorage.setItem(Constants.ItemManagedBy, "B");
            }

          } else {
            this.showLoader = false;
            this.show(this.translate.instant("CommonNoDataAvailableMsg"));
          }
        }
      },
      error => {
        this.showLoader = false;
        this.show(this.translate.instant("CommonNoDataAvailableMsg"));
      }
    );
  }

  private getAttachmentColumnNames() {
    this.dashboardService.getAttachmentColumnNames(this.selectedTaskModel.OPTM_WONO,
      "" + this.selectedTaskModel.OPTM_FROMOPERNO).subscribe(
        data => {
          if (data != undefined && data.ErrorMsg == "7001") {

          } else {
            if (data != null && data != undefined) {
              this.attachmentColumnNames = data;
            } else {
              this.showLoader = false;
              this.show(this.translate.instant("CommonNoDataAvailableMsg"));
            }
          }
        },
        error => {
          this.showLoader = false;
          this.show(this.translate.instant("CommonNoDataAvailableMsg"));
        }
      );
  }

  private getConfigSettings() {
    this.dashboardService.getConfigSettings().subscribe(
      data => {
        if (data != undefined && data.ErrorMsg == "7001") {

        } else {
          if (data != null && data != undefined) {
            console.log("data: " + data);
            //data.Table
            if (data.Geneology.length > 0) {
              this.geneology = data.Geneology[0];
              if (this.geneology.U_OPTM_GENEALOGYAPPL == 'Y') {
                this.isGeneologyEnable = true;
                if (this.existingTaskDetails == undefined) {
                  this.isGeneologyEnable = false;
                }
              } else {
                this.isGeneologyEnable = false;
              }
            }
          } else {
            this.showLoader = false;
            this.show(this.translate.instant("CommonNoDataAvailableMsg"));
          }
        }
      },
      error => {
        this.showLoader = false;
        this.show(this.translate.instant("CommonNoDataAvailableMsg"));
      }
    );
  }

  private getResourceDetail(){
    this.resourcesService.getResourceDetail(""+this.selectedTaskModel.TaskId, ""+this.existingTaskDetails.Code).subscribe(
      data => {
        if (data != undefined && data.ErrorMsg == "7001") {
          
        } else {
          if (data != null && data != undefined) {
            this.resourceList = data;
          } else {
            this.showLoader = false;
            this.show(this.translate.instant("CommonNoDataAvailableMsg"));
          }
        }
      },
      error => {
        this.showLoader = false;
        this.show(this.translate.instant("CommonNoDataAvailableMsg"));
      }
    );
  }

  private saveResourceDetail(){
    this.resourcesService.saveResourceDetail("").subscribe(
      data => {
        if (data != undefined && data.ErrorMsg == "7001") {
          
        } else {
          if (data != null && data != undefined) {
            //this.resourceList = data;
          } else {
            this.showLoader = false;
            this.show(this.translate.instant("CommonNoDataAvailableMsg"));
          }
        }
      },
      error => {
        this.showLoader = false;
        this.show(this.translate.instant("CommonNoDataAvailableMsg"));
      }
    );
  }
}
