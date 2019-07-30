import { IScore } from "../model/jm-model-interfaces";
import { GlobalContext } from "../model/jm-model-base";
import { ControlElementManager } from "../jm-stafflogic";
import { LilyPondConverter } from "../jm-lilypond";
import { ViewModeller } from "../viewmodel/jm-create-viewmodel";


var globalContext = new GlobalContext();

var viewModeller = new ViewModeller();
/*var document: IScore;
var controlManager: ControlElementManager;*/


function loadFromLily(input: string, noStaves: number, noVoices: number){
    let parser = new LilyPondConverter(globalContext);
    let parsedObject = parser.read(input);
      
    expect(parsedObject.staffElements.length).toEqual(noStaves);
    expect(parsedObject.staffElements[0].voiceElements.length).toEqual(noVoices);
    return parsedObject;
}

describe("Measures", function () {

    xit("should create a correct measure map", function() {
        let sample = loadFromLily("{ \\time 4/4 g'4 a' b' f' c'' d'' e'' f'' }", 1, 1)
    });
});

describe("Note", function () {

    it("should map a simple melody correctly to a treble staff", function() {
        let sample = loadFromLily("{ \\time 4/4 g'4 a' b' f' c'' d'' e'' f'' }", 1, 1);

        const res = viewModeller.create(sample, globalContext);
        expect(res.events.length).toBe(9);
        expect(res.events[0].absoluteTime.toString()).toBe('0/1');
        expect(res.events[2].absoluteTime.toString()).toBe('1/4');
        expect(res.events[8].absoluteTime.toString()).toBe('7/4');
    });
    xit("should map notes correctly to g, c, f clefs");
    xit("should map a chord correctly");
    xit("should calculate a correct number of ledger lines");
    xit("should ");
    xit("should ");
    xit("should ");
    xit("should ");
});


describe("Accidentals", function () {
    xit("should map accidentals correctly");
    xit("should retain accidentals for the rest of the measure but not longer");
    xit("should map correct accidentals in a sharp key");
    xit("should map correct accidentals in a flat key");
    xit("should map correct accidentals in an irregular key");
    xit("should displace accidentals correctly in chords");
    xit("should ");
    xit("should ");
});



describe("Beams", function () {
    xit("should not make beams in large note values");
    xit("should make beams in a simple sequence of 8. notes");
    xit("should make beams in a simple sequence of 16. and 32. notes");
    xit("should make beams correctly in a mixed sequence of 8. and 16. notes");
    xit("should ");
    xit("should ");
});