import { Component, OnInit, Input } from '@angular/core';
import { GetAllTask } from 'src/app/model/GetAllTask';
import { GetAllReasons } from 'src/app/model/GetAllReasons';
import { NotificationService } from '@progress/kendo-angular-notification';
import { TranslateService } from '@ngx-translate/core';
import { TimeentryService } from 'src/app/services/timeentry.service';
import { Constants } from 'src/constants/constants';
import { GetExistingTaskDetail } from 'src/app/model/GetExistingTaskDetail';
import { SAVETASK } from 'src/app/model/SAVETASK';
import { Geneology } from 'src/app/model/Geneology';
import { DateFormatPipe } from 'src/app/common/date-format.pipe';

@Component({
  selector: 'app-time-entry',
  templateUrl: './time-entry.component.html',
  styleUrls: ['./time-entry.component.scss']
})
export class TimeEntryComponent implements OnInit {

  @Input() selectedTaskModel: GetAllTask;
  @Input() existingTaskDetails: GetExistingTaskDetail;
  @Input() resourceList: any[];
  @Input() geneology: Geneology;

  @Input() disableStartResumeFlag;
  @Input() disableInterruptFlag;
  @Input() disablekFinishedFlag;
  @Input() disableAbortFlag;
  @Input() disableSubmitFlag;
  @Input() disableInterruptFields;
  @Input() isGeneologyEnable;

  currentDateTime: Date;
  interruptReasonList: GetAllReasons[];
  interruptReasonEnable: boolean = false;
  selectedInterruptReason: GetAllReasons;
  showLoader: boolean = false;
  requestSAVETASK: SAVETASK;

  constructor(private notificationService: NotificationService,
    private timeentryService: TimeentryService, private translate: TranslateService, private datePipe: DateFormatPipe) {

    this.selectedInterruptReason = { Code: "0", Description: this.translate.instant("SelectReason"), Type: "0" };
    this.requestSAVETASK = new SAVETASK();
  }

