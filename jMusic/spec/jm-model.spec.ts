import {IKeyDefCreator, IKeyDefinition, IMemento, IMeterDefCreator, IMeterDefinition, IVisitorIterator,
    AbsoluteTime, ClefDefinition, ClefType, HorizPosition, KeyDefinitionFactory, LongDecorationType, 
    MeterDefinitionFactory, NoteDecorationKind, NoteType, OffsetMeterDefinition, Pitch, PitchClass, 
    Rational, RegularKeyDefinition, RegularMeterDefinition, StaffContext, StemDirectionType, TimeSpan, TupletDef, Interval, IntervalType} from '../jm-base'
import { IMusicElement, IMeterSpacingInfo,  IMeter, ScoreElement, 
    IVisitor, IVoice, IStaff, IScore, ILongDecorationElement, ISpacingInfo, 
     IClefSpacingInfo, Point, INotehead, INote, INoteHeadSpacingInfo, INoteSpacingInfo,
    INoteDecorationElement, INoteDecorationSpacingInfo, IVoiceSpacingInfo, IKeySpacingInfo,
    IStaffSpacingInfo, IScoreSpacingInfo, ITextSyllableElement, ITextSyllableSpacingInfo, IBar, IBarSpacingInfo,
    IBeam, IBeamSpacingInfo, IStaffExpression, IStaffExpressionSpacingInfo, IClef, IKey, 
    NoteDecorationElement, TextSyllableElement, 
    NoteLongDecorationElement, ITimedEvent, Music, MusicElementFactory, IdSequence, ISequence, GlobalContext } from "../model/jm-model";  

import  { IScoreApplication, ScoreStatusManager } from '../jm-application';
import  { AbstractApplication } from '../jap-application';
import  { MusicSpacing } from '../jm-spacing';
import  { JsonHelper } from '../jm-json';
import { VariableRef } from '../jm-ghost-elements';

var initScore: any = { "id": "2", "t": "Score", "def": { "metadata": {} }, "children": [{ "id": "3", "t": "Bar", "def": { "abs": { "num": 0, "den": 1 } } }, { "id": "4", "t": "Bar", "def": { "abs": { "num": 1, "den": 1 } } }, { "id": "5", "t": "Bar", "def": { "abs": { "num": 2, "den": 1 } } }, { "id": "6", "t": "Staff", "children": [{ "id": "7", "t": "Clef", "def": { "abs": { "num": 0, "den": 1 }, "clef": 1, "lin": 4, "tr": 0 } }, { "id": "8", "t": "Meter", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "num": 4, "den": 4 } } }, { "id": "9", "t": "Key", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "acci": "x", "no": 2 } } }, { "id": "10", "t": "Sequence", "def": { "stem": 1 }, "children": [{ "id": "11", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 0, "den": 1 }, "noteId": "n1_8" }, "children": [{ "id": "12", "t": "Notehead", "def": { "p": 2, "a": "" } }] }, { "id": "13", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 1, "den": 8 }, "noteId": "n1_8" }, "children": [{ "id": "14", "t": "Notehead", "def": { "p": 2, "a": "" } }] }, { "id": "15", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 1, "den": 4 }, "noteId": "n1_8" }, "children": [{ "id": "16", "t": "Notehead", "def": { "p": 4, "a": "" } }] }, { "id": "17", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 3, "den": 8 }, "noteId": "n1_8" }, "children": [{ "id": "18", "t": "Notehead", "def": { "p": 6, "a": "" } }] }, { "id": "19", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 1, "den": 2 }, "noteId": "n1_16" }, "children": [{ "id": "20", "t": "Notehead", "def": { "p": 6, "a": "" } }] }, { "id": "21", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 9, "den": 16 }, "noteId": "n1_16" }, "children": [{ "id": "22", "t": "Notehead", "def": { "p": 5, "a": "" } }] }, { "id": "23", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 5, "den": 8 }, "noteId": "n1_16" }, "children": [{ "id": "24", "t": "Notehead", "def": { "p": 4, "a": "" } }] }, { "id": "25", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 11, "den": 16 }, "noteId": "n1_16" }, "children": [{ "id": "26", "t": "Notehead", "def": { "p": 3, "a": "" } }] }, { "id": "27", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 3, "den": 4 }, "noteId": "n1_8", "dots": 1 }, "children": [{ "id": "28", "t": "Notehead", "def": { "p": 2, "a": "" } }] }, { "id": "29", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 15, "den": 16 }, "noteId": "n1_16" }, "children": [{ "id": "30", "t": "Notehead", "def": { "p": 2, "a": "" } }] }, { "id": "31", "t": "Note", "def": { "time": { "num": 1, "den": 4 }, "abs": { "num": 1, "den": 1 }, "noteId": "n1_4" }, "children": [{ "id": "32", "t": "Notehead", "def": { "p": 1, "a": "" } }] }] }, { "id": "33", "t": "Voice", "def": { "stem": 2 } }] }, { "id": "34", "t": "Staff", "children": [{ "id": "35", "t": "Clef", "def": { "abs": { "num": 0, "den": 1 }, "clef": 3, "lin": 2, "tr": 0 } }, { "id": "36", "t": "Meter", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "num": 4, "den": 4 } } }, { "id": "37", "t": "Key", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "acci": "x", "no": 2 } } }, { "id": "38", "t": "Sequence" }] }, { "id": "39", "t": "Meter", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "num": 4, "den": 4 } } }] };

