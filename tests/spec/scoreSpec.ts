import Model = JMusicScore.Model;

var initScore: any = { "id": "2", "t": "Score", "def": { "metadata": {} }, "children": [{ "id": "3", "t": "Bar", "def": { "abs": { "num": 0, "den": 1 } } }, { "id": "4", "t": "Bar", "def": { "abs": { "num": 1, "den": 1 } } }, { "id": "5", "t": "Bar", "def": { "abs": { "num": 2, "den": 1 } } }, { "id": "6", "t": "Staff", "children": [{ "id": "7", "t": "Clef", "def": { "abs": { "num": 0, "den": 1 }, "clef": 1, "lin": 4, "tr": 0 } }, { "id": "8", "t": "Meter", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "num": 4, "den": 4 } } }, { "id": "9", "t": "Key", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "acci": "x", "no": 2 } } }, { "id": "10", "t": "Voice", "def": { "stem": 1 }, "children": [{ "id": "11", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 0, "den": 1 }, "noteId": "n1_8" }, "children": [{ "id": "12", "t": "Notehead", "def": { "p": 2, "a": "" } }] }, { "id": "13", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 1, "den": 8 }, "noteId": "n1_8" }, "children": [{ "id": "14", "t": "Notehead", "def": { "p": 2, "a": "" } }] }, { "id": "15", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 1, "den": 4 }, "noteId": "n1_8" }, "children": [{ "id": "16", "t": "Notehead", "def": { "p": 4, "a": "" } }] }, { "id": "17", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 3, "den": 8 }, "noteId": "n1_8" }, "children": [{ "id": "18", "t": "Notehead", "def": { "p": 6, "a": "" } }] }, { "id": "19", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 1, "den": 2 }, "noteId": "n1_16" }, "children": [{ "id": "20", "t": "Notehead", "def": { "p": 6, "a": "" } }] }, { "id": "21", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 9, "den": 16 }, "noteId": "n1_16" }, "children": [{ "id": "22", "t": "Notehead", "def": { "p": 5, "a": "" } }] }, { "id": "23", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 5, "den": 8 }, "noteId": "n1_16" }, "children": [{ "id": "24", "t": "Notehead", "def": { "p": 4, "a": "" } }] }, { "id": "25", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 11, "den": 16 }, "noteId": "n1_16" }, "children": [{ "id": "26", "t": "Notehead", "def": { "p": 3, "a": "" } }] }, { "id": "27", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 3, "den": 4 }, "noteId": "n1_8", "dots": 1 }, "children": [{ "id": "28", "t": "Notehead", "def": { "p": 2, "a": "" } }] }, { "id": "29", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 15, "den": 16 }, "noteId": "n1_16" }, "children": [{ "id": "30", "t": "Notehead", "def": { "p": 2, "a": "" } }] }, { "id": "31", "t": "Note", "def": { "time": { "num": 1, "den": 4 }, "abs": { "num": 1, "den": 1 }, "noteId": "n1_4" }, "children": [{ "id": "32", "t": "Notehead", "def": { "p": 1, "a": "" } }] }] }, { "id": "33", "t": "Voice", "def": { "stem": 2 } }] }, { "id": "34", "t": "Staff", "children": [{ "id": "35", "t": "Clef", "def": { "abs": { "num": 0, "den": 1 }, "clef": 3, "lin": 2, "tr": 0 } }, { "id": "36", "t": "Meter", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "num": 4, "den": 4 } } }, { "id": "37", "t": "Key", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "acci": "x", "no": 2 } } }, { "id": "38", "t": "Voice" }] }, { "id": "39", "t": "Meter", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "num": 4, "den": 4 } } }] };
/*
    {
        "bars": [{ "absTime": 0 }, { "absTime": 256 }, { "absTime": 512 }], "staffElements": [{
            "clefElements": [{ "definition": [1, 4], "absTime": 0 }], "meterElements": [{ "definition": [4, 4], "absTime": 0 }], "keyElements": [{ "definition": ["x", 2], "absTime": 0 }], "voiceElements": [{
                "noteElements": [
                    { "noteId": "n1_8", beamspan: 1, "timeVal": 32, "noteheadElements": [{ "pitch": { "pitch": 2, "alteration": "" }, "dotNo": 0 }], "decorationElements": [], "syllableElements": [], "dotNo": 0, "absTime": 0, "rest": false, "stemDirection": 0 },
                    { "noteId": "n1_8", beamspan: -1, "timeVal": 32, "noteheadElements": [{ "pitch": { "pitch": 2, "alteration": "" }, "dotNo": 0 }], "decorationElements": [], "syllableElements": [], "dotNo": 0, "absTime": 32, "rest": false, "stemDirection": 0 },
                    { "noteId": "n1_8", beamspan: 0, "timeVal": 32, "noteheadElements": [{ "pitch": { "pitch": 4, "alteration": "" }, "dotNo": 0 }], "decorationElements": [], "syllableElements": [], "dotNo": 0, "absTime": 64, "rest": false, "stemDirection": 0 },
                    { "noteId": "n1_8", beamspan: 0, "timeVal": 32, "noteheadElements": [{ "pitch": { "pitch": 6, "alteration": "" }, "dotNo": 0 }], "decorationElements": [], "syllableElements": [], "dotNo": 0, "absTime": 96, "rest": false, "stemDirection": 0 },
                    { "noteId": "n1_16", beamspan: 3, "timeVal": 16, "noteheadElements": [{ "pitch": { "pitch": 6, "alteration": "" }, "dotNo": 0 }], "decorationElements": [], "syllableElements": [], "dotNo": 0, "absTime": 128, "rest": false, "stemDirection": 0 },
                    { "noteId": "n1_16", beamspan: -1, "timeVal": 16, "noteheadElements": [{ "pitch": { "pitch": 5, "alteration": "" }, "dotNo": 0 }], "decorationElements": [], "syllableElements": [], "dotNo": 0, "absTime": 144, "rest": false, "stemDirection": 0 },
                    { "noteId": "n1_16", beamspan: -1, "timeVal": 16, "noteheadElements": [{ "pitch": { "pitch": 4, "alteration": "" }, "dotNo": 0 }], "decorationElements": [], "syllableElements": [], "dotNo": 0, "absTime": 160, "rest": false, "stemDirection": 0 },
                    { "noteId": "n1_16", beamspan: -1, "timeVal": 16, "noteheadElements": [{ "pitch": { "pitch": 3, "alteration": "" }, "dotNo": 0 }], "decorationElements": [], "syllableElements": [], "dotNo": 0, "absTime": 176, "rest": false, "stemDirection": 0 },
                    { "noteId": "n1_8", beamspan: 1, "timeVal": 32, "noteheadElements": [{ "pitch": { "pitch": 2, "alteration": "" }, "dotNo": 1 }], "decorationElements": [], "syllableElements": [], "dotNo": 1, "absTime": 192, "rest": false, "stemDirection": 0 },
                    { "noteId": "n1_16", beamspan: -1, "timeVal": 16, "noteheadElements": [{ "pitch": { "pitch": 2, "alteration": "" }, "dotNo": 0 }], "decorationElements": [], "syllableElements": [], "dotNo": 0, "absTime": 240, "rest": false, "stemDirection": 0 },
                    { "noteId": "n1_4", beamspan: 0, "timeVal": 64, "noteheadElements": [{ "pitch": { "pitch": 1, "alteration": "" }, "dotNo": 0 }], "decorationElements": [], "syllableElements": [], "dotNo": 0, "absTime": 256, "rest": false, "stemDirection": 0 }
                ],
                "stemDirection": 1
            }, { "noteElements": [], "stemDirection": 2 }]
        }, { "clefElements": [{ "definition": [3, 2], "absTime": 0 }], "meterElements": [{ "definition": [4, 4], "absTime": 0 }], "keyElements": [{ "definition": ["x", 2], "absTime": 0 }], "voiceElements": [{ "noteElements": [], "stemDirection": 0 }] }], "meterElements": [{ "definition": [4, 4], "absTime": 0 }]
    };*/

    describe("Score", function () {
        //var score: jMusicScore.Model.IScore;
        var app: JMusicScore.ScoreApplication.IScoreApplication;

        beforeEach(function () {
            app = <JMusicScore.ScoreApplication.IScoreApplication>new JMusicScore.Application.AbstractApplication<JMusicScore.Model.ScoreElement, JMusicScore.ScoreApplication.ScoreStatusManager, JQuery>(
                $("#application"),
                new JMusicScore.Model.ScoreElement(null),
                new JMusicScore.ScoreApplication.ScoreStatusManager());
            //score = app.score;
            app.addPlugin(new JMusicScore.Model.JsonPlugin());
        });

        it("should be empty when created", function () {
            expect(app.document.staffElements.length).toEqual(0);
        });

        describe("when a test song is loaded", function () {
            beforeEach(function () {
                app.loadFromString(initScore, 'JSON');
                var s = app.saveToString('JSON');

            });

            it("should have 2 staves", function () {
                expect(app.document.staffElements.length).toEqual(2);
            });

            it("should have 2 voices in first staff", function () {
                expect(app.document.staffElements[0].voiceElements.length).toEqual(2);
            });
        });

        describe("when a g clef staff is added to an empty score", function () {
            var staff: JMusicScore.Model.IStaff;
            beforeEach(function () {
                staff = app.document.addStaff(JMusicScore.Model.ClefDefinition.clefG);
            });

            it("should have one staff", function () {
                expect(app.document.staffElements.length).toEqual(1);
                expect(app.document.staffElements[0]).toEqual(staff);
            });

            it("should have a clef of g", function () {
                expect(staff.clefElements[0].definition.clefCode).toEqual(JMusicScore.Model.ClefType.ClefG);
                expect(staff.clefElements[0].pitchToStaffLine(new JMusicScore.Model.Pitch(4, ''))).toEqual(6);
                expect(staff.clefElements[0].pitchToStaffLine(new JMusicScore.Model.Pitch(0, ''))).toEqual(10);
                expect(staff.clefElements[0].staffLineToPitch(6).debug()).toEqual("g'");
            });
        });

        describe("when a f clef staff is added to an empty score", function () {
            var staff: JMusicScore.Model.IStaff;
            beforeEach(function () {
                staff = app.document.addStaff(JMusicScore.Model.ClefDefinition.clefF);
            });

            it("should have one staff", function () {
                expect(app.document.staffElements.length).toEqual(1);
                expect(app.document.staffElements[0]).toEqual(staff);
            });

            it("should have a clef of f", function () {
                expect(staff.clefElements[0].definition.clefCode).toEqual(JMusicScore.Model.ClefType.ClefF);
                expect(staff.clefElements[0].pitchToStaffLine(new JMusicScore.Model.Pitch(-4, ''))).toEqual(2);
                expect(staff.clefElements[0].pitchToStaffLine(new JMusicScore.Model.Pitch(-6, ''))).toEqual(4);
                expect(staff.clefElements[0].pitchToStaffLine(new JMusicScore.Model.Pitch(0, ''))).toEqual(-2);
                expect(staff.clefElements[0].staffLineToPitch(2).debug()).toEqual("f");
            });
        });

        describe("when a staff is added to an empty score", function () {
            var staff: JMusicScore.Model.IStaff;
            var absTime = new JMusicScore.Model.AbsoluteTime(25, 64);
            var absTimeHalf = new JMusicScore.Model.AbsoluteTime(25, 128);
            var absTimeHalfPlus = new JMusicScore.Model.AbsoluteTime(26, 128);
            var absTime1_5 = new JMusicScore.Model.AbsoluteTime(75, 128);

            var meterDef4_4 = new JMusicScore.Model.RegularMeterDefinition(4, 4);
            var meterDef5_2 = new JMusicScore.Model.RegularMeterDefinition(5, 2);
            var meterDef3_8 = new JMusicScore.Model.RegularMeterDefinition(3, 8);
            var meterDef7_16 = new JMusicScore.Model.RegularMeterDefinition(7, 16);


            beforeEach(function () {
                staff = app.document.addStaff(JMusicScore.Model.ClefDefinition.clefG);
            });

            it("should return a getStaffContext(100) with a correct clef", function () {
                expect(staff.getStaffContext(absTime).clef.definition.clefCode).toEqual(JMusicScore.Model.ClefType.ClefG);
                staff.setClef(JMusicScore.Model.ClefDefinition.clefF, absTime1_5);
                expect(staff.getStaffContext(absTime).clef.definition.clefCode).toEqual(JMusicScore.Model.ClefType.ClefG);
                staff.setClef(JMusicScore.Model.ClefDefinition.clefF, absTimeHalf);
                expect(staff.getStaffContext(absTime).clef.definition.clefCode).toEqual(JMusicScore.Model.ClefType.ClefF);
            });

            it("should return a getStaffContext(100) with a correct key", function () {
                staff.setKey(new JMusicScore.Model.RegularKeyDefinition('', 0), JMusicScore.Model.AbsoluteTime.startTime);
                expect((staff.getStaffContext(absTime).key.definition).debug()).toEqual('0 ');
                staff.setKey(new JMusicScore.Model.RegularKeyDefinition('x', 2), absTime1_5);
                expect((staff.getStaffContext(absTime).key.definition).debug()).toEqual('0 ');
                staff.setKey(new JMusicScore.Model.RegularKeyDefinition('x', 2), absTimeHalf);
                expect((staff.getStaffContext(absTime).key.definition).debug()).toEqual('2 x');
            });

            it("should return a getStaffContext(100) with a correct meter", function () {
                app.document.setMeter(meterDef4_4, JMusicScore.Model.AbsoluteTime.startTime);
                expect(staff.getStaffContext(absTime).meter.debug()).toEqual('[4/4]');
                staff.setMeter(meterDef5_2, JMusicScore.Model.AbsoluteTime.startTime);
                expect(staff.getStaffContext(absTime).meter.debug()).toEqual('[5/2]');
                //expect(staff.getStaffContext(absTime).meter.denum).toEqual(2);
                staff.setMeter(meterDef3_8, absTimeHalf);
                expect(staff.getStaffContext(absTime).meter.debug()).toEqual('[3/8]');
                //expect(staff.getStaffContext(absTime).meter.denum).toEqual(8);
                app.document.setMeter(meterDef7_16, absTimeHalf);
                expect(staff.getStaffContext(absTime).meter.debug()).toEqual('[3/8]');
                //expect(staff.getStaffContext(absTime).meter.denum).toEqual(8);
                app.document.setMeter(meterDef7_16, absTimeHalfPlus);
                expect(staff.getStaffContext(absTime).meter.debug()).toEqual('[3/8]');
                //expect(staff.getStaffContext(absTime).meter.denum).toEqual(8);
                (<any>staff).meterElements = <any>[];
                expect(staff.getStaffContext(absTime).meter.debug()).toEqual('[7/16]');
                //expect(staff.getStaffContext(absTime).meter.denum).toEqual(16);
            });

        });

        xdescribe("when a ", function () {
        });

        xdescribe("when a ", function () {
        });

    });


    describe("Keys and pitches", function () {

        var pitch: JMusicScore.Model.Pitch;

        beforeEach(function () {
            pitch = new JMusicScore.Model.Pitch(63, "");
        });

        it("should display PitchClass correctly", function () {
            var pc = new JMusicScore.Model.PitchClass(0);
            expect(pc.noteNameLilypond()).toEqual('c');
            pc = new JMusicScore.Model.PitchClass(1);
            expect(pc.noteNameLilypond()).toEqual('g');
            pc = new JMusicScore.Model.PitchClass(2);
            expect(pc.noteNameLilypond()).toEqual('d');
            pc = new JMusicScore.Model.PitchClass(3);
            expect(pc.noteNameLilypond()).toEqual('a');
            pc = new JMusicScore.Model.PitchClass(4);
            expect(pc.noteNameLilypond()).toEqual('e');
            pc = new JMusicScore.Model.PitchClass(5);
            expect(pc.noteNameLilypond()).toEqual('b');
            pc = new JMusicScore.Model.PitchClass(6);
            expect(pc.noteNameLilypond()).toEqual('fis');
            pc = new JMusicScore.Model.PitchClass(7);
            expect(pc.noteNameLilypond()).toEqual('cis');
            pc = new JMusicScore.Model.PitchClass(-1);
            expect(pc.noteNameLilypond()).toEqual('f');
            pc = new JMusicScore.Model.PitchClass(-2);
            expect(pc.noteNameLilypond()).toEqual('bes');
        });

        it("should convert Pitch correctly to PitchClass", function () {
            var pc = JMusicScore.Model.PitchClass.create(pitch);
            expect(pc.noteNameLilypond()).toEqual('c');
            expect(pc.pitchClass).toEqual(0);

            pitch.alteration = "x";
            pc = JMusicScore.Model.PitchClass.create(pitch);
            expect(pc.noteNameLilypond()).toEqual('cis');
            expect(pc.pitchClass).toEqual(7);

            pitch.alteration = "b";
            pc = JMusicScore.Model.PitchClass.create(pitch);
            expect(pc.noteNameLilypond()).toEqual('ces');
            expect(pc.pitchClass).toEqual(-7);

            pitch.alteration = "";
            pitch.pitch = 62;
            pc = JMusicScore.Model.PitchClass.create(pitch);
            expect(pc.noteNameLilypond()).toEqual('b');
            expect(pc.pitchClass).toEqual(5);
        });

    });

