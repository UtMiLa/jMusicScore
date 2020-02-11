import { Component, OnInit, Input } from '@angular/core';
import { Pitch } from '../../../../../jMusic/jm-music-basics';

@Component({
  selector: 'app-pitch-edit',
  templateUrl: './pitch-edit.component.html',
  styleUrls: ['./pitch-edit.component.scss']
})
export class PitchEditComponent implements OnInit {

  constructor() { }

  @Input()
  value: Pitch;

  ngOnInit() {
  }

}
