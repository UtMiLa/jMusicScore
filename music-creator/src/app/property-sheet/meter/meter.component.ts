import { Component, OnInit, Input } from '@angular/core';
import { IMeter } from '../../../../../jMusic/simple-model/jm-simple-model-interfaces';

@Component({
  selector: 'app-meter',
  templateUrl: './meter.component.html',
  styleUrls: ['./meter.component.scss']
})
export class MeterComponent implements OnInit {

  constructor() { }

  @Input()
  element: IMeter;

  ngOnInit() {
  }

}