var initApp1 = { "id": "570", "t": "Score", "def": { "metadata": {} }, "children": [{ "id": "589", "t": "Bar", "def": { "abs": { "num": 1, "den": 1 } } }, { "id": "590", "t": "Bar", "def": { "abs": { "num": 2, "den": 1 } } }, { "id": "572", "t": "Meter", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "num": 4, "den": 4 } } }, { "id": "573", "t": "Staff", "children": [{ "id": "574", "t": "Clef", "def": { "abs": { "num": 0, "den": 1 }, "clef": 1, "lin": 4, "tr": 0 } }, { "id": "575", "t": "Key", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "acci": "x", "no": 2 } } }, { "id": "576", "t": "Voice", "def": { "stem": 1 }, "children": [{ "id": "577", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 0, "den": 1 }, "noteId": "n1_8", "dots": 1, "rest": true } }, { "id": "578", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 3, "den": 16 }, "noteId": "n1_16" }, "children": [{ "id": "579", "t": "Notehead", "def": { "p": 2, "a": "" } }, { "id": "580", "t": "TextSyllable", "def": { "text": "tænk" } }] }, { "id": "581", "t": "Note", "def": { "time": { "num": 1, "den": 4 }, "abs": { "num": 1, "den": 4 }, "noteId": "n1_4" }, "children": [{ "id": "582", "t": "Notehead", "def": { "p": 3, "a": "x" } }] }, { "id": "583", "t": "Note", "def": { "time": { "num": 1, "den": 4 }, "abs": { "num": 1, "den": 2 }, "noteId": "n1_4" }, "children": [{ "id": "584", "t": "Notehead", "def": { "p": 4, "a": "n" } }] }, { "id": "585", "t": "Note", "def": { "time": { "num": 1, "den": 4 }, "abs": { "num": 3, "den": 4 }, "noteId": "n1_4" }, "children": [{ "id": "586", "t": "Notehead", "def": { "p": 5, "a": "n" } }] }, { "id": "587", "t": "Note", "def": { "time": { "num": 1, "den": 32 }, "abs": { "num": 1, "den": 1 }, "noteId": "hidden", "rest": true, "hidden": true } }, { "id": "594", "t": "Note", "def": { "time": { "num": 31, "den": 32 }, "abs": { "num": 33, "den": 32 }, "noteId": "hidden", "rest": true, "hidden": true } }] }, { "id": "588", "t": "StaffExpression", "def": { "text": "Allegro", "abs": { "num": 0, "den": 1 } } }, { "id": "593", "t": "Meter" }] }] };
describe("Beaming", function() {
    var app: JMusicScore.ScoreApplication.IScoreApplication;
    var score: JMusicScore.Model.IScore;
    var voice: JMusicScore.Model.IVoice;

    beforeEach(function() {
        app = <JMusicScore.ScoreApplication.IScoreApplication>new JMusicScore.Application.AbstractApplication<JMusicScore.Model.ScoreElement, JMusicScore.ScoreApplication.ScoreStatusManager, JQuery>(
            $("#application"),
            new JMusicScore.Model.ScoreElement(null),
            new JMusicScore.ScoreApplication.ScoreStatusManager());
        app.addPlugin(new JMusicScore.Model.JsonPlugin());
        app.addValidator(new Model.UpdateBarsValidator());
        app.addValidator(new Model.CreateTimelineValidator());
        app.addValidator(new Model.JoinNotesValidator());
        app.addValidator(new Model.SplitNotesValidator());
        app.addValidator(new Model.BeamValidator());
        
        app.loadFromString(initApp1, 'JSON');
        score = app.document;
        voice = score.staffElements[0].voiceElements[0];
    });

    it("should beam correctly after split/Undo", function() {
        app.executeCommand(new Model.AddNoteCommand({
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
        expect(JMusicScore.MusicSpacing.NoteSpacer.hasFlag(note1)).toEqual(false);
        expect(note2.Beams.length).toEqual(1);
        expect(note2.Beams[0].parent).toEqual(note1);
        expect(note2.Beams[0].toNote).toEqual(note2);
        expect(JMusicScore.MusicSpacing.NoteSpacer.hasFlag(note2)).toEqual(false);
        expect(note3.Beams.length).toEqual(2);
        expect(JMusicScore.MusicSpacing.NoteSpacer.hasFlag(note3)).toEqual(true);

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
        expect(JMusicScore.MusicSpacing.NoteSpacer.hasFlag(note1)).toEqual(false);
        expect(note2.Beams.length).toEqual(1);
        expect(JMusicScore.MusicSpacing.NoteSpacer.hasFlag(note2)).toEqual(false);
        expect(note3.Beams.length).toEqual(2);
        expect(JMusicScore.MusicSpacing.NoteSpacer.hasFlag(note3)).toEqual(false);
    });
    });