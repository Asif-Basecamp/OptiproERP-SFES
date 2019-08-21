import { Component, OnInit } from '@angular/core';
import { products } from './../../dummyData/taskList';
@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {
  public gridData: any[] = products;
  constructor() { }

  ngOnInit() {
  }

}
