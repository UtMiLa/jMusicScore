import {IKeyDefCreator, IKeyDefinition, IMemento, IMeterDefCreator, IMeterDefinition, IVisitorIterator,
    AbsoluteTime, ClefDefinition, ClefType, HorizPosition, KeyDefinitionFactory, LongDecorationType, 
    MeterDefinitionFactory, NoteDecorationKind, NoteType, OffsetMeterDefinition, Pitch, PitchClass, 
    Rational, RegularKeyDefinition, RegularMeterDefinition, StaffContext, StemDirectionType, TimeSpan, TupletDef} from '../jm-base'
import { IMusicElement, IMeterSpacingInfo,  IMeter, ScoreElement, 
    IVisitor, IVoice, IStaff, IScore, ILongDecorationElement, ISpacingInfo, 
     IClefSpacingInfo, Point, INotehead, INote, INoteHeadSpacingInfo, INoteSpacingInfo,
    INoteDecorationElement, INoteDecorationSpacingInfo, IVoiceSpacingInfo, IKeySpacingInfo,
    IStaffSpacingInfo, IScoreSpacingInfo, ITextSyllableElement, ITextSyllableSpacingInfo, IBar, IBarSpacingInfo,
    IBeam, IBeamSpacingInfo, IStaffExpression, IStaffExpressionSpacingInfo, IClef, IKey, 
    NoteDecorationElement, TextSyllableElement, MusicElementFactory, TransposeElement,
    NoteLongDecorationElement, ITimedEvent, Music, GlobalContext, INoteInfo } from "../jm-model";  

import  { IScoreApplication, ScoreStatusManager } from '../jm-application';
import  { AbstractApplication } from '../jap-application';
import  { MusicSpacing } from '../jm-spacing';
import  { JsonHelper } from '../jm-json';


