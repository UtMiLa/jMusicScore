import { Component, OnInit, Input } from '@angular/core';
import { IVoice } from '../../../../../jMusic/simple-model/jm-simple-model-interfaces';

@Component({
  selector: 'app-voice-element',
  templateUrl: './voice-element.component.html',
  styleUrls: ['./voice-element.component.scss']
})
export class VoiceElementComponent implements OnInit {

  constructor() { }

  @Input()
  voice: IVoice;

  ngOnInit() {
  }

}
