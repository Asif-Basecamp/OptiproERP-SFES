import { Component, OnInit } from '@angular/core';
import { products } from 'src/app/dummyData/taskList';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss']
})
export class AttachmentsComponent implements OnInit {
  public gridData: any[] = products;
  
  constructor() { }

  ngOnInit() {
  }

}