describe("Score", function () {
    //var score: IScore;
    //var app: IScoreApplication;
    var globalContext = new GlobalContext();
    var document: IScore;

    beforeEach(function () {
        /*app = <IScoreApplication>new AbstractApplication<ScoreElement, ScoreStatusManager>(
            //$("#application"),
            new ScoreElement(null),
            new ScoreStatusManager());
        //score = app.score;
        app.addPlugin(new JsonPlugin());*/
        VariableRef.register();
        document = new ScoreElement(null);
    });

    it("should be empty when created", function () {
        expect(document.staffElements.length).toEqual(0);
    });

    describe("when a test song is loaded", function () {
        beforeEach(function () {
            var helper = new JsonHelper();
            document = helper.read(initScore);            
            //var s = helper.write(document);
        });

        it("should have 2 staves", function () {
            expect(document.staffElements.length).toEqual(2);
        });

        it("should have 2 voices in first staff", function () {
            expect(document.staffElements[0].voiceElements.length).toEqual(2);
        });
        it("should have 11 notes in first voice", function () {
            expect(document.staffElements[0].voiceElements[0].getNoteElements(globalContext).length).toEqual(11);
        });
        it("should enumerate 11 notes in first voice", function () {
            let i = 0;
            document.staffElements[0].voiceElements[0].withNotes(globalContext, (note, index) => {
                i++;
            });
            expect(i).toEqual(11);
        });

    });

    describe("when a g clef staff is added to an empty score", function () {
        var staff: IStaff;
        beforeEach(function () {
            staff = document.addStaff(ClefDefinition.clefG);
        });

        it("should have one staff", function () {
            expect(document.staffElements.length).toEqual(1);
            expect(document.staffElements[0]).toEqual(staff);
        });

        it("should have a clef of g", function () {
            expect(staff.clefElements[0].definition.clefCode).toEqual(ClefType.ClefG);
            expect(staff.clefElements[0].pitchToStaffLine(new Pitch(4, ''))).toEqual(6);
            expect(staff.clefElements[0].pitchToStaffLine(new Pitch(0, ''))).toEqual(10);
            expect(staff.clefElements[0].staffLineToPitch(6).debug()).toEqual("g'");
        });
    });

    describe("when a f clef staff is added to an empty score", function () {
        var staff: IStaff;
        beforeEach(function () {
            staff = document.addStaff(ClefDefinition.clefF);
        });

        it("should have one staff", function () {
            expect(document.staffElements.length).toEqual(1);
            expect(document.staffElements[0]).toEqual(staff);
        });

        it("should have a clef of f", function () {
            expect(staff.clefElements[0].definition.clefCode).toEqual(ClefType.ClefF);
            expect(staff.clefElements[0].pitchToStaffLine(new Pitch(-4, ''))).toEqual(2);
            expect(staff.clefElements[0].pitchToStaffLine(new Pitch(-6, ''))).toEqual(4);
            expect(staff.clefElements[0].pitchToStaffLine(new Pitch(0, ''))).toEqual(-2);
            expect(staff.clefElements[0].staffLineToPitch(2).debug()).toEqual("f");
        });
    });

    describe("when a staff is added to an empty score", function () {
        var staff: IStaff;
        var absTime = new AbsoluteTime(25, 64);
        var absTimeHalf = new AbsoluteTime(25, 128);
        var absTimeHalfPlus = new AbsoluteTime(26, 128);
        var absTime1_5 = new AbsoluteTime(75, 128);

        var meterDef4_4 = new RegularMeterDefinition(4, 4);
        var meterDef5_2 = new RegularMeterDefinition(5, 2);
        var meterDef3_8 = new RegularMeterDefinition(3, 8);
        var meterDef7_16 = new RegularMeterDefinition(7, 16);


        beforeEach(function () {
            staff = document.addStaff(ClefDefinition.clefG);
        });

        it("should return a getStaffContext(100) with a correct clef", function () {
            expect(staff.getStaffContext(absTime).clef.clefCode).toEqual(ClefType.ClefG);
            staff.setClef(ClefDefinition.clefF, absTime1_5);
            expect(staff.getStaffContext(absTime).clef.clefCode).toEqual(ClefType.ClefG);
            staff.setClef(ClefDefinition.clefF, absTimeHalf);
            expect(staff.getStaffContext(absTime).clef.clefCode).toEqual(ClefType.ClefF);
        });

        it("should return a getStaffContext(100) with a correct key", function () {
            staff.setKey(new RegularKeyDefinition('', 0), AbsoluteTime.startTime);
            expect((staff.getStaffContext(absTime).key).debug()).toEqual('0 ');
            staff.setKey(new RegularKeyDefinition('x', 2), absTime1_5);
            expect((staff.getStaffContext(absTime).key).debug()).toEqual('0 ');
            staff.setKey(new RegularKeyDefinition('x', 2), absTimeHalf);
            expect((staff.getStaffContext(absTime).key).debug()).toEqual('2 x');
        });

        it("should return a getStaffContext(100) with a correct meter", function () {
            document.setMeter(meterDef4_4, AbsoluteTime.startTime);
            expect(staff.getStaffContext(absTime).meter.debug()).toEqual('4/4');
            staff.setMeter(meterDef5_2, AbsoluteTime.startTime);
            expect(staff.getStaffContext(absTime).meter.debug()).toEqual('5/2');
            staff.setMeter(meterDef3_8, absTimeHalf);
            expect(staff.getStaffContext(absTime).meter.debug()).toEqual('3/8');
            document.setMeter(meterDef7_16, absTimeHalf);
            expect(staff.getStaffContext(absTime).meter.debug()).toEqual('3/8');
            document.setMeter(meterDef7_16, absTimeHalfPlus);
            expect(staff.getStaffContext(absTime).meter.debug()).toEqual('3/8');
            //(<any>staff).meterElements = <any>[];
            var meters = (<any>staff).meterElements;
            for (var i = 0; i < meters.length; i++) staff.removeChild(meters[i]);
            expect(staff.getStaffContext(absTime).meter.debug()).toEqual('7/16');
        });

    });

    describe("when a variable is used", function () {
        let varVal = { id: "1", t: "Sequence", def: {}, children: [{ "id": "31", "t": "Note", "def": { "time": { "num": 1, "den": 4 }, "abs": { "num": 0, "den": 1 }, "noteId": "n1_4" }, "children": [{ "id": "32", "t": "Notehead", "def": { "p": 1, "a": "" } }] }] };
        let seq = { id: "2", t: "Sequence", def: {}, children: [
            { "id": "31", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 0, "den": 1 }, "noteId": "n1_16" }, "children": [{ "id": "32", "t": "Notehead", "def": { "p": -7, "a": "" } }] },
            { id:"33", t: "Variable", def: {name: 'minVar'}}
        ] };

        it("should insert the variable notes into the sequence", function () {
            //name: 'minVar'
            let staff = document.addStaff(ClefDefinition.clefG);
            let voice = staff.addVoice();
            let sequence = <ISequence>MusicElementFactory.recreateElement(voice, seq);
            let variable = <ISequence>MusicElementFactory.recreateElement(null, varVal);
            globalContext.addVariable("minVar", variable);
            let notes = sequence.getNoteElements(globalContext);
            expect(notes.length).toEqual(2);
            expect(notes[0].debug()).toEqual('Nn1_16(c ) ');
            expect(notes[1].debug()).toEqual("Nn1_4(d' ) ");
        });


    });

    xdescribe("when a ", function () {
    });

});


