import {IKeyDefCreator, IKeyDefinition, IMemento, IMeterDefCreator, IMeterDefinition, IVisitorIterator,
    AbsoluteTime, ClefDefinition, ClefType, HorizPosition, KeyDefinitionFactory, LongDecorationType, 
    MeterDefinitionFactory, NoteDecorationKind, NoteType, OffsetMeterDefinition, Pitch, PitchClass, 
    Rational, RegularKeyDefinition, RegularMeterDefinition, StaffContext, StemDirectionType, TimeSpan, TupletDef, Interval, IntervalType} from '../jm-base';
import { IVoice, IScore, IStaff, IKey, IClef, IVoiceNote, INote, INotehead, IEventVisitor, INoteInfo } from '../model/jm-model-interfaces';    
import {    NoteDecorationElement, TextSyllableElement, 
    NoteLongDecorationElement, Music, MusicElementFactory,  ScoreElement } from "../model/jm-model";  
import { GlobalContext, NullEventVisitor } from "../model/jm-model-base";
import  { IScoreApplication, ScoreStatusManager } from '../jm-application';
import  { AbstractApplication } from '../jap-application';
import  { MusicSpacing } from '../jm-spacing';
import  { JsonHelper } from '../jm-json';
import { VariableRef } from '../jm-ghost-elements';

import { LilyPondConverter } from '../jm-lilypond';



var initScore: any = { "id": "2", "t": "Score", "def": { "metadata": {} }, "children": [{ "id": "3", "t": "Bar", "def": { "abs": { "num": 0, "den": 1 } } }, { "id": "4", "t": "Bar", "def": { "abs": { "num": 1, "den": 1 } } }, { "id": "5", "t": "Bar", "def": { "abs": { "num": 2, "den": 1 } } }, { "id": "6", "t": "Staff", "children": [{ "id": "7", "t": "Clef", "def": { "abs": { "num": 0, "den": 1 }, "clef": 1, "lin": 4, "tr": 0 } }, { "id": "8", "t": "Meter", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "num": 4, "den": 4 } } }, { "id": "9", "t": "Key", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "acci": "x", "no": 2 } } }, { "id": "10", "t": "Sequence", "def": { "stem": 1 }, "children": [{ "id": "11", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 0, "den": 1 }, "noteId": "n1_8" }, "children": [{ "id": "12", "t": "Notehead", "def": { "p": 2, "a": "" } }] }, { "id": "13", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 1, "den": 8 }, "noteId": "n1_8" }, "children": [{ "id": "14", "t": "Notehead", "def": { "p": 2, "a": "" } }] }, { "id": "15", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 1, "den": 4 }, "noteId": "n1_8" }, "children": [{ "id": "16", "t": "Notehead", "def": { "p": 4, "a": "" } }] }, { "id": "17", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 3, "den": 8 }, "noteId": "n1_8" }, "children": [{ "id": "18", "t": "Notehead", "def": { "p": 6, "a": "" } }] }, { "id": "19", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 1, "den": 2 }, "noteId": "n1_16" }, "children": [{ "id": "20", "t": "Notehead", "def": { "p": 6, "a": "" } }] }, { "id": "21", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 9, "den": 16 }, "noteId": "n1_16" }, "children": [{ "id": "22", "t": "Notehead", "def": { "p": 5, "a": "" } }] }, { "id": "23", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 5, "den": 8 }, "noteId": "n1_16" }, "children": [{ "id": "24", "t": "Notehead", "def": { "p": 4, "a": "" } }] }, { "id": "25", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 11, "den": 16 }, "noteId": "n1_16" }, "children": [{ "id": "26", "t": "Notehead", "def": { "p": 3, "a": "" } }] }, { "id": "27", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 3, "den": 4 }, "noteId": "n1_8", "dots": 1 }, "children": [{ "id": "28", "t": "Notehead", "def": { "p": 2, "a": "" } }] }, { "id": "29", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 15, "den": 16 }, "noteId": "n1_16" }, "children": [{ "id": "30", "t": "Notehead", "def": { "p": 2, "a": "" } }] }, { "id": "31", "t": "Note", "def": { "time": { "num": 1, "den": 4 }, "abs": { "num": 1, "den": 1 }, "noteId": "n1_4" }, "children": [{ "id": "32", "t": "Notehead", "def": { "p": 1, "a": "" } }] }] }, { "id": "33", "t": "Voice", "def": { "stem": 2 } }] }, { "id": "34", "t": "Staff", "children": [{ "id": "35", "t": "Clef", "def": { "abs": { "num": 0, "den": 1 }, "clef": 3, "lin": 2, "tr": 0 } }, { "id": "36", "t": "Meter", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "num": 4, "den": 4 } } }, { "id": "37", "t": "Key", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "acci": "x", "no": 2 } } }, { "id": "38", "t": "Sequence" }] }, { "id": "39", "t": "Meter", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "num": 4, "den": 4 } } }] };

