import { Component, OnInit, Input } from '@angular/core';
import { IVoiceDef } from '../datamodel/model';

@Component({
  selector: 'app-voice-list',
  templateUrl: './voice-list.component.html',
  styleUrls: ['./voice-list.component.css']
})
export class VoiceListComponent implements OnInit {

  constructor() { }

  private _voices: IVoiceDef;
  @Input() set voices(value: IVoiceDef) { 
    this._voices = value; 
    //console.log(value);
    if (value && value.voices) {
      this.voiceText = value.voices.join("\n");
    }
    else this.voiceText = "";
  }
  get voices(): IVoiceDef { return this._voices; }

  voiceText: string;

  ngOnInit() {
  }

}
