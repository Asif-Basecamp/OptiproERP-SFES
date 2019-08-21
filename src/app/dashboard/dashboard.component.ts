import { Component, OnInit } from '@angular/core';
import { products } from '../dummyData/taskList';
import { WindowState } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public windowOpened = true;
  public windowState: WindowState = 'default';
  public gridData: any[] = products;

  constructor() { }

  ngOnInit() {
    //this.taskListToggle();
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

}
