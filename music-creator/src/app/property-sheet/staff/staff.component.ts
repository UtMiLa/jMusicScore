import { Component, OnInit, Input } from '@angular/core';
import { IStaff } from '../../../../../jMusic/simple-model/jm-simple-model-interfaces';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {

  constructor() { }
  
  @Input()
  element: IStaff;

  ngOnInit() {
  }

}