var globalContext = new GlobalContext();

function loadFromLily(input: string, noStaves: number, noVoices: number){
    let parser = new LilyPondConverter(globalContext);
    let parsedObject = parser.read(input);
      
    expect(parsedObject.staffElements.length).toEqual(noStaves);
    expect(parsedObject.staffElements[0].voiceElements.length).toEqual(noVoices);
    return parsedObject;
}


describe("NullVisitor", function () {
    //var score: IScore;
    //var app: IScoreApplication;
    var document: IScore;

    beforeEach(function () {
        VariableRef.register();
        document = new ScoreElement(null);
    });

    it("should visit every element once", function () {
        expect(document.staffElements.length).toEqual(0);
    });
});

describe("ContextVisitor", function () {
    var document: IScore;

    beforeEach(function () {
        VariableRef.register();
        document = new ScoreElement(null);
    });

    it("should visit every element once with context", function () {
        expect(document.staffElements.length).toEqual(0);
    });
});

describe("NullEventVisitor", function () {
    var document: IScore;
    var visitor: NullEventVisitor;

    beforeEach(function () {
        VariableRef.register();

        let hutlifut = loadFromLily("{d4 e4}", 1, 1);

        globalContext.addVariable('hutlifut', hutlifut.staffElements[0].voiceElements[0].getSequence(''));

        visitor = new NullEventVisitor();
        spyOn(visitor, "visitNote");

    });

    function testEvents(testItem: {input: string; res:any }){
        document = loadFromLily(testItem.input, 1, 1);

        let events = document.staffElements[0].voiceElements[0].getEvents(globalContext);
        expect(events.length).toEqual(testItem.res.length);
        for (let i = 0; i < events.length; i++){
            events[i].visit(visitor);
            //console.log(events[i].source.debug());
            //console.log((<INoteInfo>events[i]).absTime.toString());
        }
        expect(visitor.visitNote).toHaveBeenCalledTimes(testItem.res.length);
        // todo: test abstime, pitch, notelen
        for (let i = 0; i < testItem.res.length; i++){
            const call = (<any>visitor.visitNote).calls.argsFor(i);
            expect(call).toBeDefined();
            expect(call[0]).toBeDefined();
            expect(call[0].relTime.toString()).toEqual(testItem.res[i].abs);
            expect(call[0].heads[0].pitch.debug()).toEqual(testItem.res[i].pitch);
        }
    }


    const testSet = [
        {
            input: "{ c4 d {e f} g }",
            res: [
                { abs: '0/1', pitch: "c" },
                { abs: '1/4', pitch: "d" },
                { abs: '1/2', pitch: "e" },
                { abs: '3/4', pitch: "f" },
                { abs: '1/1', pitch: "g" },
            ]
        },
        {
            input: "{ c4 \\hutlifut f4 }",
            res: [
                { abs: '0/1', pitch: "c" },
                { abs: '1/4', pitch: "d" },
                { abs: '1/2', pitch: "e" },
                { abs: '3/4', pitch: "f" },
            ]
        },
        {
            input: "{ c4 \\transpose c e { d4 e4 } f4 }",
            res: [
                { abs: '0/1', pitch: "c" },
                { abs: '1/4', pitch: "f" },
                { abs: '1/2', pitch: "g" },
                { abs: '3/4', pitch: "f" },
            ]
        },
    ];

    it("should visit events", function () {
        testEvents(testSet[0]);
    });

    it("should visit referenced events", function () {
        testEvents(testSet[1]);
    });

    it("should visit transformed events", function () {
        testEvents(testSet[2]);
    });
});

