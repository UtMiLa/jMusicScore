import { Component, OnInit, Input } from '@angular/core';
import { IStaff } from '../../../../../jMusic/simple-model/jm-simple-model-interfaces';

@Component({
  selector: 'app-staff-element',
  templateUrl: './staff-element.component.html',
  styleUrls: ['./staff-element.component.scss']
})
export class StaffElementComponent implements OnInit {

  constructor() { }

  @Input()
  staff: IStaff;

  ngOnInit() {
  }

}
