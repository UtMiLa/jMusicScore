import { Injectable, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { MidiInService, IMidiEvent } from './midi-in.service';
import { ScoreStatusManager } from '../../../../jMusicScore/jMusic/jm-application';
import { Pitch } from '../../../../jMusicScore/jMusic/jm-music-basics';
import { GlobalContext } from '../../../../jMusicScore/jMusic/model/jm-model-base';


@Injectable({
  providedIn: 'root'
})
export class MusicIoService {

  status = new ScoreStatusManager(new GlobalContext());
  currentChord: number[] = [];

  constructor(private midiService: MidiInService/*, private cd: ChangeDetectorRef*/) {
    console.log('MusicIoService');

    this.musicChanged = new EventEmitter<IMidiEvent>();
    this.chordReleased = new EventEmitter<number[]>();
    this.controlChanged = new EventEmitter<IMidiEvent>();

    this.midiService.midiEventEmitter.subscribe((event: IMidiEvent) => {

      if (event.velocity === 0) {
        // console.log(event);
        this.status.releaseNoteKey(Pitch.createFromMidi(event.note));
      } else {
        // console.log(event);
        this.status.pressNoteKey(Pitch.createFromMidi(event.note));
        if (this.currentChord.indexOf(event.note) === -1) {
          this.currentChord.push(event.note);
        }
      }
      this.musicChanged.next(event);
      if (!this.status.notesPressed.length) {
        this.chordReleased.next(this.currentChord);
        this.currentChord = [];
      }
      // this.cd.detectChanges();
    });

    this.midiService.midiCtlEventEmitter.subscribe((event: IMidiEvent) => {
      this.controlChanged.next(event);
    });

  }
  musicChanged: EventEmitter<IMidiEvent>;
  chordReleased: EventEmitter<number[]>;
  controlChanged: EventEmitter<IMidiEvent>;

}
