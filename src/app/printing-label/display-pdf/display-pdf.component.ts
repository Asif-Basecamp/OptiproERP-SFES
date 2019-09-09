import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Commonservice } from 'src/app/services/common.service';
import { ISubscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-display-pdf',
  templateUrl: './display-pdf.component.html',
  styleUrls: ['./display-pdf.component.scss']
})
export class DisplayPdfComponent implements OnInit {

  @Input() base64String: string;
  @Input() fileName: string;
  @Output() pdfClose = new EventEmitter();
  displayPDF: boolean = false;
  fileNameLabel: string = "";
  opened: boolean = true;
  refreshEventForReopenPDFSubs: ISubscription;
  constructor(private commonService: Commonservice) { }

  ngOnInit() {
    console.log("fileName "+this.fileName);
    this.fileNameLabel = this.fileName.substr(this.fileName.lastIndexOf("\\") + 1);
    this.base64String = encodeURI(this.base64String);
    if (this.base64String != null && this.base64String != "") this.displayPDF = true;
    this.refreshEventForReopenPDFSubs = this.commonService.refreshPDFSubscriber.subscribe(data => {
      //for event to destroy item here.
      this.opened = true;
    });
  }

  OnCancelClick() {
    this.pdfClose.emit("item");
  }

  public close() {
    console.log("PDF dialog  close called");
    // this.pdfClose.emit({ close: true });
    this.opened = false;
  }

  public open() {
    this.opened = true;
  }

  ngOnDestroy() {
    console.log("distroy")
  }

}
