import { Component, OnInit, Input } from '@angular/core';
import { GetAllTask } from 'src/app/model/GetAllTask';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  @Input()
  selectedTaskModel: GetAllTask;
  
  constructor() { }

  ngOnInit() {
  }

}
