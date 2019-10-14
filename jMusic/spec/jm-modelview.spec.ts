import { IScore } from "../model/jm-model-interfaces";
import { GlobalContext } from "../model/jm-model-base";
import { ControlElementManager } from "../jm-stafflogic";
import { LilyPondConverter } from "../jm-lilypond";
import { ViewModeller } from "../viewmodel/jm-create-viewmodel";
import { VEvent, VNote } from "../viewmodel/jm-viewmodel";
import { Alteration, ClefDefinition, ClefType, AbsoluteTime } from "../jm-music-basics";


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

    it("should create a correct measure map", function() {
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
    it("should map notes correctly to g, c, f clefs", function() {
        let sample = loadFromLily("{ \\time 4/4 g'4 a' b' f' c'' d'' e'' f'' }", 1, 1);

        const res = viewModeller.create(sample, globalContext);
        expect(res.events.length).toBe(9);
        expect((<VNote>res.events[1]).heads[0].line).toBe(6);
        expect((<VNote>res.events[2]).heads[0].line).toBe(5);
        expect((<VNote>res.events[3]).heads[0].line).toBe(4);
        expect((<VNote>res.events[4]).heads[0].line).toBe(7);
        expect((<VNote>res.events[5]).heads[0].line).toBe(3);
        expect((<VNote>res.events[6]).heads[0].line).toBe(2);
        expect((<VNote>res.events[7]).heads[0].line).toBe(1);
        expect((<VNote>res.events[8]).heads[0].line).toBe(0);
    });
    it("should map notes correctly to c, f clefs", function() {
        let sample = loadFromLily("{ \\time 4/4 g'4 a' b' f' c' d' e' f' }", 1, 1); // todo: \\clef alto

        sample.staffElements[0].setClef(ClefDefinition.clefCAlto, AbsoluteTime.startTime);

        const res = viewModeller.create(sample, globalContext);
        expect(res.events.length).toBe(9);
        expect((<VNote>res.events[1]).heads[0].line).toBe(0);
        expect((<VNote>res.events[2]).heads[0].line).toBe(-1);
        expect((<VNote>res.events[3]).heads[0].line).toBe(-2);
        expect((<VNote>res.events[4]).heads[0].line).toBe(1);
        expect((<VNote>res.events[5]).heads[0].line).toBe(4);
        expect((<VNote>res.events[6]).heads[0].line).toBe(3);
        expect((<VNote>res.events[7]).heads[0].line).toBe(2);
        expect((<VNote>res.events[8]).heads[0].line).toBe(1);
    });
    it("should map notes correctly to f clef", function() {
        let sample = loadFromLily("{ \\time 4/4 g4 a b f c d e f }", 1, 1); // todo: \\clef bass

        sample.staffElements[0].setClef(ClefDefinition.clefF, AbsoluteTime.startTime);

        const res = viewModeller.create(sample, globalContext);
        expect(res.events.length).toBe(9);
        expect((<VNote>res.events[1]).heads[0].line).toBe(1);
        expect((<VNote>res.events[2]).heads[0].line).toBe(0);
        expect((<VNote>res.events[3]).heads[0].line).toBe(-1);
        expect((<VNote>res.events[4]).heads[0].line).toBe(2);
        expect((<VNote>res.events[5]).heads[0].line).toBe(5);
        expect((<VNote>res.events[6]).heads[0].line).toBe(4);
        expect((<VNote>res.events[7]).heads[0].line).toBe(3);
        expect((<VNote>res.events[8]).heads[0].line).toBe(2);

    });
    /*xit("should map a chord correctly");
    xit("should calculate a correct number of ledger lines");
    xit("should ");
    xit("should ");
    xit("should ");
    xit("should ");*/
});

/*
Viewmodel er en kontekstfri repræsentation af nodebilledet.
Hvert symbol i nodebilledet er repræsenteret af et objekt.
Fortolkningen af objektet er ikke afhængigt af konteksten, fx tidligere angivne nøgler/taktarter m.m.
Deres nøjagtige placering er ikke beregnet, kun deres relative placering (absolut tid, nr. event i takten, og ikke mm eller pixels).
Alle variable er erstattet af deres værdi.
Alle faste fortegn, metre m.m. er dubleret i hvert system, de er knyttet til.
Alle noder er placeret på linjenummer i stedet for absolut tone.
Alle hjælpelinjer er beregnet.
Nodehoveder på modsat side af halsen er beregnet (displacement).
Alle løse fortegn er beregnet efter gældende regler.
Alle tekster er delt ud på stavelser, og evt. bindestreger er angivet.
 */
describe("Accidentals", function () {
    it("should map accidentals correctly", function() {
        let sample = loadFromLily("{ \\time 4/4 g'4 as' b' fis' }", 1, 1);

        const res = viewModeller.create(sample, globalContext);
        expect(res.events.length).toBe(5);
        expect((<VNote>res.events[2]).heads[0].accidental.type.toString()).toBe("b");
        expect((<VNote>res.events[4]).heads[0].accidental.type.toString()).toBe("x");
    });
    it("should retain accidentals for the rest of the measure but not longer", function() {
        let sample = loadFromLily("{ \\time 4/4 g'4 as' b' fis'' fis'' fis'' e'' f'' }", 1, 1);

        const res = viewModeller.create(sample, globalContext);
        expect(res.events.length).toBe(9);
        expect((<VNote>res.events[4]).heads[0].accidental.type.toString()).toBe("x");
        expect((<VNote>res.events[5]).heads[0].accidental.type.toString()).toBe("x");
        expect((<VNote>res.events[6]).heads[0].accidental.type.toString()).toBe("");
        expect((<VNote>res.events[8]).heads[0].accidental.type.toString()).toBe("n");
    });
    /*xit("should map correct accidentals in a sharp key");
    xit("should map correct accidentals in a flat key");
    xit("should map correct accidentals in an irregular key");
    xit("should displace accidentals correctly in chords");
    xit("should ");
    xit("should ");*/
});



describe("Beams", function () {
    /*xit("should not make beams in large note values");
    xit("should make beams in a simple sequence of 8. notes");
    xit("should make beams in a simple sequence of 16. and 32. notes");
    xit("should make beams correctly in a mixed sequence of 8. and 16. notes");
    xit("should ");
    xit("should ");*/
});