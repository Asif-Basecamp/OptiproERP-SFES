import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '@progress/kendo-angular-notification';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {

  showLoader: boolean = false;
  @Input() resourceList: any[];

  constructor(private router: Router, private notificationService: NotificationService, 
    private translate: TranslateService) { }

  ngOnInit() {
    console.log("resource component");
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
}
