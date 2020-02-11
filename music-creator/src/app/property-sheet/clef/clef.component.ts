import { Component, OnInit, Input } from '@angular/core';
import { IClef } from '../../../../../jMusic/simple-model/jm-simple-model-interfaces';

@Component({
  selector: 'app-clef',
  templateUrl: './clef.component.html',
  styleUrls: ['./clef.component.scss']
})
export class ClefComponent implements OnInit {

  constructor() { }

  @Input()
  element: IClef;

  ngOnInit() {
  }

}