describe("Keys and pitches", function () {

    var pitch: Pitch;

    beforeEach(function () {
        pitch = new Pitch(63, "");
    });

    it("should display PitchClass correctly", function () {
        var pc = new PitchClass(0);
        expect(pc.noteNameLilypond()).toEqual('c');
        pc = new PitchClass(1);
        expect(pc.noteNameLilypond()).toEqual('g');
        pc = new PitchClass(2);
        expect(pc.noteNameLilypond()).toEqual('d');
        pc = new PitchClass(3);
        expect(pc.noteNameLilypond()).toEqual('a');
        pc = new PitchClass(4);
        expect(pc.noteNameLilypond()).toEqual('e');
        pc = new PitchClass(5);
        expect(pc.noteNameLilypond()).toEqual('b');
        pc = new PitchClass(6);
        expect(pc.noteNameLilypond()).toEqual('fis');
        pc = new PitchClass(7);
        expect(pc.noteNameLilypond()).toEqual('cis');
        pc = new PitchClass(-1);
        expect(pc.noteNameLilypond()).toEqual('f');
        pc = new PitchClass(-2);
        expect(pc.noteNameLilypond()).toEqual('bes');
    });

    it("should convert Pitch correctly to PitchClass", function () {
        var pc = PitchClass.create(pitch);
        expect(pc.noteNameLilypond()).toEqual('c');
        expect(pc.pitchClass).toEqual(0);

        pitch.alteration = "x";
        pc = PitchClass.create(pitch);
        expect(pc.noteNameLilypond()).toEqual('cis');
        expect(pc.pitchClass).toEqual(7);

        pitch.alteration = "b";
        pc = PitchClass.create(pitch);
        expect(pc.noteNameLilypond()).toEqual('ces');
        expect(pc.pitchClass).toEqual(-7);

        pitch.alteration = "";
        pitch.pitch = 62;
        pc = PitchClass.create(pitch);
        expect(pc.noteNameLilypond()).toEqual('b');
        expect(pc.pitchClass).toEqual(5);
    });

    it("should compute correct intervals from pitches", function() {
        var testData = [
            { pitch1: new Pitch(0,''), pitch2: new Pitch(0,''), res: '0 0' }, // c
            { pitch1: new Pitch(0,''), pitch2: new Pitch(1,''), res: '1 1' }, // d
            { pitch1: new Pitch(0,''), pitch2: new Pitch(2,''), res: '2 1' }, // e
            { pitch1: new Pitch(0,''), pitch2: new Pitch(3,''), res: '3 0' }, // f
            { pitch1: new Pitch(0,''), pitch2: new Pitch(4,''), res: '4 0' }, // g
            { pitch1: new Pitch(0,''), pitch2: new Pitch(5,''), res: '5 1' }, // a
            { pitch1: new Pitch(0,''), pitch2: new Pitch(6,''), res: '6 1' }, // b
            { pitch1: new Pitch(0,''), pitch2: new Pitch(7,''), res: '7 0' }, // c'
            { pitch1: new Pitch(0,''), pitch2: new Pitch(8,''), res: '8 1' }, // d'
            { pitch1: new Pitch(0,''), pitch2: new Pitch(0,'x'), res: '0 2' }, // cx
            { pitch1: new Pitch(0,''), pitch2: new Pitch(0,'b'), res: 'inv 0 2' }, // cb
            { pitch1: new Pitch(0,''), pitch2: new Pitch(4,'x'), res: '4 2' }, // gx
            /** test limits: 
             * pure -> small: f -> bb
             * pure -> large: g -> d
             * small -> dimi: db -> gb
             * dimi -> dbl dimi: dbb -> gbb
             * large -> augm: b -> fx
             * augm -> dbl augm: bx -> fxx
             *  */ 
            { pitch1: new Pitch(0,''), pitch2: new Pitch(6,'b'), res: '6 -1' }, // bb

            { pitch1: new Pitch(0,''), pitch2: new Pitch(1,'b'), res: '1 -1' }, // db
            { pitch1: new Pitch(0,''), pitch2: new Pitch(4,'b'), res: '4 -2' }, // gb
            { pitch1: new Pitch(0,''), pitch2: new Pitch(1,'bb'), res: '1 -2' }, // dbb
            { pitch1: new Pitch(0,''), pitch2: new Pitch(4,'bb'), res: '4 -3' }, // gbb
            { pitch1: new Pitch(0,''), pitch2: new Pitch(3,'x'), res: '3 2' }, // fx
            { pitch1: new Pitch(0,''), pitch2: new Pitch(6,'x'), res: '6 2' }, // bx
            { pitch1: new Pitch(0,''), pitch2: new Pitch(3,'xx'), res: '3 3' }, // fxx

            // test other pitch1's:
            { pitch1: new Pitch(1,''), pitch2: new Pitch(5,'b'), res: '4 -2' }, // d -> ab
            { pitch1: new Pitch(3,''), pitch2: new Pitch(6,''), res: '3 2' }, // f -> b
            { pitch1: new Pitch(6,''), pitch2: new Pitch(10,''), res: '4 -2' }, // b -> f'
            { pitch1: new Pitch(2,'b'), pitch2: new Pitch(3,'x'), res: '1 2' }, // eb -> fx
            { pitch1: new Pitch(3,'x'), pitch2: new Pitch(6,''), res: '3 0' }, // fx -> b

            // test reverse order:
            { pitch1: new Pitch(6,''), pitch2: new Pitch(3,''), res: 'inv 3 2' }, // b -> f
        ];

        for (var i = 0; i < testData.length; i++){
            var interval = Interval.fromPitches(testData[i].pitch1,  testData[i].pitch2);
            expect(interval.toString()).toEqual("Interval(" + testData[i].res + ")");
        }
    });

    
    it("should compute correct semitones and pitchclasses from intervals", function() {
        var testData = [
            { d: 0, i: new Interval(0, IntervalType.Pure), r: 0 },
            { d: -5, i: new Interval(1, IntervalType.Minor), r: 1 },
            { d: 2, i: new Interval(1, IntervalType.Major), r: 2 },
            { d: -3, i: new Interval(2, IntervalType.Minor), r: 3 },
            { d: 4, i: new Interval(2, IntervalType.Major), r: 4 },
            { d: -1, i: new Interval(3, IntervalType.Pure), r: 5 },
            { d: 1, i: new Interval(4, IntervalType.Pure), r: 7 },
            { d: -4, i: new Interval(5, IntervalType.Minor), r: 8 },
            { d: 3, i: new Interval(5, IntervalType.Major), r: 9 },
            { d: -2, i: new Interval(6, IntervalType.Minor), r: 10 },
            { d: 5, i: new Interval(6, IntervalType.Major), r: 11 },
            { d: 0, i: new Interval(7, IntervalType.Pure), r: 12 },
            { d: -5, i: new Interval(8, IntervalType.Minor), r: 13 },
            { d: 7, i: new Interval(0, IntervalType.Augmented), r: 1 },
            { d: 9, i: new Interval(1, IntervalType.Augmented), r: 3 },
            { d: 11, i: new Interval(2, IntervalType.Augmented), r: 5 },
            { d: 6, i: new Interval(3, IntervalType.Augmented), r: 6 },
            { d: 8, i: new Interval(4, IntervalType.Augmented), r: 8 },
            { d: 10, i: new Interval(5, IntervalType.Augmented), r: 10 },
            { d: 12, i: new Interval(6, IntervalType.Augmented), r: 12 },
            { d: -7, i: new Interval(0, IntervalType.Diminished), r: -1 },
            { d: -12, i: new Interval(1, IntervalType.Diminished), r: 0 },
            { d: -10, i: new Interval(2, IntervalType.Diminished), r: 2 },
            { d: -8, i: new Interval(3, IntervalType.Diminished), r: 4 },
            { d: -6, i: new Interval(4, IntervalType.Diminished), r: 6 },
            { d: -11, i: new Interval(5, IntervalType.Diminished), r: 7 },
            { d: -9, i: new Interval(6, IntervalType.Diminished), r: 9 },
            { d: -7, i: new Interval(7, IntervalType.Diminished), r: 11 },
        ];
        for(var i = 0; i < testData.length; i++){
            var res = testData[i].i;
            expect(res.semitones()).toEqual(testData[i].r);
            expect((<any>res).diffPc).toEqual(testData[i].d);
        }
    });


    
    it("should transpose pitches correctly", function() {
        var testData = [            
            { p: new Pitch(1, ''), i: new Interval(1, IntervalType.Major), rp: 2, ra: '' },
            { p: new Pitch(2, ''), i: new Interval(1, IntervalType.Major), rp: 3, ra: 'x' },
            { p: new Pitch(4, 'x'), i: new Interval(3, IntervalType.Augmented), rp: 7, ra: 'xx' },
            { p: new Pitch(5, 'b'), i: new Interval(3, IntervalType.Augmented), rp: 8, ra: '' },
            { p: new Pitch(2, ''), i: new Interval(1, IntervalType.Minor), rp: 3, ra: '' },
            { p: new Pitch(2, ''), i: new Interval(1, IntervalType.Diminished), rp: 3, ra: 'b' },
        ];
        for(var i = 0; i < testData.length; i++){
            var int = testData[i].i;
            var p =  testData[i].p;
            expect(p.add(int).pitch).toEqual(testData[i].rp);
            expect(p.add(int).alteration).toEqual(testData[i].ra);
        }
    });    


    
    it("should compute correct semitones and pitchclasses from intervals", function() {
        var testData = [
            { i1: new Interval(1, IntervalType.Major),   i2:  new Interval(1, IntervalType.Major),    res: '2 1'  }, // stor + stor = stor
            { i1: new Interval(2, IntervalType.Major),   i2:  new Interval(2, IntervalType.Major),    res: '4 2'  }, // stor + stor = forstørret
            { i1: new Interval(3, IntervalType.Pure),   i2:  new Interval(4, IntervalType.Pure),    res: '7 0'  }, // ren  + ren  = ren
            { i1: new Interval(4, IntervalType.Pure),   i2:  new Interval(4, IntervalType.Pure),    res: '8 1'  }, // ren  + ren  = stor
            { i1: new Interval(4, IntervalType.Pure),   i2:  new Interval(1, IntervalType.Minor),    res: '5 -1'  }, // ren  + lille = lille
            { i1: new Interval(3, IntervalType.Pure),   i2:  new Interval(1, IntervalType.Minor),    res: '4 -2'  }, // ren  + lille = formindsket
            { i1: new Interval(3, IntervalType.Pure),   i2:  new Interval(2, IntervalType.Major),    res: '5 1'  }, // ren  + stor = stor
            { i1: new Interval(3, IntervalType.Pure),   i2:  new Interval(1, IntervalType.Major),    res: '4 0'  }, // ren  + stor = ren
            { i1: new Interval(4, IntervalType.Pure),   i2:  new Interval(6, IntervalType.Major),    res: '10 2'  }, // ren  + stor = forstørret
            { i1: new Interval(1, IntervalType.Minor),   i2:  new Interval(1, IntervalType.Minor),    res: '2 -2'  }, // lille + lille = formindsket
            { i1: new Interval(1, IntervalType.Minor),   i2:  new Interval(1, IntervalType.Major),    res: '2 -1'  }, // lille + stor = lille
            { i1: new Interval(2, IntervalType.Minor),   i2:  new Interval(2, IntervalType.Major),    res: '4 0'  }, // lille + stor = ren
        ];
        for(var i = 0; i < testData.length; i++){
            var i1 = testData[i].i1;
            var i2 = testData[i].i2;
            expect(i1.addInterval(i2).toString()).toEqual('Interval(' + testData[i].res + ')');
        }
    });
});
/*
var initApp1 = { "id": "570", "t": "Score", "def": { "metadata": {} }, "children": [{ "id": "589", "t": "Bar", "def": { "abs": { "num": 1, "den": 1 } } }, { "id": "590", "t": "Bar", "def": { "abs": { "num": 2, "den": 1 } } }, { "id": "572", "t": "Meter", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "num": 4, "den": 4 } } }, { "id": "573", "t": "Staff", "children": [{ "id": "574", "t": "Clef", "def": { "abs": { "num": 0, "den": 1 }, "clef": 1, "lin": 4, "tr": 0 } }, { "id": "575", "t": "Key", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "acci": "x", "no": 2 } } }, { "id": "576", "t": "Voice", "def": { "stem": 1 }, "children": [{ "id": "577", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 0, "den": 1 }, "noteId": "n1_8", "dots": 1, "rest": true } }, { "id": "578", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 3, "den": 16 }, "noteId": "n1_16" }, "children": [{ "id": "579", "t": "Notehead", "def": { "p": 2, "a": "" } }, { "id": "580", "t": "TextSyllable", "def": { "text": "tænk" } }] }, { "id": "581", "t": "Note", "def": { "time": { "num": 1, "den": 4 }, "abs": { "num": 1, "den": 4 }, "noteId": "n1_4" }, "children": [{ "id": "582", "t": "Notehead", "def": { "p": 3, "a": "x" } }] }, { "id": "583", "t": "Note", "def": { "time": { "num": 1, "den": 4 }, "abs": { "num": 1, "den": 2 }, "noteId": "n1_4" }, "children": [{ "id": "584", "t": "Notehead", "def": { "p": 4, "a": "n" } }] }, { "id": "585", "t": "Note", "def": { "time": { "num": 1, "den": 4 }, "abs": { "num": 3, "den": 4 }, "noteId": "n1_4" }, "children": [{ "id": "586", "t": "Notehead", "def": { "p": 5, "a": "n" } }] }, { "id": "587", "t": "Note", "def": { "time": { "num": 1, "den": 32 }, "abs": { "num": 1, "den": 1 }, "noteId": "hidden", "rest": true, "hidden": true } }, { "id": "594", "t": "Note", "def": { "time": { "num": 31, "den": 32 }, "abs": { "num": 33, "den": 32 }, "noteId": "hidden", "rest": true, "hidden": true } }] }, { "id": "588", "t": "StaffExpression", "def": { "text": "Allegro", "abs": { "num": 0, "den": 1 } } }, { "id": "593", "t": "Meter" }] }] };
describe("Beaming", function() {
    var app: IScoreApplication;
    var score: IScore;
    var voice: IVoice;

    beforeEach(function() {
        app = <IScoreApplication>new AbstractApplication<ScoreElement, ScoreStatusManager>(
            //$("#application"),
            new ScoreElement(null),
            new ScoreStatusManager());
        app.addPlugin(new JsonPlugin());
        app.addValidator(new UpdateBarsValidator());
        app.addValidator(new CreateTimelineValidator());
        app.addValidator(new JoinNotesValidator());
        app.addValidator(new SplitNotesValidator());
        app.addValidator(new BeamValidator());
        
        app.loadFromString(initApp1, 'JSON');
        score = app.document;
        voice = score.staffElements[0].voiceElements[0];
    });

    it("should beam correctly after split/Undo", function() {
        app.executeCommand(new AddNoteCommand({
            noteName: "1_16",
            noteTime: new TimeSpan(1, 16),
            rest: false,
            dots: 0,
            grace: false,
            pitches: [new Pitch(10, '')],
            voice: app.document.staffElements[0].voiceElements[0],
            beforeNote: app.document.staffElements[0].voiceElements[0].noteElements[3],
            absTime: new AbsoluteTime(13, 4)
        }));
        var note1 = voice.noteElements[5], note2 = voice.noteElements[6], note3 = voice.noteElements[7];
        expect(note1.noteheadElements[0].pitch.debug()).toEqual("a'");
        expect(note1.noteheadElements[0].tie).toEqual(true);
        expect(note1.timeVal.toString()).toEqual("1/16");
        expect(note1.absTime.toString()).toEqual("13/16");
        expect(note1.dotNo).toEqual(0);
        expect(note2.noteheadElements[0].pitch.debug()).toEqual("a'");
        expect(note2.timeVal.toString()).toEqual("1/8");
        expect(note2.absTime.toString()).toEqual("7/8");
        expect(note2.dotNo).toEqual(0);
        expect(note3.timeVal.toString()).toEqual("1/16");
        expect(note3.absTime.toString()).toEqual("1/1");
        expect(note3.dotNo).toEqual(0);

        expect(note1.Beams.length).toEqual(2);
        expect(note1.Beams[0].parent).toEqual(note1);
        expect(note1.Beams[0].toNote).toEqual(note2);
        expect(note1.Beams[1].parent).toEqual(note1);
        expect(note1.Beams[1].toNote).toBeFalsy();
        expect(MusicSpacing.NoteSpacer.hasFlag(note1)).toEqual(false);
        expect(note2.Beams.length).toEqual(1);
        expect(note2.Beams[0].parent).toEqual(note1);
        expect(note2.Beams[0].toNote).toEqual(note2);
        expect(MusicSpacing.NoteSpacer.hasFlag(note2)).toEqual(false);
        expect(note3.Beams.length).toEqual(2);
        expect(MusicSpacing.NoteSpacer.hasFlag(note3)).toEqual(true);

        app.undo();
        note1 = voice.noteElements[4];
        note2 = voice.noteElements[5];
        note3 = voice.noteElements[6];
        expect(note1.noteheadElements[0].pitch.debug()).toEqual("a'");
        expect(note1.noteheadElements[0].tie).toEqual(true);
        expect(note1.timeVal.toString()).toEqual("1/16");
        expect(note1.absTime.toString()).toEqual("3/4");
        expect(note2.noteheadElements[0].pitch.debug()).toEqual("a'");
        expect(note2.noteheadElements[0].tie).toEqual(true);
        expect(note2.timeVal.toString()).toEqual("1/8");
        expect(note2.absTime.toString()).toEqual("13/16");
        expect(note2.dotNo).toEqual(0);
        expect(note3.noteheadElements[0].tie).toEqual(false);
        expect(note3.timeVal.toString()).toEqual("1/16");
        expect(note3.absTime.toString()).toEqual("15/16");

        expect(note1.Beams.length).toEqual(2);
        expect(note1.Beams[0].parent).toEqual(note1);
        //expect(note1.Beams[0].toNote).toEqual(note2);
        expect(note1.Beams[0].toNote).toEqual(note3); // wrong
        expect(note1.Beams[1].parent).toEqual(note1);
        expect(note1.Beams[1].toNote).toBeFalsy();
        expect(MusicSpacing.NoteSpacer.hasFlag(note1)).toEqual(false);
        expect(note2.Beams.length).toEqual(1);
        expect(MusicSpacing.NoteSpacer.hasFlag(note2)).toEqual(false);
        expect(note3.Beams.length).toEqual(2);
        expect(MusicSpacing.NoteSpacer.hasFlag(note3)).toEqual(false);
    });
});    */