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
  

  constructor(private router: Router, private notificationService: NotificationService,
    private dashboardService: DashboardService, private translate: TranslateService) { 
      
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

  public taskListToggle(){
    if(this.windowOpened){
      document.getElementById("task-list").classList.add("open");
    }else{
      document.getElementById("task-list").classList.remove("open");
    }
  }
  public windowStateChange(){
    this.taskListToggle()
    if(this.windowState === 'default'){
      console.log("window is maximized");
      document.getElementById("task-list").classList.add("maximized");
    }
    if(this.windowState === 'maximized'){
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

  private getAllTask(){
    this.showLoader = true;

    this.dashboardService.getAllTask().subscribe(
      data => {
        if (data != undefined && data.ErrorMsg == "7001") {
          
        } else {
          if (data != null && data != undefined) {
            this.allTaskList = data;
            this.selectedTaskModel = this.allTaskList[0];
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

  public onRowSelection(value: any){
    this.selectedTaskModel = value.selectedRows[0].dataItem;
    console.log("onRowSelection: task: "+this.selectedTaskModel.OPTM_WC);
    this.close();
    this.getAllReasons();
  }

  private getAutoLot(){
    this.dashboardService.getAutoLot(this.selectedTaskModel.OPTM_FGCODE, this.selectedTaskModel.OPTM_WONO).subscribe(
      data => {
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

  private getExistingTaskDetail(){
    this.dashboardService.getExistingTaskDetail(""+this.selectedTaskModel.TaskId).subscribe(
      data => {
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

  private getAllReasons(){
    this.dashboardService.getAllReasons().subscribe(
      data => {
        if (data != undefined && data.ErrorMsg == "7001") {
          
        } else {
          if (data != null && data != undefined) {
            this.interruptReasonList = data;
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
    this.dashboardService.getResourceDetail(""+this.selectedTaskModel.TaskId, ""+this.selectedTaskModel.TaskId).subscribe(
      data => {
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

  private getItemManagedBy(){
    this.dashboardService.getItemManagedBy(this.selectedTaskModel.OPTM_FGCODE).subscribe(
      data => {
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

  private getAttachmentColumnNames(){
    this.dashboardService.getAttachmentColumnNames(this.selectedTaskModel.OPTM_WONO, 
      ""+this.selectedTaskModel.OPTM_FROMOPERNO).subscribe(
      data => {
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
}
