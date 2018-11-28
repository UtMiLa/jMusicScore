import { IMemento, ClefDefinition, NoteType, AbsoluteTime, TimeSpan, RegularKeyDefinition } from '../jm-base';
import { IVoice, IScore, IStaff, IKey, IClef, IVoiceNote, INote, INotehead } from '../model/jm-model-interfaces';
import { MusicElementFactory, ScoreElement, Music, GlobalContext } from '../model/jm-model';
import { LilyPondConverter } from '../jm-lilypond';
import { VariableRef } from '../jm-ghost-elements';

describe("Lilypond Import", function () {
    //var score: IScore;
    //var app: IScoreApplication;
    var globalContext = new GlobalContext();

    function loadFromLily(input: string, noStaves: number, noVoices: number){
        let parser = new LilyPondConverter(globalContext);
        let parsedObject = parser.read(input);
          
        expect(parsedObject.staffElements.length).toEqual(noStaves);
        expect(parsedObject.staffElements[0].voiceElements.length).toEqual(noVoices);
        return parsedObject;
    }

    //var document;
    beforeEach(function () {
        //document = new ScoreElement(null);
        VariableRef.register();
    });
    describe("parser", function () {
        it("should correctly import pitches", function () {
            var input = "{ c4 d e f g a b c'}";

            let parsedObject = loadFromLily(input, 1, 1);
            
            expect(parsedObject.staffElements[0].voiceElements[0].getNoteElements(globalContext).length).toEqual(8);
            for(var i = 0; i < 8; i++){
                let note = parsedObject.staffElements[0].voiceElements[0].getNoteElements(globalContext)[i];
                expect(note.noteheadElements[0].pitch.pitch).toEqual(i-7);
            }
        });

        it("should correctly import note octaves", function () {
            var input = "{ c'''4 c'' c' c c, c,, c,,,}";

            let parsedObject = loadFromLily(input, 1, 1);
            
            expect(parsedObject.staffElements[0].voiceElements[0].getNoteElements(globalContext).length).toEqual(7);

            for(var i = 0; i < 7; i++){
                let note = parsedObject.staffElements[0].voiceElements[0].getNoteElements(globalContext)[i];
                expect(note.noteheadElements[0].pitch.pitch).toEqual(14 - 7 * i);
            }
        });

        it("should correctly import note pitches with accidentals", function () {
            var input = "{ ceses4 ces c cis cisis }";

            let parsedObject = loadFromLily(input, 1, 1);
            
            expect(parsedObject.staffElements[0].voiceElements[0].getNoteElements(globalContext).length).toEqual(5);
            let results: any[] = ['bb', 'b', '', 'x', 'xx'];

            for(var i = 0; i < 5; i++){
                let note = parsedObject.staffElements[0].voiceElements[0].getNoteElements(globalContext)[i];
                expect(note.noteheadElements[0].pitch.alteration).toEqual(results[i]);
            }
        });

        it("should correctly import note values", function () {
            var input = "{ c\\brevis d1 e2 f4 g8 a16 b32 c'64}";

            let parsedObject = loadFromLily(input, 1, 1);
            
            expect(parsedObject.staffElements[0].voiceElements[0].getNoteElements(globalContext).length).toEqual(8);
            var value = new TimeSpan(2,1);
            for(var i = 0; i < 8; i++){
                let note = parsedObject.staffElements[0].voiceElements[0].getNoteElements(globalContext)[i];
                //console.log(note.timeVal);
                expect(note.timeVal.eq(value)).toEqual(true);
                value = value.divideScalar(2);
            }
        });

        it("should correctly import dotted note values", function () {
            var input = "{ c4 c4. c4.. c4... <c e>4. r4. }";

            let parsedObject = loadFromLily(input, 1, 1);
            
            expect(parsedObject.staffElements[0].voiceElements[0].getNoteElements(globalContext).length).toEqual(6);

            let results = [0, 1, 2, 3, 1, 1];

            for(var i = 0; i < 6; i++){
                let note = parsedObject.staffElements[0].voiceElements[0].getNoteElements(globalContext)[i];
                expect(note.dotNo).toEqual(results[i]);
            }
        });

        it("should correctly import note ties", function () {
            var input = "{ c4~ c16}";

            let parsedObject = loadFromLily(input, 1, 1);
            
            expect(parsedObject.staffElements[0].voiceElements[0].getNoteElements(globalContext).length).toEqual(2);

            let note = parsedObject.staffElements[0].voiceElements[0].getNoteElements(globalContext)[0]
            expect(note.noteheadElements[0].tie).toEqual(true);
        });

        it("should correctly import chords", function () {
            var input = "{ c'4 <c' e' g'>8 <c' f' a'>4 }";

            let parsedObject = loadFromLily(input, 1, 1);
            
            expect(parsedObject.staffElements[0].voiceElements[0].getNoteElements(globalContext).length).toEqual(3);

            let note = parsedObject.staffElements[0].voiceElements[0].getNoteElements(globalContext)[0];
            expect(note.noteheadElements.length).toEqual(1);

            note = parsedObject.staffElements[0].voiceElements[0].getNoteElements(globalContext)[1];
            expect(note.noteheadElements.length).toEqual(3);
            expect(note.noteheadElements[0].pitch.pitch).toEqual(0);
            expect(note.noteheadElements[1].pitch.pitch).toEqual(2);
            expect(note.noteheadElements[2].pitch.pitch).toEqual(4);
        });

        it("should correctly import rests", function () {
            var input = "{ c4 r4 s4 c4 }";

            let parsedObject = loadFromLily(input, 1, 1);
            
            expect(parsedObject.staffElements[0].voiceElements[0].getNoteElements(globalContext).length).toEqual(4);

            let note = parsedObject.staffElements[0].voiceElements[0].getNoteElements(globalContext)[0];
            expect(note.noteheadElements.length).toEqual(1);
            expect(note.rest).toEqual(false);

            let rest = parsedObject.staffElements[0].voiceElements[0].getNoteElements(globalContext)[1];
            expect(rest.noteheadElements.length).toEqual(0);
            expect(rest.rest).toEqual(true);

            let hidden = parsedObject.staffElements[0].voiceElements[0].getNoteElements(globalContext)[2];
            expect(hidden.noteheadElements.length).toEqual(0);
            expect(hidden.rest).toEqual(true);
        });

        it("should correctly insert time changes", function () {
            var input = "{ c4 \\time 4/8 c4 }";

            let parsedObject = loadFromLily(input, 1, 1);
            
            let notes = parsedObject.staffElements[0].voiceElements[0].getNoteElements(globalContext);
            expect(notes.length).toEqual(2);

            // test Meter object

        });
        it("should beam notes correctly", function () {
            var input = "{ c8[ d e] f g[ a] }";

            let parsedObject = loadFromLily(input, 1, 1);
            
            let notes = parsedObject.staffElements[0].voiceElements[0].getNoteElements(globalContext);
            expect(notes.length).toEqual(6);

            //test beaming
        });
        it("should allow nested sequences", function () {
            var input = "{ c4 d {e f} g }";

            let parsedObject = loadFromLily(input, 1, 1);
            
            let noteArray = ((<any>parsedObject.staffElements[0].voiceElements[0].getSequence('')).getChild(0).noteElements);
            expect(noteArray.length).toEqual(3);

            let childArray = (<any>parsedObject.staffElements[0].voiceElements[0].getSequence('')).getChild(0).removeThisChildren;
            expect(childArray.length).toEqual(4);

            let notes = parsedObject.staffElements[0].voiceElements[0].getNoteElements(globalContext);
            expect(notes.length).toEqual(5);
            expect(notes[0].debug()).toEqual('Nn1_4(c ) ');
            expect(notes[1].debug()).toEqual('Nn1_4(d ) ');
            expect(notes[2].debug()).toEqual('Nn1_4(e ) ');
            expect(notes[3].debug()).toEqual('Nn1_4(f ) ');
            expect(notes[4].debug()).toEqual('Nn1_4(g ) ');

            // test values
        });
        it("should correctly insert variables", function () {
            let hutlifut = loadFromLily("{d4 e4}", 1, 1);

            var input = "{ c4 \\hutlifut c4 }";

            let parsedObject = loadFromLily(input, 1, 1);

            globalContext.addVariable('hutlifut', hutlifut.staffElements[0].voiceElements[0].getSequence(''));

            let noteArray = ((<any>parsedObject.staffElements[0].voiceElements[0].getSequence('')).getChild(0).noteElements);
            expect(noteArray.length).toEqual(2);

            let childArray = (<any>parsedObject.staffElements[0].voiceElements[0].getSequence('')).getChild(0).removeThisChildren;
            expect(childArray.length).toEqual(3);


            let notes = parsedObject.staffElements[0].voiceElements[0].getNoteElements(globalContext);
            expect(notes.length).toEqual(4);
            expect(notes[0].debug()).toEqual('Nn1_4(c ) ');
            expect(notes[1].debug()).toEqual('Nn1_4(d ) ');
            expect(notes[2].debug()).toEqual('Nn1_4(e ) ');
            expect(notes[3].debug()).toEqual('Nn1_4(c ) ');
        });
        /*xit("should correctly import repeats", function () {
            let hutlifut = loadFromLily("d4 e4", 1, 1);

            var input = "{ \\repeat unfold 19 \\hutlifut }";

            let parsedObject = loadFromLily(input, 1, 1);
            
            //parsedObject.variables["hutlifut"] = hutlifut;

            let notes = parsedObject.staffElements[0].voiceElements[0].getNoteElements();
            expect(notes.length).toEqual(2);

            // test repeat
        });
        it("should correctly import multiplied rest values", function () {

            var input = "{ r1*7/8  }";

            let parsedObject = loadFromLily(input, 1, 1);
            
            let notes = parsedObject.staffElements[0].voiceElements[0].getNoteElements();
            expect(notes.length).toEqual(1);

            // test rest type and length
            expect(notes[0].getTimeVal().toString()).toEqual("7/8");
        });
        xit("should correctly import modally transposed subgroups", function () {
            var diatonicScale = loadFromLily("c4 d e f g a b", 1, 1);

            var input = "{ \\modalTranspose e c \\diatonicScale { c4 e g b d f a } }";

            let parsedObject = loadFromLily(input, 1, 1);
            //parsedObject.variables["diatonicScale"] = diatonicScale;
            
            let notes = parsedObject.staffElements[0].voiceElements[0].getNoteElements();
            expect(notes.length).toEqual(1);

            // test values
        });
        xit("should correctly import modally transposed subgroups", function () {
            var input = "{ \\transpose e c { c4 e g b d f a } }";

            let parsedObject = loadFromLily(input, 1, 1);
            
            let notes = parsedObject.staffElements[0].voiceElements[0].getNoteElements();
            expect(notes.length).toEqual(1);

            // test values
        });*/
    });
});

