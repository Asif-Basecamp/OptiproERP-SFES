import { Component, OnInit, Input } from '@angular/core';
import { GetAllTask } from 'src/app/model/GetAllTask';
import { GetExistingTaskDetail } from 'src/app/model/GetExistingTaskDetail';
import { Router } from '@angular/router';
import { NotificationService } from '@progress/kendo-angular-notification';
import { TranslateService } from '@ngx-translate/core';
import { Commonservice } from 'src/app/services/common.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  @Input() selectedTaskModel: GetAllTask;
  @Input() existingTaskDetails: GetExistingTaskDetail;
  showLoader: boolean = false;
  shouldShowPDF: boolean;
  fileName: string = "";
  base64String: string = "";

  constructor(private router: Router, private notificationService: NotificationService,
    private commonservice: Commonservice, private translate: TranslateService) { }

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

  public displayPDF(){
    this.commonservice.getPrintingLabelData(this.selectedTaskModel.OPTM_SCHRESOURCE, "1").subscribe(
      data => {
        console.log("data: "+data);
        debugger
        if (data != undefined && data.ErrorMsg == "7001") {
            
        } else {
          if (data != null && data != undefined) {
            
            this.shouldShowPDF = true;
            this.base64String = "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\nEW/16RUeqglGxxdazu8J1X4uzIuYDL0KfVSO5L97XgKPCmVuZHN0cmVhbQplbmRvYmoKMSAwIG9i\nago8PC9Hcm91cDw8L1R5cGUvR3JvdXAvQ1MvRGV2aWNlUkdCL1MvVHJhbnNwYXJlbmN5Pj4vUGFy\nZW50IDUgMCBSL0NvbnRlbnRzIDQgMCBSL1R5cGUvUGFnZS9SZXNvdXJjZXM8PC9Qcm9jU2V0IFsv\nUERGIC9UZXh0IC9JbWFnZUIgL0ltYWdlQyAvSW1hZ2VJXS9Db2xvclNwYWNlPDwvQ1MvRGV2aWNl\nUkdCPj4vRm9udDw8L0YxIDIgMCBSL0YyIDMgMCBSPj4+Pi9NZWRpYUJveFswIDAgNTk1IDg0Ml0v\nUm90YXRlIDkwPj4KZW5kb2JqCjYgMCBvYmoKWzEgMCBSL1hZWiAwIDYwNSAwXQplbmRvYmoKMiAw\nIG9iago8PC9CYXNlRm9udC9IZWx2ZXRpY2EvVHlwZS9Gb250L0VuY29kaW5nL1dpbkFuc2lFbmNv\nZGluZy9TdWJ0eXBlL1R5cGUxPj4KZW5kb2JqCjcgMCBvYmoKPDwvRm9udEJCb3ggWy0yNSAtMjU0\nIDEwMDAgODgwXS9DYXBIZWlnaHQgODgwL1N0eWxlPDwvUGFub3NlKAEFAgIEAAAAAAAAACk+Pi9U\neXBlL0ZvbnREZXNjcmlwdG9yL1N0ZW1WIDkzL0Rlc2NlbnQgLTEyMC9GbGFncyA2L0ZvbnROYW1l\nL1NUU29uZy1MaWdodC9Bc2NlbnQgODgwL0l0YWxpY0FuZ2xlIDA+PgplbmRvYmoKOCAwIG9iago8\nPC9CYXNlRm9udC9TVFNvbmctTGlnaHQvQ0lEU3lzdGVtSW5mbzw8L09yZGVyaW5nKEdCMSkvUmVn\naXN0cnkoQWRvYmUpL1N1cHBsZW1lbnQgND4+L1R5cGUvRm9udC9TdWJ0eXBlL0NJREZvbnRUeXBl\nMC9Gb250RGVzY3JpcHRvciA3IDAgUi9EVyAxMDAwPj4KZW5kb2JqCjMgMCBvYmoKPDwvRGVzY2Vu\nZGFudEZvbnRzWzggMCBSXS9CYXNlRm9udC9TVFNvbmctTGlnaHQtVW5pR0ItVUNTMi1IL1R5cGUv\nRm9udC9FbmNvZGluZy9VbmlHQi1VQ1MyLUgvU3VidHlwZS9UeXBlMD4+CmVuZG9iago1IDAgb2Jq\nCjw8L0lUWFQoMi4xLjcpL1R5cGUvUGFnZXMvQ291bnQgMS9LaWRzWzEgMCBSXT4+CmVuZG9iago5\nIDAgb2JqCjw8L05hbWVzWyhKUl9QQUdFX0FOQ0hPUl8wXzEpIDYgMCBSXT4+CmVuZG9iagoxMCAw\nIG9iago8PC9EZXN0cyA5IDAgUj4+CmVuZG9iagoxMSAwIG9iago8PC9OYW1lcyAxMCAwIFIvVHlw\nZS9DYXRhbG9nL1ZpZXdlclByZWZlcmVuY2VzPDwvUHJpbnRTY2FsaW5nL0FwcERlZmF1bHQ+Pi9Q\nYWdlcyA1IDAgUj4+CmVuZG9iagoxMiAwIG9iago8PC9DcmVhdG9yKEphc3BlclJlcG9ydHMgTGli\ncmFyeSB2ZXJzaW9uIDUuNi4wKS9Qcm9kdWNlcihpVGV4dCAyLjEuNyBieSAxVDNYVCkvTW9kRGF0\nZShEOjIwMTcxMjI5MTE0OTE0KzA4JzAwJykvQ3JlYXRpb25EYXRlKEQ6MjAxNzEyMjkxMTQ5MTQr\nMDgnMDAnKT4+CmVuZG9iagp4cmVmCjAgMTMKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAxODc1\nIDAwMDAwIG4gCjAwMDAwMDIxNjMgMDAwMDAgbiAKMDAwMDAwMjYwNSAwMDAwMCBuIAowMDAwMDAw\nMDE1IDAwMDAwIG4gCjAwMDAwMDI3MjkgMDAwMDAgbiAKMDAwMDAwMjEyOCAwMDAwMCBuIAowMDAw\nMDAyMjUxIDAwMDAwIG4gCjAwMDAwMDI0NDIgMDAwMDAgbiAKMDAwMDAwMjc5MiAwMDAwMCBuIAow\nMDAwMDAyODQ2IDAwMDAwIG4gCjAwMDAwMDI4NzkgMDAwMDAgbiAKMDAwMDAwMjk4NCAwMDAwMCBu\nIAp0cmFpbGVyCjw8L1Jvb3QgMTEgMCBSL0lEIFs8NzM3YjNiYTEyZTQ3ZjE4MDdlYjE1NDA1NjMw\nMDQyYWI+PDRiMzVlN2ZlOWU0YTM4YWU3ZDJiY2E1MTgzNmQ2NWZmPl0vSW5mbyAxMiAwIFIvU2l6\nZSAxMz4+CnN0YXJ0eHJlZgozMTUyCiUlRU9GCg==";
            if (this.base64String != null && this.base64String != "") {
              // this.showPdf(); // this function is used to display pdf in new tab.
              this.base64String = 'data:application/pdf;base64,' + this.base64String;
              // this.displayPDF = true;
              // this.commonservice.refreshDisplyPDF(true);
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

  closePDF(event: any){

  }
}
