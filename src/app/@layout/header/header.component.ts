import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '@progress/kendo-angular-notification';
import { DashboardService } from 'src/app/services/dashboard.service';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from 'src/constants/constants';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    public isCollapsed = true;
    public username;

    constructor(private router: Router, private notificationService: NotificationService,
        private dashboardService: DashboardService, private translate: TranslateService) {
            this.username = localStorage.getItem(Constants.UserId);
    }
    ngOnInit() {
    }

    functionM() {
        console.log(this);
    }

    public logoutUser() {
        this.dashboardService.deleteDirectory().subscribe(
            data => {
                console.log("deleteDirectory: " + data);
            },
            error => {
            }
        );

        this.dashboardService.removeLoggedInUser().subscribe(
            data => {
                console.log("removeLoggedInUser: " + data);
            },
            error => {
            }
        );

        this.router.navigateByUrl('/login');
    }
}
