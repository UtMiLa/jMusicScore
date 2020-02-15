import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Pitch } from '../../../../../jMusic/jm-music-basics';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MidiInService } from 'src/app/midi-in.service';
import { MusicIoService } from 'src/app/music-io.service';


@Component({
  selector: 'app-pitch-edit',
  templateUrl: './pitch-edit.component.html',
  styleUrls: ['./pitch-edit.component.scss']
})
export class PitchEditComponent implements OnInit {

  accidentals = ['𝄫', '♭', '♮', '♯', '𝄪'];

  constructor(fb: FormBuilder, private musicIn: MusicIoService) {
    this.pitchParts =  fb.group({
      //pitch: [0],
      noteName: ['c', Validators.pattern('[a-g]')],
      octave: ['4', Validators.pattern('\\d+')],
      alteration: 0
    });
  }

  pitchParts: FormGroup;

  @Input()
  get value(): Pitch | null {
    const n = this.pitchParts.value;
    const p = Pitch.noteNameOctaveToPitch(n.noteName, n.octave);
    return new Pitch(p, Pitch.intToStr(n.alteration - 2));
  }
  set value(p: Pitch | null) {
    p = p || new Pitch(0, '');
    const no = Pitch.pitchToNoteNameOctave(p.pitch);
    this.pitchParts.setValue({
      //pitch: p.pitch, 
      noteName: no.noteName,
      octave: no.octave,
      alteration: Pitch.strToInt(p.alteration) + 2
    });
    //this.onSubmit();
  }

  get accidental(): string {
    return this.pitchParts.value ? this.accidentals[this.pitchParts.value.alteration] : '-';
  }

  @Output()
  valueChg = new EventEmitter<Pitch>();

  onSubmit() {
    // TODO: Use EventEmitter with form value
    if (this.pitchParts.valid) {
      this.valueChg.emit(this.value);
    }
  }

  countUp(val: number) {
    this.value = new Pitch(this.value.pitch, Pitch.intToStr(Pitch.strToInt(this.value.alteration) + val));
  }

  enharmonic() {
    this.value = this.value.getEnharmonicPitch();
  }

  pitchChanged(){
    /*const n = this.pitchParts.value;
    const p = Pitch.noteNameOctaveToPitch(n.noteName, n.octave);

    this.value = new Pitch(p, Pitch.intToStr(n.alteration - 2));*/
    this.onSubmit();
  }

  ngOnInit() {

    // console.log(this.musicIn.getInputs());
    this.musicIn.chordReleased.subscribe((msg) => {
      console.log(msg.map(p => Pitch.createFromMidi(p).debug()));
      this.value = Pitch.createFromMidi(msg[0]);
    });

  }

}
