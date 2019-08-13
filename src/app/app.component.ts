import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showHeader = false;
  showSidebar = false;
  showFooter = false;
  compactLayout = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showHeader = this.activatedRoute.firstChild.snapshot.data.showHeader !== false;
        this.showSidebar = this.activatedRoute.firstChild.snapshot.data.showSidebar !== false;
        this.showFooter = this.activatedRoute.firstChild.snapshot.data.showFooter !== false;        
        this.compactLayout = this.activatedRoute.firstChild.snapshot.data.compactLayout !== false;        
        console.log('Header : ' + this.showHeader);
        console.log('SideBar : ' + this.showSidebar);
        console.log('Footer : ' + this.showFooter);
        if(this.showSidebar){
          document.body.classList.remove("no-sidebar");
          console.log('Sidebar is : ' + this.showSidebar);
        }else{
          document.body.classList.add("no-sidebar");
          console.log('Sidebar is : ' + this.showSidebar);
        }
        if(this.compactLayout){
          document.body.classList.add("compact-layout");
          console.log('Compact layout is : ' + this.compactLayout);
        }else{
          document.body.classList.remove("compact-layout");
          console.log('Compact layout is : ' + this.compactLayout);
        }
        if(this.showHeader){
          document.body.classList.remove("no-header");
          console.log('Header is : ' + this.showHeader);
        }else{
          document.body.classList.add("no-header");
          console.log('Header is : ' + this.showHeader);
        }
      }
      
      
    });
    
    
  }
}
