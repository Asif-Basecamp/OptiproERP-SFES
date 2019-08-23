import { Component, OnInit, Input } from '@angular/core';
import { GetAllTask } from 'src/app/model/GetAllTask';
import { GetAllReasons } from 'src/app/model/GetAllReasons';
import { NotificationService } from '@progress/kendo-angular-notification';
import { TranslateService } from '@ngx-translate/core';
import { TimeentryService } from 'src/app/services/timeentry.service';

@Component({
  selector: 'app-time-entry',
  templateUrl: './time-entry.component.html',
  styleUrls: ['./time-entry.component.scss']
})
export class TimeEntryComponent implements OnInit {

  @Input() selectedTaskModel: GetAllTask;
  @Input() interruptReasonList: GetAllReasons[];
  interruptReasonEnable: boolean = false;
  selectedInterruptReason: GetAllReasons;
  showLoader: boolean = false;

  constructor(private notificationService: NotificationService,
    private timeentryService: TimeentryService, private translate: TranslateService) { 
    console.log("selectedInterruptReason: "+this.selectedInterruptReason.Description);
  }

  ngOnInit() {
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

  selectionChange(value: any, type: string){

  }

  private getAllReasons(){
    this.timeentryService.getAllReasons().subscribe(
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
