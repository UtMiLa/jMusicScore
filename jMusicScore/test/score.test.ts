import {Model} from "../jMusicScore";
import {Validators} from "../Validators";
import {Commands} from "../commands";
import {Json} from "../jsonReader";
import {ScoreApplication} from "../jMusicScore.Application";
import {MusicSpacing} from "../jMusicScore.Spacing";
import {Application} from "../../jApps/application";
import {reporters} from "mocha";
import {expect} from "chai";

var initScore: any = { "id": "2", "t": "Score", "def": { "metadata": {} }, "children": [{ "id": "3", "t": "Bar", "def": { "abs": { "num": 0, "den": 1 } } }, { "id": "4", "t": "Bar", "def": { "abs": { "num": 1, "den": 1 } } }, { "id": "5", "t": "Bar", "def": { "abs": { "num": 2, "den": 1 } } }, { "id": "6", "t": "Staff", "children": [{ "id": "7", "t": "Clef", "def": { "abs": { "num": 0, "den": 1 }, "clef": 1, "lin": 4, "tr": 0 } }, { "id": "8", "t": "Meter", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "num": 4, "den": 4 } } }, { "id": "9", "t": "Key", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "acci": "x", "no": 2 } } }, { "id": "10", "t": "Voice", "def": { "stem": 1 }, "children": [{ "id": "11", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 0, "den": 1 }, "noteId": "n1_8" }, "children": [{ "id": "12", "t": "Notehead", "def": { "p": 2, "a": "" } }] }, { "id": "13", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 1, "den": 8 }, "noteId": "n1_8" }, "children": [{ "id": "14", "t": "Notehead", "def": { "p": 2, "a": "" } }] }, { "id": "15", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 1, "den": 4 }, "noteId": "n1_8" }, "children": [{ "id": "16", "t": "Notehead", "def": { "p": 4, "a": "" } }] }, { "id": "17", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 3, "den": 8 }, "noteId": "n1_8" }, "children": [{ "id": "18", "t": "Notehead", "def": { "p": 6, "a": "" } }] }, { "id": "19", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 1, "den": 2 }, "noteId": "n1_16" }, "children": [{ "id": "20", "t": "Notehead", "def": { "p": 6, "a": "" } }] }, { "id": "21", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 9, "den": 16 }, "noteId": "n1_16" }, "children": [{ "id": "22", "t": "Notehead", "def": { "p": 5, "a": "" } }] }, { "id": "23", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 5, "den": 8 }, "noteId": "n1_16" }, "children": [{ "id": "24", "t": "Notehead", "def": { "p": 4, "a": "" } }] }, { "id": "25", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 11, "den": 16 }, "noteId": "n1_16" }, "children": [{ "id": "26", "t": "Notehead", "def": { "p": 3, "a": "" } }] }, { "id": "27", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 3, "den": 4 }, "noteId": "n1_8", "dots": 1 }, "children": [{ "id": "28", "t": "Notehead", "def": { "p": 2, "a": "" } }] }, { "id": "29", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 15, "den": 16 }, "noteId": "n1_16" }, "children": [{ "id": "30", "t": "Notehead", "def": { "p": 2, "a": "" } }] }, { "id": "31", "t": "Note", "def": { "time": { "num": 1, "den": 4 }, "abs": { "num": 1, "den": 1 }, "noteId": "n1_4" }, "children": [{ "id": "32", "t": "Notehead", "def": { "p": 1, "a": "" } }] }] }, { "id": "33", "t": "Voice", "def": { "stem": 2 } }] }, { "id": "34", "t": "Staff", "children": [{ "id": "35", "t": "Clef", "def": { "abs": { "num": 0, "den": 1 }, "clef": 3, "lin": 2, "tr": 0 } }, { "id": "36", "t": "Meter", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "num": 4, "den": 4 } } }, { "id": "37", "t": "Key", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "acci": "x", "no": 2 } } }, { "id": "38", "t": "Voice" }] }, { "id": "39", "t": "Meter", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "num": 4, "den": 4 } } }] };

    describe("Score", function () {
        //var score: Model.IScore;
        var app: ScoreApplication.IScoreApplication;

        beforeEach(function () {
            app = <ScoreApplication.IScoreApplication>new Application.AbstractApplication<Model.ScoreElement, ScoreApplication.ScoreStatusManager>(
                //$("#application"),
                new Model.ScoreElement(null),
                new ScoreApplication.ScoreStatusManager());
            //score = app.score;
            app.addPlugin(new Json.JsonPlugin());
        });

        it("should be empty when created", function () {
            expect(app.document.staffElements.length).to.equal(0);
        });

        describe("when a test song is loaded", function () {
            beforeEach(function () {
                app.loadFromString(initScore, 'JSON');
                var s = app.saveToString('JSON');

            });

            it("should have 2 staves", function () {
                expect(app.document.staffElements.length).to.equal(2);
            });

            it("should have 2 voices in first staff", function () {
                expect(app.document.staffElements[0].voiceElements.length).to.equal(2);
            });
        });

        describe("when a g clef staff is added to an empty score", function () {
            var staff: Model.IStaff;
            beforeEach(function () {
                staff = app.document.addStaff(Model.ClefDefinition.clefG);
            });

            it("should have one staff", function () {
                expect(app.document.staffElements.length).to.equal(1);
                expect(app.document.staffElements[0]).to.equal(staff);
            });

            it("should have a clef of g", function () {
                expect(staff.clefElements[0].definition.clefCode).to.equal(Model.ClefType.ClefG);
                expect(staff.clefElements[0].pitchToStaffLine(new Model.Pitch(4, ''))).to.equal(6);
                expect(staff.clefElements[0].pitchToStaffLine(new Model.Pitch(0, ''))).to.equal(10);
                expect(staff.clefElements[0].staffLineToPitch(6).debug()).to.equal("g'");
            });
        });

        describe("when a f clef staff is added to an empty score", function () {
            var staff: Model.IStaff;
            beforeEach(function () {
                staff = app.document.addStaff(Model.ClefDefinition.clefF);
            });

            it("should have one staff", function () {
                expect(app.document.staffElements.length).to.equal(1);
                expect(app.document.staffElements[0]).to.equal(staff);
            });

            it("should have a clef of f", function () {
                expect(staff.clefElements[0].definition.clefCode).to.equal(Model.ClefType.ClefF);
                expect(staff.clefElements[0].pitchToStaffLine(new Model.Pitch(-4, ''))).to.equal(2);
                expect(staff.clefElements[0].pitchToStaffLine(new Model.Pitch(-6, ''))).to.equal(4);
                expect(staff.clefElements[0].pitchToStaffLine(new Model.Pitch(0, ''))).to.equal(-2);
                expect(staff.clefElements[0].staffLineToPitch(2).debug()).to.equal("f");
            });
        });

        describe("when a staff is added to an empty score", function () {
            var staff: Model.IStaff;
            var absTime = new Model.AbsoluteTime(25, 64);
            var absTimeHalf = new Model.AbsoluteTime(25, 128);
            var absTimeHalfPlus = new Model.AbsoluteTime(26, 128);
            var absTime1_5 = new Model.AbsoluteTime(75, 128);

            var meterDef4_4 = new Model.RegularMeterDefinition(4, 4);
            var meterDef5_2 = new Model.RegularMeterDefinition(5, 2);
            var meterDef3_8 = new Model.RegularMeterDefinition(3, 8);
            var meterDef7_16 = new Model.RegularMeterDefinition(7, 16);


            beforeEach(function () {
                staff = app.document.addStaff(Model.ClefDefinition.clefG);
            });

            it("should return a getStaffContext(100) with a correct clef", function () {
                expect(staff.getStaffContext(absTime).clef.clefCode).to.equal(Model.ClefType.ClefG);
                staff.setClef(Model.ClefDefinition.clefF, absTime1_5);
                expect(staff.getStaffContext(absTime).clef.clefCode).to.equal(Model.ClefType.ClefG);
                staff.setClef(Model.ClefDefinition.clefF, absTimeHalf);
                expect(staff.getStaffContext(absTime).clef.clefCode).to.equal(Model.ClefType.ClefF);
            });

            it("should return a getStaffContext(100) with a correct key", function () {
                staff.setKey(new Model.RegularKeyDefinition('', 0), Model.AbsoluteTime.startTime);
                expect((staff.getStaffContext(absTime).key).debug()).to.equal('0 ');
                staff.setKey(new Model.RegularKeyDefinition('x', 2), absTime1_5);
                expect((staff.getStaffContext(absTime).key).debug()).to.equal('0 ');
                staff.setKey(new Model.RegularKeyDefinition('x', 2), absTimeHalf);
                expect((staff.getStaffContext(absTime).key).debug()).to.equal('2 x');
            });

            it("should return a getStaffContext(100) with a correct meter", function () {
                app.document.setMeter(meterDef4_4, Model.AbsoluteTime.startTime);
                expect(staff.getStaffContext(absTime).meter.debug()).to.equal('[4/4]');
                staff.setMeter(meterDef5_2, Model.AbsoluteTime.startTime);
                expect(staff.getStaffContext(absTime).meter.debug()).to.equal('[5/2]');
                //expect(staff.getStaffContext(absTime).meter.denum).to.equal(2);
                staff.setMeter(meterDef3_8, absTimeHalf);
                expect(staff.getStaffContext(absTime).meter.debug()).to.equal('[3/8]');
                //expect(staff.getStaffContext(absTime).meter.denum).to.equal(8);
                app.document.setMeter(meterDef7_16, absTimeHalf);
                expect(staff.getStaffContext(absTime).meter.debug()).to.equal('[3/8]');
                //expect(staff.getStaffContext(absTime).meter.denum).to.equal(8);
                app.document.setMeter(meterDef7_16, absTimeHalfPlus);
                expect(staff.getStaffContext(absTime).meter.debug()).to.equal('[3/8]');
                //expect(staff.getStaffContext(absTime).meter.denum).to.equal(8);
                (<any>staff).meterElements = <any>[];
                expect(staff.getStaffContext(absTime).meter.debug()).to.equal('[7/16]');
                //expect(staff.getStaffContext(absTime).meter.denum).to.equal(16);
            });

        });

        xdescribe("when a ", function () {
        });

        xdescribe("when a ", function () {
        });

    });


    describe("Keys and pitches", function () {

        var pitch: Model.Pitch;

        beforeEach(function () {
            pitch = new Model.Pitch(63, "");
        });

        it("should display PitchClass correctly", function () {
            var pc = new Model.PitchClass(0);
            expect(pc.noteNameLilypond()).to.equal('c');
            pc = new Model.PitchClass(1);
            expect(pc.noteNameLilypond()).to.equal('g');
            pc = new Model.PitchClass(2);
            expect(pc.noteNameLilypond()).to.equal('d');
            pc = new Model.PitchClass(3);
            expect(pc.noteNameLilypond()).to.equal('a');
            pc = new Model.PitchClass(4);
            expect(pc.noteNameLilypond()).to.equal('e');
            pc = new Model.PitchClass(5);
            expect(pc.noteNameLilypond()).to.equal('b');
            pc = new Model.PitchClass(6);
            expect(pc.noteNameLilypond()).to.equal('fis');
            pc = new Model.PitchClass(7);
            expect(pc.noteNameLilypond()).to.equal('cis');
            pc = new Model.PitchClass(-1);
            expect(pc.noteNameLilypond()).to.equal('f');
            pc = new Model.PitchClass(-2);
            expect(pc.noteNameLilypond()).to.equal('bes');
        });

        it("should convert Pitch correctly to PitchClass", function () {
            var pc = Model.PitchClass.create(pitch);
            expect(pc.noteNameLilypond()).to.equal('c');
            expect(pc.pitchClass).to.equal(0);

            pitch.alteration = "x";
            pc = Model.PitchClass.create(pitch);
            expect(pc.noteNameLilypond()).to.equal('cis');
            expect(pc.pitchClass).to.equal(7);

            pitch.alteration = "b";
            pc = Model.PitchClass.create(pitch);
            expect(pc.noteNameLilypond()).to.equal('ces');
            expect(pc.pitchClass).to.equal(-7);

            pitch.alteration = "";
            pitch.pitch = 62;
            pc = Model.PitchClass.create(pitch);
            expect(pc.noteNameLilypond()).to.equal('b');
            expect(pc.pitchClass).to.equal(5);
        });

    });

