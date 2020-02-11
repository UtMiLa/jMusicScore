import { Component, OnInit, Input } from '@angular/core';
import { IVoice } from '../../../../../jMusic/simple-model/jm-simple-model-interfaces';

@Component({
  selector: 'app-voice',
  templateUrl: './voice.component.html',
  styleUrls: ['./voice.component.scss']
})
export class VoiceComponent implements OnInit {

  constructor() { }
  @Input()
  element: IVoice;


  ngOnInit() {
  }

}
