import { Component, OnInit, Input } from '@angular/core';
import { IVoice, IGlobalContext } from '../../../../jMusic/model/jm-model-interfaces';

@Component({
  selector: 'app-jmusic-voice-debug',
  templateUrl: './jmusic-voice-debug.component.html',
  styleUrls: ['./jmusic-voice-debug.component.scss']
})
export class JmusicVoiceDebugComponent implements OnInit {

  constructor() { }

  @Input()
  voice: IVoice;

  @Input()
  globalContext: IGlobalContext;

  ngOnInit() {
  }

}
