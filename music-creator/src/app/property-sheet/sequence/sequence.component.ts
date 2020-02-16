import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ISequence, INote } from '../../../../../jMusic/simple-model/jm-simple-model-interfaces';
import { MusicIoService } from 'src/app/music-io.service';
import { Pitch, TimeSpan } from '../../../../../jMusic/jm-music-basics';

@Component({
  selector: 'app-sequence',
  templateUrl: './sequence.component.html',
  styleUrls: ['./sequence.component.scss']
})
export class SequenceComponent implements OnInit {

  constructor(private musicIoService: MusicIoService, private cd: ChangeDetectorRef) { }

  items = [];
  tgWidth = 30;
  // chords = [];
  currentLength = 0;

  @Input()
  element: ISequence;


  tap() {
    this.currentLength++;
    // console.log("tapping", this.currentLength);
  }

  ngOnInit() {
    this.musicIoService.chordReleased.subscribe((event) => {
      // console.log(event);

      const newNote: INote = {
        noteGlyph: new TimeSpan(1, 4),
        timeVal:  new TimeSpan(this.currentLength + 1, 4),
        dots: this.currentLength === 2 ? 1 : 0,
        noteheads: event.sort().map(n =>
          ({
            pitch: Pitch.createFromMidi(n)
          })
        ),
        rest: false
      };

      this.element.events.push(newNote);

      /*this.chords.push({
        chord: event.sort().map(n => Pitch.createFromMidi(n)),
        length: this.currentLength
      });*/
      this.currentLength = 0;
      this.cd.detectChanges();
    });


    this.musicIoService.musicChanged.subscribe((event) => {
      if (event.velocity > 0 && this.currentLength && this.musicIoService.status.notesPressed.length === 1) {
        const newNote: INote = {
          noteGlyph: new TimeSpan(1, 4),
          timeVal:  new TimeSpan(this.currentLength + 1, 4),
          dots: this.currentLength === 2 ? 1 : 0,
          rest: true
        };
  
        this.element.events.push(newNote);
        // this.chords.push({ chord: [], length: this.currentLength });
        this.currentLength = 0;
        this.cd.detectChanges();
      }
    });

    this.musicIoService.controlChanged.subscribe((event) => {
      // console.log('controlChanged', event);
      if (event.controller === 64) {
        // left pedal
        if (event.value === 0) {
          this.tap();
          this.cd.detectChanges();
        }
      } else if (event.controller === 67) {
        // right pedal
      }
    });

    const tgSpacing = this.tgWidth * 7 / 12;
    for (let i = 21; i < 109; i++) {
        const det = ((i + 7) * 7) % 12;
        const className = 'bw' + det;
        const left = (det < 7) ? (i - 21 - det / 7) * tgSpacing : (i - 21 - (det - 8) / 7) * tgSpacing;
        const bw = det >= 7 ? 'bw-black' : 'bw-white';

        this.items.push({det, className, left: left + 'px', bw, i});
    }
  }
  upDown(item) {
    const up = !this.musicIoService.status.notesPressed.some((value) => item.i === value.toMidi() );
    return up ? 'up' : 'down';
  }

  notePressed(i: number) {
    this.musicIoService.status.pressNoteKey(Pitch.createFromMidi(i));
  }
  noteReleased(i: number) {
    this.musicIoService.status.releaseNoteKey(Pitch.createFromMidi(i));
  }
}
