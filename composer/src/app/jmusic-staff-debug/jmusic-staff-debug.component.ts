import { Component, OnInit, Input } from '@angular/core';
import { IStaff, IGlobalContext } from '../../../../jMusic/model/jm-model-interfaces';

@Component({
  selector: 'app-jmusic-staff-debug',
  templateUrl: './jmusic-staff-debug.component.html',
  styleUrls: ['./jmusic-staff-debug.component.scss']
})
export class JmusicStaffDebugComponent implements OnInit {

  constructor() { }

  @Input()
  staff: IStaff;

  @Input()
  globalContext: IGlobalContext;

  ngOnInit() {
    
  }

}
