import { Component, OnInit, Input } from '@angular/core';
import { Rational } from '../../../../../jMusic/jm-music-basics';

@Component({
  selector: 'app-rational-edit',
  templateUrl: './rational-edit.component.html',
  styleUrls: ['./rational-edit.component.scss']
})
export class RationalEditComponent implements OnInit {

  constructor() { }

  @Input()
  value: Rational;

  ngOnInit() {
  }

}