  ngOnInit() {
    this.currentDateTime = new Date();
    console.log("selectedTaskModel: " + this.selectedTaskModel);
    console.log("existingTaskDetails: " + this.existingTaskDetails);

    console.log("disableInterruptFlag: " + this.disableInterruptFlag);
    console.log("disableStartResumeFlag: " + this.disableStartResumeFlag);
    console.log("current date: " + new Date());
    this.getAllReasons('onload');
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

  selectionChange(value: any, type: string) {
    if ('reason' == type) {
      this.selectedInterruptReason = value
    }
  }

  private getAllReasons(type: any) {
    if ('click' == type) {
      if (this.interruptReasonList != null && this.interruptReasonList.length > 0) {
        return;
      }
    }

    this.timeentryService.getAllReasons().subscribe(
      data => {
        if (data != undefined && data.ErrorMsg == "7001") {

        } else {
          if (data != null && data != undefined) {
            this.interruptReasonList = data;
            this.selectedInterruptReason = { Code: "0", Description: this.translate.instant("SelectReason"), Type: "0" };
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

  public startResume() {
    this.saveTask(Constants.mStartResume);
  }

  public abortRecord() {
    var reason = document.getElementById("abortReason").innerText.trim();
    if (reason == undefined || reason == '') {
      this.show(this.translate.instant("MsgAbortReason"));
    } else {
      this.saveTask(Constants.mAbortRecord);
    }
  }

  public interrupt() {
    var intrptReason = document.getElementById("interruptReason").innerText.trim();
    if (intrptReason == undefined || intrptReason == ''
      || intrptReason == this.translate.instant('SelectReason')) {
      this.show(this.translate.instant("MsgIntrptReason"));
    } else {
      this.saveTask(Constants.mInterrupt);
    }
  }

  public submit() {
    this.saveTask(Constants.mSubmit);
  }

  public finish() {
    var intrptReason = document.getElementById("interruptReason").innerText.trim();
    if (this.existingTaskDetails.OPTM_STATUS == 'I') {
      if (intrptReason == undefined || intrptReason == ''
        || intrptReason == this.translate.instant('SelectReason')) {
        this.show(this.translate.instant("MsgIntrptReason"));
      } else {
        this.saveTask(Constants.mFinish);
      }
    } else {
      this.saveTask(Constants.mFinish);
    }
  }

  public saveTask(method: string) {
    this.showLoader = true;
    console.log("called " + method);
    this.timeentryService.saveTask(method, this.getSaveTaskModel(method)).subscribe(
      data => {
        this.showLoader = false;
        if (data != undefined && data.ErrorMsg == "7001") {

        } else {
          if (data != null && data != undefined) {
            if (method == Constants.mStartResume) {

            } else if (method == Constants.mInterrupt) {
              this.interruptReasonEnable = true;
              this.existingTaskDetails.OPTM_INTRPTDATE = "" + this.currentDateTime;
            } else if (method == Constants.mAbortRecord) {

            } else if (method == Constants.mFinish) {

            } else if (method == Constants.mSubmit) {

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

  getSaveTaskModel(method: string) {
    if (method == Constants.mStartResume) {
      this.requestSAVETASK.TaskCode = this.selectedTaskModel.OPTM_TASKCODE;
      this.requestSAVETASK.WO = this.selectedTaskModel.OPTM_WONO;
      this.requestSAVETASK.Warehouse = localStorage.getItem(Constants.whseId);
      this.requestSAVETASK.WC = this.selectedTaskModel.OPTM_WC;
      this.requestSAVETASK.WorkCenter = this.selectedTaskModel.OPTM_WC;
      this.requestSAVETASK.OperationNo = "" + this.selectedTaskModel.OPTM_FROMOPERNO;
      this.requestSAVETASK.OperationDesc = this.selectedTaskModel.OPTM_FROMOPRCODE;
      this.requestSAVETASK.Item = this.selectedTaskModel.OPTM_FGCODE;
      this.requestSAVETASK.Description = this.selectedTaskModel.Description;
      this.requestSAVETASK.Duration = "" + this.selectedTaskModel.OPTM_DURATIONMINS;
      this.requestSAVETASK.StartDate = "";
      this.requestSAVETASK.EndDateTime = "";
      this.requestSAVETASK.IntereuptDate = "";
      this.requestSAVETASK.ProducedQty = "";
      this.requestSAVETASK.AcceptedQty = "0";
      this.requestSAVETASK.RejectedQty = "0";
      this.requestSAVETASK.NCQty = "0";
      this.requestSAVETASK.ResDtlCode = "";
      this.requestSAVETASK.Reason = "";
      this.requestSAVETASK.Remarks = "";
      this.requestSAVETASK.AbortReason = "";
      this.requestSAVETASK.OrderDueDate = this.datePipe.transform(this.selectedTaskModel.U_O_STARTDATE, Constants.Format_Order_StartDate);
      this.requestSAVETASK.OrderStartDate = this.datePipe.transform(this.selectedTaskModel.U_O_ENDDATE, Constants.Format_Order_StartDate);
      this.requestSAVETASK.UserId = this.selectedTaskModel.OPTM_USERID;
      this.requestSAVETASK.ResType = "";
      this.requestSAVETASK.StartResume = this.datePipe.transform(this.currentDateTime, Constants.Format_Order_StartDate);
      this.requestSAVETASK.InteruptDateTime = "";
      this.requestSAVETASK.OpnStartPer = this.selectedTaskModel.FormattedOprStartPer;
      this.requestSAVETASK.OpnEndPer = this.selectedTaskModel.FormattedOprEndPer;
      this.requestSAVETASK.OpnQtyOnOpn = ""+this.selectedTaskModel.OPTM_REMAININGQTY;
      this.requestSAVETASK.OrderQty = ""+this.selectedTaskModel.OPTM_QTYTOPROD;
      this.requestSAVETASK.AssignedQty = "" + this.selectedTaskModel.AssignedQty;
      this.requestSAVETASK.AssignedTime = "" + this.selectedTaskModel.AssignedTime;
      this.requestSAVETASK.OpenStandardTime = this.selectedTaskModel.FormattedStdTime;
      this.requestSAVETASK.BreakDownTime = "0";
      this.requestSAVETASK.WorkTime = "0";
      this.requestSAVETASK.CompanyDBId = localStorage.getItem(Constants.CompID);
      this.requestSAVETASK.Status = this.selectedTaskModel.OPTM_STATUS;
      this.requestSAVETASK.PostingReady = "N";
      this.requestSAVETASK.Posted = "N";
      this.requestSAVETASK.PostedDate = "";
      this.requestSAVETASK.ResInstance = localStorage.getItem(Constants.machine);
      this.requestSAVETASK.MoveOrderNo = "0";
      this.requestSAVETASK.ReasonType = "0";
      this.requestSAVETASK.BreakTime = "0";
      this.requestSAVETASK.DownTime = "0";
      this.requestSAVETASK.EmpId = localStorage.getItem(Constants.EmpID);
      this.requestSAVETASK.RequireMachine = "1";
      this.requestSAVETASK.Resume = "";
      this.requestSAVETASK.Resource = this.selectedTaskModel.OPTM_SCHRESOURCE; /// Resource
      this.requestSAVETASK.CreateDate = this.selectedTaskModel.OPTM_CREATEDATE;
      this.requestSAVETASK.Tracking = localStorage.getItem(Constants.ItemManagedBy);
      this.requestSAVETASK.OPTMID = "" ; // Requiredddddddddddddddddddddddddddddddd
      this.requestSAVETASK.Allocper = "0";

      this.requestSAVETASK.ToOperationNo = "" + this.selectedTaskModel.OPTM_FROMOPERNO;
      this.requestSAVETASK.GUID = localStorage.getItem(Constants.GUID);
      this.requestSAVETASK.TaskId = localStorage.getItem(Constants.TaskId);
      this.requestSAVETASK.Username = localStorage.getItem(Constants.username);
    } else if (method == Constants.mInterrupt) {
      this.requestSAVETASK.TaskCode = this.selectedTaskModel.OPTM_TASKCODE;
      this.requestSAVETASK.WO = this.selectedTaskModel.OPTM_WONO;
      this.requestSAVETASK.Warehouse = localStorage.getItem(Constants.whseId);
      this.requestSAVETASK.WC = this.selectedTaskModel.OPTM_WC;
      this.requestSAVETASK.WorkCenter = this.selectedTaskModel.OPTM_WC;
      this.requestSAVETASK.OperationNo = "" + this.selectedTaskModel.OPTM_FROMOPERNO;
      this.requestSAVETASK.OperationDesc = this.selectedTaskModel.OPTM_FROMOPRCODE;
      this.requestSAVETASK.Item = this.selectedTaskModel.OPTM_FGCODE;
      this.requestSAVETASK.Description = this.selectedTaskModel.Description;
      this.requestSAVETASK.Duration = "" + this.selectedTaskModel.OPTM_DURATIONMINS;
      this.requestSAVETASK.StartDate = "";
      this.requestSAVETASK.EndDateTime = "";
      this.requestSAVETASK.IntereuptDate = "";
      this.requestSAVETASK.ProducedQty = "" + this.selectedTaskModel.OPTM_QTYTOPROD;
      this.requestSAVETASK.AcceptedQty = "0";
      this.requestSAVETASK.RejectedQty = "0";
      this.requestSAVETASK.NCQty = "0";
      this.requestSAVETASK.ResDtlCode = "";
      this.requestSAVETASK.Reason = "";
      this.requestSAVETASK.Remarks = "";
      this.requestSAVETASK.AbortReason = "";
      this.requestSAVETASK.OrderDueDate = this.datePipe.transform(this.selectedTaskModel.U_O_STARTDATE, Constants.Format_Order_StartDate);
      this.requestSAVETASK.OrderStartDate = this.datePipe.transform(this.selectedTaskModel.U_O_ENDDATE, Constants.Format_Order_StartDate);
      this.requestSAVETASK.UserId = this.selectedTaskModel.OPTM_USERID;
      this.requestSAVETASK.ResType = "";
      this.requestSAVETASK.StartResume = this.datePipe.transform(this.existingTaskDetails.OPTM_RESUMEDATE, Constants.Format_Order_StartDate);
      this.requestSAVETASK.InteruptDateTime = this.datePipe.transform(this.currentDateTime, Constants.Format_Order_StartDate);
      this.requestSAVETASK.OpnStartPer = "" + this.selectedTaskModel.OpnStartPer;
      this.requestSAVETASK.OpnEndPer = "" + this.selectedTaskModel.OpnEndPer;
      this.requestSAVETASK.OpnQtyOnOpn = ""+this.selectedTaskModel.OPTM_QTYTOPROD;
      this.requestSAVETASK.OrderQty = ""+this.selectedTaskModel.OPTM_QTYTOPROD;
      this.requestSAVETASK.AssignedQty = "" + this.selectedTaskModel.AssignedQty;
      this.requestSAVETASK.AssignedTime = "" + this.selectedTaskModel.AssignedTime;
      this.requestSAVETASK.OpenStandardTime = this.selectedTaskModel.FormattedStdTime;
      this.requestSAVETASK.BreakDownTime = "";
      this.requestSAVETASK.WorkTime = "";
      this.requestSAVETASK.CompanyDBId = localStorage.getItem(Constants.CompID);
      this.requestSAVETASK.Status = this.selectedTaskModel.OPTM_STATUS;
      this.requestSAVETASK.PostingReady = "";
      this.requestSAVETASK.Posted = "";
      this.requestSAVETASK.PostedDate = "";
      this.requestSAVETASK.ResInstance = this.selectedTaskModel.OPTM_RESINSTANCE;
      this.requestSAVETASK.MoveOrderNo = "";
      this.requestSAVETASK.ReasonType = "";
      this.requestSAVETASK.BreakTime = "";
      this.requestSAVETASK.DownTime = "";
      this.requestSAVETASK.EmpId = localStorage.getItem(Constants.EmpID);
      this.requestSAVETASK.RequireMachine = localStorage.getItem(Constants.machine)
      this.requestSAVETASK.Resume = "";
      this.requestSAVETASK.Resource = this.selectedTaskModel.OPTM_SCHRESOURCE
      this.requestSAVETASK.CreateDate = this.selectedTaskModel.OPTM_CREATEDATE;
      this.requestSAVETASK.Tracking = localStorage.getItem(Constants.ItemManagedBy);
      this.requestSAVETASK.OPTMID = ""; // Requiredddddddddddddddddddddddddddddddd

      this.requestSAVETASK.ToOperationNo = "" + this.selectedTaskModel.OPTM_FROMOPERNO;
      this.requestSAVETASK.GUID = localStorage.getItem(Constants.GUID);
      this.requestSAVETASK.TaskId = localStorage.getItem(Constants.TaskId);
      this.requestSAVETASK.Username = localStorage.getItem(Constants.username);
      this.requestSAVETASK.skipComponentCheck = "";
    } else if (method == Constants.mAbortRecord) {

    }

    return this.requestSAVETASK;
  }
}