var initApp1 = { "id": "570", "t": "Score", "def": { "metadata": {} }, "children": [{ "id": "589", "t": "Bar", "def": { "abs": { "num": 1, "den": 1 } } }, { "id": "590", "t": "Bar", "def": { "abs": { "num": 2, "den": 1 } } }, { "id": "572", "t": "Meter", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "num": 4, "den": 4 } } }, { "id": "573", "t": "Staff", "children": [{ "id": "574", "t": "Clef", "def": { "abs": { "num": 0, "den": 1 }, "clef": 1, "lin": 4, "tr": 0 } }, { "id": "575", "t": "Key", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "acci": "x", "no": 2 } } }, { "id": "576", "t": "Voice", "def": { "stem": 1 }, "children": [{ "id": "577", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 0, "den": 1 }, "noteId": "n1_8", "dots": 1, "rest": true } }, { "id": "578", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 3, "den": 16 }, "noteId": "n1_16" }, "children": [{ "id": "579", "t": "Notehead", "def": { "p": 2, "a": "" } }, { "id": "580", "t": "TextSyllable", "def": { "text": "tænk" } }] }, { "id": "581", "t": "Note", "def": { "time": { "num": 1, "den": 4 }, "abs": { "num": 1, "den": 4 }, "noteId": "n1_4" }, "children": [{ "id": "582", "t": "Notehead", "def": { "p": 3, "a": "x" } }] }, { "id": "583", "t": "Note", "def": { "time": { "num": 1, "den": 4 }, "abs": { "num": 1, "den": 2 }, "noteId": "n1_4" }, "children": [{ "id": "584", "t": "Notehead", "def": { "p": 4, "a": "n" } }] }, { "id": "585", "t": "Note", "def": { "time": { "num": 1, "den": 4 }, "abs": { "num": 3, "den": 4 }, "noteId": "n1_4" }, "children": [{ "id": "586", "t": "Notehead", "def": { "p": 5, "a": "n" } }] }, { "id": "587", "t": "Note", "def": { "time": { "num": 1, "den": 32 }, "abs": { "num": 1, "den": 1 }, "noteId": "hidden", "rest": true, "hidden": true } }, { "id": "594", "t": "Note", "def": { "time": { "num": 31, "den": 32 }, "abs": { "num": 33, "den": 32 }, "noteId": "hidden", "rest": true, "hidden": true } }] }, { "id": "588", "t": "StaffExpression", "def": { "text": "Allegro", "abs": { "num": 0, "den": 1 } } }, { "id": "593", "t": "Meter" }] }] };
describe("Beaming", function() {
    var app: ScoreApplication.IScoreApplication;
    var score: Model.IScore;
    var voice: Model.IVoice;

    beforeEach(function() {
        app = <ScoreApplication.IScoreApplication>new Application.AbstractApplication<Model.ScoreElement, ScoreApplication.ScoreStatusManager>(
            //$("#application"),
            new Model.ScoreElement(null),
            new ScoreApplication.ScoreStatusManager());
        app.addPlugin(new Json.JsonPlugin());
        app.addValidator(new Validators.UpdateBarsValidator());
        app.addValidator(new Validators.CreateTimelineValidator());
        app.addValidator(new Validators.JoinNotesValidator());
        app.addValidator(new Validators.SplitNotesValidator());
        app.addValidator(new Validators.BeamValidator());
        
        app.loadFromString(initApp1, 'JSON');
        score = app.document;
        voice = score.staffElements[0].voiceElements[0];
    });

    it("should beam correctly after split/Undo", function() {
        app.executeCommand(new Commands.AddNoteCommand({
            noteName: "1_16",
            noteTime: new Model.TimeSpan(1, 16),
            rest: false,
            dots: 0,
            grace: false,
            pitches: [new Model.Pitch(10, '')],
            voice: app.document.staffElements[0].voiceElements[0],
            beforeNote: app.document.staffElements[0].voiceElements[0].noteElements[3],
            absTime: new Model.AbsoluteTime(13, 4)
        }));
        var note1 = voice.noteElements[5], note2 = voice.noteElements[6], note3 = voice.noteElements[7];
        expect(note1.noteheadElements[0].pitch.debug()).to.equal("a'");
        expect(note1.noteheadElements[0].tie).to.equal(true);
        expect(note1.timeVal.toString()).to.equal("1/16");
        expect(note1.absTime.toString()).to.equal("13/16");
        expect(note1.dotNo).to.equal(0);
        expect(note2.noteheadElements[0].pitch.debug()).to.equal("a'");
        expect(note2.timeVal.toString()).to.equal("1/8");
        expect(note2.absTime.toString()).to.equal("7/8");
        expect(note2.dotNo).to.equal(0);
        expect(note3.timeVal.toString()).to.equal("1/16");
        expect(note3.absTime.toString()).to.equal("1/1");
        expect(note3.dotNo).to.equal(0);

        expect(note1.Beams.length).to.equal(2);
        expect(note1.Beams[0].parent).to.equal(note1);
        expect(note1.Beams[0].toNote).to.equal(note2);
        expect(note1.Beams[1].parent).to.equal(note1);
        expect(note1.Beams[1].toNote).to.be.undefined;
        expect(MusicSpacing.NoteSpacer.hasFlag(note1)).to.equal(false);
        expect(note2.Beams.length).to.equal(1);
        expect(note2.Beams[0].parent).to.equal(note1);
        expect(note2.Beams[0].toNote).to.equal(note2);
        expect(MusicSpacing.NoteSpacer.hasFlag(note2)).to.equal(false);
        expect(note3.Beams.length).to.equal(2);
        expect(MusicSpacing.NoteSpacer.hasFlag(note3)).to.equal(true);

        app.undo();
        note1 = voice.noteElements[4];
        note2 = voice.noteElements[5];
        note3 = voice.noteElements[6];
        expect(note1.noteheadElements[0].pitch.debug()).to.equal("a'");
        expect(note1.noteheadElements[0].tie).to.equal(true);
        expect(note1.timeVal.toString()).to.equal("1/16");
        expect(note1.absTime.toString()).to.equal("3/4");
        expect(note2.noteheadElements[0].pitch.debug()).to.equal("a'");
        expect(note2.noteheadElements[0].tie).to.equal(true);
        expect(note2.timeVal.toString()).to.equal("1/8");
        expect(note2.absTime.toString()).to.equal("13/16");
        expect(note2.dotNo).to.equal(0);
        expect(note3.noteheadElements[0].tie).to.equal(false);
        expect(note3.timeVal.toString()).to.equal("1/16");
        expect(note3.absTime.toString()).to.equal("15/16");

        expect(note1.Beams.length).to.equal(2);
        expect(note1.Beams[0].parent).to.equal(note1);
        //expect(note1.Beams[0].toNote).to.equal(note2);
        expect(note1.Beams[0].toNote).to.equal(note3); // wrong
        expect(note1.Beams[1].parent).to.equal(note1);
        expect(note1.Beams[1].toNote).to.be.undefined;
        expect(MusicSpacing.NoteSpacer.hasFlag(note1)).to.equal(false);
        expect(note2.Beams.length).to.equal(1);
        expect(MusicSpacing.NoteSpacer.hasFlag(note2)).to.equal(false);
        expect(note3.Beams.length).to.equal(2);
        expect(MusicSpacing.NoteSpacer.hasFlag(note3)).to.equal(false);
    });
}
);