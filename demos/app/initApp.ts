module JMusicScore {
    var app = <ScoreApplication.IScoreApplication>new Application.Application<Model.ScoreElement, ScoreApplication.ScoreStatusManager, JQuery>(
        $("#appContainer"),
        new Model.ScoreElement(null),
        new ScoreApplication.ScoreStatusManager());

    /* JSONReader */
    app.addPlugin(new MusicXml.MusicXmlPlugin());
    app.addPlugin(new Lilypond.LilypondPlugin());
    app.addPlugin(new Model.JsonPlugin());

    app.addValidator(new Model.UpdateBarsValidator());
    app.addValidator(new Model.CreateTimelineValidator());
    app.addValidator(new Model.SplitNotesValidator());
    app.addValidator(new Model.JoinNotesValidator());
    app.addValidator(new Model.BeamValidator());
    app.addValidator(new Model.TieValidator());
    app.addValidator(new Model.UpdateAccidentalsValidator());

    app.addValidator(new GhostElements.GhostsValidator());
    
    app.addFileManager(new Application.ServerFileManager("/Handler.ashx", "Server (ashx)"));
    app.addFileManager(new Application.ServerFileManager("/Handler.php", "Server (PHP)"));
    app.addFileManager(new Application.LocalStorageFileManager("Local"));
    //UtMiLa.application.LoadUsing("Esajas40.xml", "Server", "MusicXML");

    var mus = {
        "id": "89", "t": "Score", "def": { "metadata": {} },
        "children": [
            { "id": "168", "t": "Bar", "def": { "abs": { "num": 1, "den": 1 } } },
            { "id": "169", "t": "Bar", "def": { "abs": { "num": 7, "den": 4 } } },
            { "id": "92", "t": "Meter", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "num": 4, "den": 4 } } },
            { "id": "93", "t": "Meter", "def": { "abs": { "num": 1, "den": 1 }, "def": { "t": "Regular", "num": 3, "den": 4 } } },
            {
                "id": "94", "t": "Staff",
                "children": [
                    { "id": "95", "t": "Clef", "def": { "abs": { "num": 0, "den": 1 }, "clef": 1, "lin": 4, "tr": 0 } },
                    { "id": "96", "t": "Clef", "def": { "abs": { "num": 1, "den": 1 }, "clef": 2, "lin": 3, "tr": 0 } },
                    { "id": "97", "t": "Key", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "acci": "x", "no": 2 } } },
                    { "id": "98", "t": "Key", "def": { "abs": { "num": 1, "den": 1 }, "def": { "t": "Regular", "acci": "b", "no": 3 } } },
                    {
                        "id": "99", "t": "Voice", "def": { "stem": 1 },
                        "children": [
                            { "id": "100", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 0, "den": 1 }, "noteId": "n1_8", "dots": 1, "rest": true } },
                            {
                                "id": "101", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 3, "den": 16 }, "noteId": "n1_16" }, "children": [{ "id": "102", "t": "Notehead", "def": { "p": 2, "a": "" } },
                                    { "id": "156", "t": "TextSyllable", "def": { "text": "tænk " } },
                                    { "id": "159", "t": "NoteLongDecoration", "def": { "type": 3, "dur": { "num": 5, "den": 16 } } },
                                    { "id": "166", "t": "NoteLongDecoration", "def": { "type": 1, "dur": { "num": 5, "den": 16 } } }]
                            },
                            { "id": "103", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 1, "den": 4 }, "noteId": "n1_8" }, "children": [{ "id": "104", "t": "Notehead", "def": { "p": 4, "a": "" } }, { "id": "157", "t": "TextSyllable", "def": { "text": "på " } }] },
                            { "id": "105", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 3, "den": 8 }, "noteId": "n1_8" }, "children": [{ "id": "106", "t": "Notehead", "def": { "p": 6, "a": "" } }, { "id": "158", "t": "TextSyllable", "def": { "text": "teks-" } }] },
                            { "id": "107", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 1, "den": 2 }, "noteId": "n1_8", "grace": "normal" }, "children": [{ "id": "108", "t": "Notehead", "def": { "p": 5, "a": "" } }, { "id": "162", "t": "TextSyllable", "def": { "text": "ten" } }] },
                            {
                                "id": "109", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 1, "den": 2 }, "noteId": "n1_16" }, "children": [{ "id": "110", "t": "Notehead", "def": { "p": 4, "a": "" } }, { "id": "111", "t": "Notehead", "def": { "p": 6, "a": "" } },
                                { "id": "167", "t": "NoteLongDecoration", "def": { "type": 2, "dur": { "num": 3, "den": 16 } } }]
                            },
                            { "id": "112", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 9, "den": 16 }, "noteId": "n1_16" }, "children": [{ "id": "113", "t": "Notehead", "def": { "p": 2, "a": "", "tie": true } }, { "id": "114", "t": "Notehead", "def": { "p": 5, "a": "" } }] },
                            { "id": "115", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 5, "den": 8 }, "noteId": "n1_16" }, "children": [{ "id": "116", "t": "Notehead", "def": { "p": 2, "a": "" } }, { "id": "117", "t": "Notehead", "def": { "p": 4, "a": "" } }] },
                            { "id": "118", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 11, "den": 16 }, "noteId": "n1_16" }, "children": [{ "id": "119", "t": "Notehead", "def": { "p": 1, "a": "" } }, { "id": "120", "t": "Notehead", "def": { "p": 3, "a": "" } }] },
                            { "id": "121", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 3, "den": 4 }, "noteId": "n1_8", "dots": 2 }, "children": [{ "id": "122", "t": "Notehead", "def": { "p": 2, "a": "" } }] },
                            { "id": "123", "t": "Note", "def": { "time": { "num": 1, "den": 32 }, "abs": { "num": 31, "den": 32 }, "noteId": "n1_32" }, "children": [{ "id": "124", "t": "Notehead", "def": { "p": 2, "a": "" } }] },
                            { "id": "125", "t": "Note", "def": { "time": { "num": 1, "den": 4 }, "abs": { "num": 1, "den": 1 }, "noteId": "n1_4" }, "children": [{ "id": "126", "t": "Notehead", "def": { "p": 1, "a": "" } }] },
                            { "id": "127", "t": "Note", "def": { "time": { "num": 1, "den": 4 }, "abs": { "num": 5, "den": 4 }, "noteId": "n1_4" }, "children": [{ "id": "128", "t": "Notehead", "def": { "p": 3, "a": "" } }] },
                            { "id": "129", "t": "Note", "def": { "time": { "num": 1, "den": 4 }, "abs": { "num": 3, "den": 2 }, "noteId": "n1_4" }, "children": [{ "id": "130", "t": "Notehead", "def": { "p": 5, "a": "" } }] }]
                    },
                    {
                        "id": "131", "t": "Voice", "def": { "stem": 2 },
                        "children": [
                            { "id": "132", "t": "Note", "def": { "time": { "num": 1, "den": 1 }, "abs": { "num": 0, "den": 1 }, "noteId": "hidden", "rest": true, "hidden": true } },
                        { "id": "133", "t": "Note", "def": { "time": { "num": 3, "den": 4 }, "abs": { "num": 1, "den": 1 }, "noteId": "hidden", "rest": true, "hidden": true } }]
                    },
                    { "id": "150", "t": "Meter" },
                    { "id": "151", "t": "Meter" },
                    { "id": "163", "t": "StaffExpression", "def": { "text": "Allegro", "abs": { "num": 0, "den": 1 } } }]
            },
            {
                "id": "134", "t": "Staff",
                "children": [
                    { "id": "135", "t": "Clef", "def": { "abs": { "num": 0, "den": 1 }, "clef": 3, "lin": 2, "tr": 0 } },
                    { "id": "136", "t": "Key", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "acci": "x", "no": 2 } } },
                    { "id": "137", "t": "Key", "def": { "abs": { "num": 1, "den": 1 }, "def": { "t": "Regular", "acci": "b", "no": 3 } } },
                    {
                        "id": "138", "t": "Voice", "def": { "stem": 1 },
                        "children": [
                            { "id": "139", "t": "Note", "def": { "time": { "num": 1, "den": 1 }, "abs": { "num": 0, "den": 1 }, "noteId": "hidden", "rest": true, "hidden": true } }, { "id": "140", "t": "Note", "def": { "time": { "num": 3, "den": 4 }, "abs": { "num": 1, "den": 1 }, "noteId": "hidden", "rest": true, "hidden": true } }
                        ]
                    },
                    { "id": "152", "t": "Meter" },
                    { "id": "153", "t": "Meter" }]
            }]
    };
    app.loadFromString(mus, 'JSON');

    $(function() {
        /* Menus */
        app.addPlugin(new CanvasView.CanvasViewer($('#svgArea')));
        //app.AddPlugin(new SvgView.SVGViewer($('#svgArea')));
        app.addPlugin(new SvgView.HintAreaPlugin());

        app.addPlugin(new Ui.ToolbarPlugin());

        app.addPlugin(new Ui.FileMenuPlugin());
        app.addPlugin(new Ui.VoiceMenuPlugin(app));
        app.addPlugin(new Ui.ExportMenuPlugin());

        app.addPlugin(new Ui.StavesMenuPlugin(app));

        app.addPlugin(new Editors.KeybordInputPlugin());
        app.addPlugin(new Editors.MidiInputPlugin());
        app.registerEventProcessor(new Editors.MidiEditor()); // "midiNoteOff", 

        /** test **/

        app.addPlugin(new Ui.QuickMenuPlugin("LoadSavedMenu", "Load Saved", "TestMenu", "Test", function() { app.loadUsing('saved.xml', 'Server', 'JSON'); }));
        app.addPlugin(new Ui.QuickMenuPlugin("SaveSavedMenu", "Save Saved", "TestMenu", "Test", function() { app.saveUsing('saved.xml', 'Server', 'JSON'); }));
        app.addPlugin(new Ui.QuickMenuPlugin("UpdateAllMenu", "Update all", "TestMenu", "Test", function() {
            app.executeCommand({
                execute: (app: ScoreApplication.IScoreApplication) => {},
                undo: (app: ScoreApplication.IScoreApplication) => {}
            });
        }));
        app.addPlugin(new Ui.QuickMenuPlugin("TestHideHintMenu", "Hint show/hide", "TestMenu", "Test", function() { $('.overlay').toggle(); }));
        app.addPlugin(new Ui.QuickMenuPlugin("TestSlurMenu", "Create slur", "TestMenu", "Test", function() {
            var note1 = app.document.staffElements[0].voiceElements[0].noteElements[1];
            var note2 = app.document.staffElements[0].voiceElements[0].noteElements[4];
            note1.addChild(note1.longDecorationElements, new Model.NoteLongDecorationElement(note1, note2.absTime.diff(note1.absTime), Model.LongDecorationType.Slur));
            app.executeCommand({
                execute: (app: ScoreApplication.IScoreApplication) => {}
            });
        }));
        app.addPlugin(new Ui.QuickMenuPlugin("TestCrescMenu", "Create cresc.", "TestMenu", "Test", function() {
            var note1 = app.document.staffElements[0].voiceElements[0].noteElements[1];
            var note2 = app.document.staffElements[0].voiceElements[0].noteElements[4];
            note1.addChild(note1.longDecorationElements, new Model.NoteLongDecorationElement(note1, note2.absTime.diff(note1.absTime), Model.LongDecorationType.Cresc));
            var note3 = app.document.staffElements[0].voiceElements[0].noteElements[5];
            var note4 = app.document.staffElements[0].voiceElements[0].noteElements[8];
            note3.addChild(note3.longDecorationElements, new Model.NoteLongDecorationElement(note3, note4.absTime.diff(note3.absTime), Model.LongDecorationType.Decresc));
            app.executeCommand({
                execute: (app: ScoreApplication.IScoreApplication) => {}
            });
        }));
        app.addPlugin(new Ui.QuickMenuPlugin("TestStaffExpMenu", "Create Allegro", "TestMenu", "Test", function() {
            var staff1 = app.document.staffElements[0];
            staff1.setStaffExpression("Allegro", Model.AbsoluteTime.startTime);
            app.executeCommand({
                execute: (app: ScoreApplication.IScoreApplication) => {}
            });
        }));
        app.addPlugin(new Ui.QuickMenuPlugin("TripletMenu", "Add triplets", "TestMenu", "Test", function() {
            var cmd = new Model.AddNoteCommand(
            {
                noteName: '1_4',
                noteTime: Model.TimeSpan.quarterNote,
                rest: false,
                dots: 0,
                grace: false,
                pitches: [new Model.Pitch(-10, '')],
                voice: app.document.staffElements[1].voiceElements[0],
                beforeNote: null,
                absTime: Model.AbsoluteTime.startTime,
                tuplet: new Model.TupletDef(Model.TimeSpan.halfNote, new Model.Rational(2, 3))
            });
            app.executeCommand(cmd);
            cmd = new Model.AddNoteCommand(
            {
                noteName: '1_4',
                noteTime: Model.TimeSpan.quarterNote,
                rest: false,
                dots: 0,
                grace: false,
                pitches: [new Model.Pitch(-9, '')],
                voice: app.document.staffElements[1].voiceElements[0],
                beforeNote: null,
                absTime: Model.AbsoluteTime.startTime,
                tuplet: new Model.TupletDef(Model.TimeSpan.halfNote, new Model.Rational(2, 3))
            });
            app.executeCommand(cmd);
            cmd = new Model.AddNoteCommand(
            {
                noteName: '1_4',
                noteTime: Model.TimeSpan.quarterNote,
                rest: false,
                dots: 0,
                grace: false,
                pitches: [new Model.Pitch(-8, '')],
                voice: app.document.staffElements[1].voiceElements[0],
                beforeNote: null,
                absTime: Model.AbsoluteTime.startTime,
                tuplet: new Model.TupletDef(Model.TimeSpan.halfNote, new Model.Rational(2, 3))
            });
            app.executeCommand(cmd);
        }));

        app.addPlugin(new Ui.QuickMenuPlugin("ClearBarsMenu", "Recalc bars", "TestMenu", "Test", function() {
            app.document.withBars((bar: Model.IBar, index: number) => { app.document.removeChild(bar); });
            app.executeCommand({
                execute: (app: ScoreApplication.IScoreApplication) => {}
            });
        }));
        app.addPlugin(new Ui.QuickMenuPlugin("DebugTextMenu", "Debug to lyrics", "TestMenu", "Test", function() {
            app.document.withVoices(function(voice, index) {
                voice.withNotes((note: Model.INote) => {
                    var staff = voice.parent;
                    var staffContext = staff.getStaffContext(note.absTime);
                    if (note.syllableElements.length) {
                        var text = note.syllableElements[0];
                        text.Text = staffContext.barNo + ':' + staffContext.timeInBar.toString();
                    }
                });
            });
            app.executeCommand({
                execute: (app: ScoreApplication.IScoreApplication) => {}
            });
        }));
        app.addPlugin(new Ui.QuickMenuPlugin("RecreateMenu", "Recreate score", "TestMenu", "Test", function() {
            app.document = <Model.IScore>Model.MusicElementFactory.recreateElement(null, app.document.getMemento());
            app.executeCommand({
                execute: (app: ScoreApplication.IScoreApplication) => {}
            });
        }));

        app.addPlugin(new Ui.QuickMenuPlugin("MacroMenu", "Export command stack", "TestMenu", "Test", () => {
            var res: string[] = [];
            $.each((<any>app).undoStack, (i: number, e: any) => {
                if (e.args) {
                    var macroDef = Model.MacroExporter.makeMacro(e); //e.macro();
                    var keyValues: string[] = [];
                    $.each(macroDef.args, (key: string, val: any) => {
                        keyValues.push(key + ': ' + val);
                    });
                    res.push(['app.executeCommand(new JMusicScore.Model.', macroDef.commandName, '({', keyValues.join(', '), '}));'].join(''));
                } else res.push("null");
            });
            new Ui.ShowTextDialog('menu', app).setText(res.join("\n")).show();
        }));
        app.addPlugin(new Ui.PianoPlugIn());
        
        app.addPlugin(new FinaleUi.FinaleSmartEditPlugin());
        //app.AddPlugin(new Players.MidiPlayer());

    });
} 