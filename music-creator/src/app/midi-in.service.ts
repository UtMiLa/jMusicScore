import { Injectable, EventEmitter } from '@angular/core';


export interface IMidiEvent {
   channel: number;
   note: number;
   velocity: number;
   source?: string;
   _type?: string ;
}

declare var navigator: Navigator & {  requestMIDIAccess(); };


@Injectable({
  providedIn: 'root'
})
export class MidiInService {

  inputs: any;
  outputs: any;

  constructor() {
      this.midiEventEmitter = new EventEmitter<IMidiEvent>();
      this.midiSysEventEmitter = new EventEmitter<IMidiEvent>();
      this.midiMessageEventEmitter = new EventEmitter<IMidiEvent>();
      this.midiCtlEventEmitter = new EventEmitter<IMidiEvent>();

      if (navigator.requestMIDIAccess) {
        console.log('This browser supports WebMIDI!');


        navigator.requestMIDIAccess()
      .then(
        (midiAccess) => {
          console.log(midiAccess);

          this.inputs = midiAccess.inputs;
          this.outputs = midiAccess.outputs;


          this.getInputs().forEach(element => {
            // console.log(element);

            element.onmidimessage = msg => {
              // tslint:disable-next-line:no-bitwise
              const command = msg.data[0] & 0xf0;
              // tslint:disable-next-line:no-bitwise
              const channel = msg.data[0] & 0x0f;
              const note = msg.data[1];
              const velocity = (msg.data.length > 2) ? msg.data[2] : 0; // a velocity value might not be included with a noteOff command

              if (command === 0x90) {
                // console.log(msg, command, note, velocity);
                this.midiEventEmitter.next({
                  channel,
                  note,
                  velocity,
                  /*source?: string;*/
                  _type: 'noteon'
                });
              } else if (command === 0xb0) {
                // controller
                this.midiCtlEventEmitter.next({
                  channel,
                  note,
                  velocity,
                  /*source?: string;*/
                  _type: 'cc'
                });
              } else if (command === 0xf0) {
                // console.log(msg, command, note, velocity); timer
              } else {
                console.log(command, channel, note);
              }
            };
            /*const input = new easymidi.Input(element);
            .on('sysex',  (msg: IMidiEvent) => {
              msg.source = element;
              this.midiSysEventEmitter.next(msg);
              // console.log(msg);
            })
            .on('message', (msg: IMidiEvent) => {
              msg.source = element;
              this.midiMessageEventEmitter.next(msg);
              // console.log(msg);
            });*/
          });

          this.getOutputs().forEach(element => {
            // console.log(element);
            /*const output = new easymidi.Output(element);
            this.outputs.push({id: element, dev: output});*/
          });

        },
        () => {
          console.log('Could not access your MIDI devices.');
        });

  } else {
      console.log('WebMIDI is not supported in this browser.');
      return;
  }

  }


  // outputs = [];

  midiEventEmitter: EventEmitter<IMidiEvent>;

  midiSysEventEmitter: EventEmitter<IMidiEvent>;

  midiMessageEventEmitter: EventEmitter<IMidiEvent>;

  midiCtlEventEmitter: EventEmitter<IMidiEvent>;


  sendMidi(cmd: string, data: IMidiEvent) {
    for (let i = 0; i < this.outputs.length; i++) {
      const output = this.outputs[i].dev;
      output.send(cmd, data);
    }
  }

  getInputs() {
    return this.inputs;
  }
  getOutputs() {
    return this.outputs;
  }
}