describe("Mementos", function () {
    //var score: IScore;
    //var app: IScoreApplication;
    var globalContext = new GlobalContext();
    var document: IScore;

    it("should create an empty score", function () {
        const data = <any>{ "id": "2", "t": "Score", "def": { "metadata": {} }, "children": [] };
        const elm: any = MusicElementFactory.recreateElement(null, data);
        expect(elm.getElementName()).toEqual("Score");
        expect(elm.staffElements.length).toEqual(0);
    });
    it("should create an empty staff", function () {
        const data = <any>{ "id": "2", "t": "Staff", "def": { "metadata": {} }, "children": [] };
        const elm: any = MusicElementFactory.recreateElement(null, data);
        expect(elm.getElementName()).toEqual("Staff");
        expect(elm.voiceElements.length).toEqual(0);
    });
    it("should create a score with one empty staff", function () {
        const data = <any>{ "id": "3", "t": "Score", "def": { "metadata": {} }, "children": [{ "id": "3", "t": "Staff", "def": { "metadata": {} }, "children": [] }] };
        const elm: any = MusicElementFactory.recreateElement(null, data);
        expect(elm.getElementName()).toEqual("Score");
        expect(elm.staffElements.length).toEqual(1);
    });
    it("should create an empty voice", function () {
        const data = <any>{ "id": "2", "t": "Voice", "def": { "metadata": {} }, "children": [] };
        const elm: any = MusicElementFactory.recreateElement(null, data);
        expect(elm.getElementName()).toEqual("Voice");
        expect(elm.getNoteElements().length).toEqual(0);
    });
    it("should create an empty sequence", function () {
        const data = <any>{ "id": "2", "t": "Sequence", "def": { "metadata": {} }, "children": [] };
        const elm: any = MusicElementFactory.recreateElement(null, data);
        expect(elm.getElementName()).toEqual("Sequence");
        expect(elm.getNoteElements().length).toEqual(0);
    });
    /*it("should create a note with one head", function () {
        const data = <any>{ "id": "11", "t": "Note",
            "def": { "time": { "num": 1, "den": 8 }, "abs": {"num": 0, "den": 1 }, "noteId": "n1_8" },
            "children": [{
                    "id": "12",
                    "t": "Notehead",
                    "def": {
                        "p": 2,
                        "a": ""
                    }
                }
            ]
        };
        const elm = <INote>MusicElementFactory.recreateElement(null, data);
        expect(elm.getElementName()).toEqual("Note");
        expect(elm.timeVal.toString()).toEqual("1/8");
        expect(elm.noteheadElements.length).toEqual(1);
        expect(elm.noteheadElements[0].getElementName()).toEqual("Notehead");
        expect(elm.noteheadElements[0].pitch.pitch.toString()).toEqual("e");
    });*/

    it("should create a voice with one note", function () {
        const data = <any>{ "id": "2", "t": "Voice", "def": { "metadata": {} }, "children": [{ "id": "11", "t": "Note",
        "def": { "time": { "num": 1, "den": 8 }, "abs": {"num": 0, "den": 1 }, "noteId": "n1_8" },
        "children": [{
                "id": "12",
                "t": "Notehead",
                "def": {
                    "p": 2,
                    "a": ""
                }
            }
        ]
    }] };
        const elm: any = MusicElementFactory.recreateElement(null, data);
        expect(elm.getElementName()).toEqual("Voice");
        expect(elm.getNoteElements(globalContext).length).toEqual(1);
        const note = <INote>elm.getNoteElements(globalContext)[0];
        expect(note.getElementName()).toEqual("Note");
        expect(note.timeVal.toString()).toEqual("1/8");
        expect(note.noteheadElements.length).toEqual(1);
        expect(note.noteheadElements[0].getElementName()).toEqual("Notehead");
        expect(note.noteheadElements[0].pitch.debug()).toEqual("e'");
    });

    it("should create a voice with two notes", function () {
        const data = <any>{ "id": "2", "t": "Voice", "def": { "metadata": {} }, "children": [
            { "id": "11", "t": "Note",
                "def": { "time": { "num": 1, "den": 8 }, "noteId": "n1_8" },
                "children": [{
                        "id": "12",
                        "t": "Notehead",
                        "def": {
                            "p": 2,
                            "a": ""
                        }
                    }
                ]
            },
            { "id": "12", "t": "Note",
                "def": { "time": { "num": 1, "den": 4 }, "noteId": "n1_8" },
                "children": [{
                        "id": "12",
                        "t": "Notehead",
                        "def": {
                            "p": 3,
                            "a": ""
                        }
                    }
                ]
            }
        ] };
        const elm: any = MusicElementFactory.recreateElement(null, data);
        expect(elm.getElementName()).toEqual("Voice");
        expect(elm.getNoteElements(globalContext).length).toEqual(2);
        const note1 = <INote>elm.getNoteElements(globalContext)[0];
        expect(note1.getElementName()).toEqual("Note");
        expect(note1.timeVal.toString()).toEqual("1/8");
        expect(note1.noteheadElements.length).toEqual(1);
        expect(note1.noteheadElements[0].getElementName()).toEqual("Notehead");
        expect(note1.noteheadElements[0].pitch.debug()).toEqual("e'");

        const note2 = <INote>elm.getNoteElements(globalContext)[1];
        expect(note2.getElementName()).toEqual("Note");
        expect(note2.timeVal.toString()).toEqual("1/4");
        expect(note2.noteheadElements.length).toEqual(1);
        expect(note2.noteheadElements[0].getElementName()).toEqual("Notehead");
        expect(note2.noteheadElements[0].pitch.debug()).toEqual("f'");
    });



    it("should create a sequence with two notes", function () {
        const data = <any>{ "id": "2", "t": "Sequence", "def": {  }, "children": [
            { "id": "11", "t": "Note",
                "def": { "time": { "num": 1, "den": 8 }, "noteId": "n1_8" },
                "children": [{
                        "id": "12",
                        "t": "Notehead",
                        "def": {
                            "p": 2,
                            "a": ""
                        }
                    }
                ]
            },
            { "id": "12", "t": "Note",
                "def": { "time": { "num": 1, "den": 4 }, "noteId": "n1_8" },
                "children": [{
                        "id": "12",
                        "t": "Notehead",
                        "def": {
                            "p": 3,
                            "a": ""
                        }
                    }
                ]
            }
        ] };
        const elm: any = MusicElementFactory.recreateElement(null, data);
        expect(elm.getElementName()).toEqual("Sequence");
        expect(elm.getNoteElements(globalContext).length).toEqual(2);
        const note1 = <INote>elm.getNoteElements(globalContext)[0];
        expect(note1.getElementName()).toEqual("Note");
        expect(note1.timeVal.toString()).toEqual("1/8");
        expect(note1.noteheadElements.length).toEqual(1);
        expect(note1.noteheadElements[0].getElementName()).toEqual("Notehead");
        expect(note1.noteheadElements[0].pitch.debug()).toEqual("e'");

        const note2 = <INote>elm.getNoteElements(globalContext)[1];
        expect(note2.getElementName()).toEqual("Note");
        expect(note2.timeVal.toString()).toEqual("1/4");
        expect(note2.noteheadElements.length).toEqual(1);
        expect(note2.noteheadElements[0].getElementName()).toEqual("Notehead");
        expect(note2.noteheadElements[0].pitch.debug()).toEqual("f'");
    });



    it("should create a transposing sequence with two notes", function () {
        const data = <any>{
            "id": "2", "t": "Transpose", "def": { interval: 2, alteration: -1  /* minor third up */}, "children": [
                {"id": "2", "t": "Sequence", "def": {  }, "children": [
                { "id": "11", "t": "Note",
                    "def": { "time": { "num": 1, "den": 8 }, "noteId": "n1_8" },
                    "children": [{
                            "id": "12",
                            "t": "Notehead",
                            "def": {
                                "p": 2,
                                "a": ""
                            }
                        }
                    ]
                },
                { "id": "12", "t": "Note",
                    "def": { "time": { "num": 1, "den": 4 }, "noteId": "n1_8" },
                    "children": [{
                            "id": "12",
                            "t": "Notehead",
                            "def": {
                                "p": 3,
                                "a": ""
                            }
                        }
                    ]
                }
        ] } ] };
        const elm: TransposeElement = <any>MusicElementFactory.recreateElement(null, data);
        expect(elm.getElementName()).toEqual("Transpose");
        /*expect(elm.getNoteElements(globalContext).length).toEqual(2);
        const note1 = <INote>elm.getNoteElements(globalContext)[0];
        expect(note1.getElementName()).toEqual("Note");
        expect(note1.timeVal.toString()).toEqual("1/8");
        expect(note1.noteheadElements.length).toEqual(1);
        expect(note1.noteheadElements[0].getElementName()).toEqual("Notehead");
        expect(note1.noteheadElements[0].pitch.debug()).toEqual("e'");

        const note2 = <INote>elm.getNoteElements(globalContext)[1];
        expect(note2.getElementName()).toEqual("Note");
        expect(note2.timeVal.toString()).toEqual("1/4");
        expect(note2.noteheadElements.length).toEqual(1);
        expect(note2.noteheadElements[0].getElementName()).toEqual("Notehead");
        expect(note2.noteheadElements[0].pitch.debug()).toEqual("f'");*/

        const notes = elm.getEvents(globalContext);
        expect(notes.length).toEqual(2);
        const note1 = <INoteInfo>notes[0];
        const note2 = <INoteInfo>notes[1];
        expect(note1.heads.length).toEqual(1);
        expect(note1.heads[0].pitch.debug()).toEqual("g'");
        expect(note2.heads.length).toEqual(1);
        expect(note2.heads[0].pitch.debug()).toEqual("aes'");
    });


});