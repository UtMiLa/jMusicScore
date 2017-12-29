var navigator = require('web-midi-api');

var midi;
var inputs;
var outputs;

function onMIDIFailure(msg){
  console.log('Failed to get MIDI access - ' + msg);
  process.exit(1);
}

function onMIDISuccess(midiAccess){
  midi = midiAccess;
  inputs = midi.inputs;
  outputs = midi.outputs;
  setTimeout(testOutputs, 500);
}

function testOutputs(){
  console.log('Testing MIDI-Out ports...');
  outputs.forEach(function(port){
    console.log('id:', port.id.toString(), 'manufacturer:', port.manufacturer, 'name:', port.name, 'version:', port.version);
    port.open();
    if (port.name == "uMIDI/O22")
      port.send([0x90, 60, 0x4f]);
    else if (port.name == "MIDIOUT2 (uMIDI/O22)")
      port.send([0x90, 61, 0x4f]);    
      else if (port.name == "Microsoft GS Wavetable Synth")
      port.send([0x90, 62, 0x4f]);
      else if (port.name == "DUO-CAPTURE EX")
      port.send([0x90, 63, 0x4f]);
      else 
      port.send([0x90, 67, 0x4f]);
  });
  setTimeout(stopOutputs, 1000);
}

function stopOutputs(){
  outputs.forEach(function(port){
    port.send([0x80, 60, 0]);
  });
  testInputs();
}

function onMidiIn(ev){
  var arr = [];
  for(var i = 0; i < ev.data.length; i++){
    //arr.push((ev.data[i] < 16 ? '0' : '') + ev.data[i].toString(16));
    arr.push(ev.data[i]);
  }
  outputs.forEach(function(port){
    if (port.name == "DUO-CAPTURE EX") {
        console.log('name:', port.name, 'data:', JSON.stringify(ev.data));
        //port.open();
        if (arr[0] == 0x90 || arr[0] == 0x80) arr[1] = Math.ceil(arr[1] / 2) + 30;
        port.send(arr);
    }
  });
  console.log('MIDI:', arr.join(' '));
}

function testInputs(){
  console.log('Testing MIDI-In ports...');
  inputs.forEach(function(port){
    console.log('id:', port.id, 'manufacturer:', port.manufacturer, 'name:', port.name, 'version:', port.version);
    port.onmidimessage = onMidiIn;
  });
  setTimeout(stopInputs, 13000);
}

function stopInputs(){
  console.log('Thank you!');
  navigator.close(); // This will close MIDI inputs, otherwise Node.js will wait for MIDI input forever.
  process.exit(0);
}

navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);