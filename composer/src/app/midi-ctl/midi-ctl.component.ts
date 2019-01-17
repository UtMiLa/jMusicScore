import { Component, OnInit, Input, ChangeDetectorRef, ApplicationRef } from '@angular/core';
import { ScoreStatusManager } from '../../../../jMusic/jm-application';
import { Pitch } from '../../../../jMusic/jm-music-basics';

@Component({
  selector: 'app-midi-ctl',
  templateUrl: './midi-ctl.component.html',
  styleUrls: ['./midi-ctl.component.scss']
})
export class MidiCtlComponent implements OnInit {

  constructor(private ref: ChangeDetectorRef, private appRef: ApplicationRef) { }


  midi = null;  // global MIDIAccess object

  @Input() status: ScoreStatusManager;

  ngOnInit() {
    const  onMIDISuccess = ( midiAccess ) => {
      console.log( 'MIDI ready!' );
      this.midi = midiAccess;  // store in the global (in real usage, would probably keep in an object instance)
      this.listInputsAndOutputs(this.midi);
    };

    const onMIDIFailure = (msg) => {
      console.log( 'Failed to get MIDI access - ' + msg );
    };


    (<any>navigator).requestMIDIAccess().then( onMIDISuccess, onMIDIFailure );
  }

  listInputsAndOutputs( midiAccess ) {
    /*midiAccess.inputs.forEach((entry) => {
      const input = entry;
      console.log( 'Input port [type:\'' + input.type + '\'] id:\'' + input.id +
        '\' manufacturer:\'' + input.manufacturer + '\' name:\'' + input.name +
        '\' version:\'' + input.version + '\'' );
    });*/
    this.startLoggingMIDIInput(this.midi, 0);

    /*midiAccess.outputs.forEach((entry) => {
      const output = entry;
      console.log( 'Output port [type:\'' + output.type + '\'] id:\'' + output.id +
        '\' manufacturer:\'' + output.manufacturer + '\' name:\'' + output.name +
        '\' version:\'' + output.version + '\'' );

        this.sendMiddleC(this.midi, output.id);
    });*/
  }


  onMIDIMessage = ( event ) => {
    /*let str = 'MIDI message received at timestamp ' + event.timestamp + '[' + event.data.length + ' bytes]: ';
    for (let i = 0; i < event.data.length; i++) {
      str += '0x' + event.data[i].toString(16) + ' ';
    }*/

    if (event.data[0] === 0x90) {
      if (event.data[2] === 0x00) {
        // note off
        this.status.releaseNoteKey(Pitch.createFromMidi(event.data[1]));
      } else {
        // note on
        this.status.pressNoteKey(Pitch.createFromMidi(event.data[1]));
      }
      // this.ref.detectChanges();
      this.appRef.tick();
    }

    // this.sendMsg(this.midi, 'output-1', event.data);
    // console.log( str );
  }

  startLoggingMIDIInput( midiAccess, indexOfPort ) {
    midiAccess.inputs.forEach((entry) => {
      entry.onmidimessage = (event) => { this.onMIDIMessage(event); };
    });
  }

/*  sendMsg( midiAccess, portID, noteOnMessage ) {
    // var noteOnMessage = [0x90, 60, 0x7f];    // note on, middle C, full velocity
    const output = midiAccess.outputs.get(portID);
    output.send( noteOnMessage );  // omitting the timestamp means send immediately.
    // output.send( [0x80, 60, 0x40], window.performance.now() + 1000.0 ); // Inlined array creation- note off, middle C,
                                                                        // release velocity = 64, timestamp = now + 1000ms.
  }

  sendMiddleC( midiAccess, portID ) {
    const noteOnMessage = [0x90, 60, 0x7f];    // note on, middle C, full velocity
    const output = midiAccess.outputs.get(portID);
    output.send( noteOnMessage );  // omitting the timestamp means send immediately.
    output.send( [0x80, 60, 0x40], window.performance.now() + 1000.0 ); // Inlined array creation- note off, middle C,
                                                                        // release velocity = 64, timestamp = now + 1000ms.
  }

*/
}
