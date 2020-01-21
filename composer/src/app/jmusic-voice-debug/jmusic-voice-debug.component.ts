import { Component, OnInit, Input } from '@angular/core';
import { IVoice, IGlobalContext, IEventInfo } from '../../../../jMusic/model/jm-model-interfaces';

@Component({
  selector: 'app-jmusic-voice-debug',
  templateUrl: './jmusic-voice-debug.component.html',
  styleUrls: ['./jmusic-voice-debug.component.scss']
})
export class JmusicVoiceDebugComponent implements OnInit {

  constructor() { }

  _voice: IVoice;

  events: IEventInfo[];

  @Input()
  set voice(value: IVoice) { 
    if (this._voice !== value) {
      this._voice = value;
      this.events = this.voice ? this.voice.getEvents(this.globalContext) : [];
    }
  }
  get voice(): IVoice { return this._voice; }

  @Input()
  globalContext: IGlobalContext;

  ngOnInit() {
  }

}
