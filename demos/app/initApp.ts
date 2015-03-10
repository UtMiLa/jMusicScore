module jMusicScore {
    var app = <ScoreApplication.ScoreApplication>new Application.Application<Model.ScoreElement, ScoreApplication.ScoreStatusManager, JQuery>(
        $("#appContainer"),
        new Model.ScoreElement(null),
        new ScoreApplication.ScoreStatusManager());

    /* JSONReader */
    app.AddPlugin(new MusicXml.MusicXmlPlugin());
    app.AddPlugin(new Lilypond.LilypondPlugin());
    app.AddPlugin(new Model.JsonPlugin());

    //app.AddValidator(new Model.UpdateBarsValidator());
    app.AddValidator(new Model.CreateTimelineValidator());
    //app.AddValidator(new Model.JoinNotesValidator());
    //app.AddValidator(new Model.SplitNotesValidator());
    app.AddValidator(new Model.BeamValidator());
    app.AddValidator(new Model.TieValidator());
    app.AddValidator(new Model.UpdateAccidentalsValidator());

    app.AddValidator(new GhostElements.GhostsValidator());
    //app.AddDesigner(new MusicSpacing.SpacingDesigner());
    
    app.AddFileManager(new Application.ServerFileManager("/Handler.ashx", "Server (ashx)"));
    app.AddFileManager(new Application.ServerFileManager("/Handler.php", "Server (PHP)"));
    app.AddFileManager(new Application.LocalStorageFileManager("Local"));
    //UtMiLa.application.LoadUsing("Esajas40.xml", "Server", "MusicXML");
    //UtMiLa.application.LoadUsing("Dichterliebe01.xml", "Server", "MusicXML");
    //UtMiLa.application.LoadUsing("Fang os de ræve_3.xml", "Server", "MusicXML");//

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
    app.LoadFromString(mus, 'JSON');

    $(function () {
        /* Menus */
        app.AddPlugin(new CanvasView.CanvasViewer($('#svgArea')));
        //app.AddPlugin(new SvgView.SVGViewer($('#svgArea')));
        app.AddPlugin(new SvgView.HintAreaPlugin());

        app.AddPlugin(new UI.ToolbarPlugin());
        
        app.AddPlugin(new Menus.NewScorePlugin(app));
        app.AddPlugin(new Menus.OpenFileMenuPlugin());
        app.AddPlugin(new Menus.SaveAsFileMenuPlugin());
        app.AddPlugin(new Menus.SvgMenuPlugin());
        app.AddPlugin(new Menus.ExportMenuPlugin());
        app.AddPlugin(new Menus.VoiceMenuPlugin(app));


        app.AddPlugin(new Menus.StaffMenuPlugin());
        app.AddPlugin(new Editors.KeybordInputPlugin());
        app.AddPlugin(new Editors.MidiInputPlugin());
        app.RegisterEventProcessor(new Editors.MidiEditor()); // "midiNoteOff", 

        CreateMenus(app);// todo: encapsulate in class

        /** test **/

        app.AddPlugin(new Menus.QuickMenuPlugin("LoadSavedMenu", "Load Saved", "TestMenu", "Test", function () { app.LoadUsing('saved.xml', 'Server', 'JSON'); }));
        app.AddPlugin(new Menus.QuickMenuPlugin("SaveSavedMenu", "Save Saved", "TestMenu", "Test", function () { app.SaveUsing('saved.xml', 'Server', 'JSON'); }));
        app.AddPlugin(new Menus.QuickMenuPlugin("UpdateAllMenu", "Update all", "TestMenu", "Test", function () {
            app.ExecuteCommand({
                Execute: (app: ScoreApplication.ScoreApplication) => { },
                Undo: (app: ScoreApplication.ScoreApplication) => { }
            });
        }));
        app.AddPlugin(new Menus.QuickMenuPlugin("MeasureMapMenu", "Show Measure Map", "TestMenu", "Test", function () {
            var events: Model.ITimedEvent[] = this.parent.getEvents();
            events.sort(Model.Music.compareEvents);
            $('#events').empty();
            for (var i = 0; i < events.length; i++) {
                $('#events').append('<li>' + events[i].absTime.ToString() + ": " + events[i].debug() + '</li>');
            }
        }));
        app.AddPlugin(new Menus.QuickMenuPlugin("TestFileDlgMenu", "File Dialog", "TestMenu", "Test", function () { new Menus.FileDialog("open", app).Show(); }));
        app.AddPlugin(new Menus.QuickMenuPlugin("TestHideHintMenu", "Hint show/hide", "TestMenu", "Test", function () { $('.overlay').toggle(); }));
        //app.AddPlugin(new Menus.QuickMenuPlugin("TestShowCanvasMenu", "Show on Canvas (gl)", "TestMenu", "Test", function () { CanvasView.ShowExperimentalCanvas(app.score); }));
        //    app.AddPlugin(new Menus.QuickMenuPlugin("TestShowCanvasMenu", "Show on Canvas", "TestMenu", "Test", function () { CanvasView.ShowExperimentalCanvas1(app.score); }));
        app.AddPlugin(new Menus.QuickMenuPlugin("TestSlurMenu", "Create slur", "TestMenu", "Test", function () {
            var note1 = app.document.staffElements[0].voiceElements[0].noteElements[1];
            var note2 = app.document.staffElements[0].voiceElements[0].noteElements[4];
            note1.addChild(note1.longDecorationElements, new Model.NoteLongDecorationElement(note1, note2.absTime.Diff(note1.absTime), Model.LongDecorationType.slur));
            app.ExecuteCommand({
                Execute: (app: ScoreApplication.ScoreApplication) => { }
            });
        }));
        app.AddPlugin(new Menus.QuickMenuPlugin("TestCrescMenu", "Create cresc.", "TestMenu", "Test", function () {
            var note1 = app.document.staffElements[0].voiceElements[0].noteElements[1];
            var note2 = app.document.staffElements[0].voiceElements[0].noteElements[4];
            note1.addChild(note1.longDecorationElements, new Model.NoteLongDecorationElement(note1, note2.absTime.Diff(note1.absTime), Model.LongDecorationType.cresc));
            var note3 = app.document.staffElements[0].voiceElements[0].noteElements[5];
            var note4 = app.document.staffElements[0].voiceElements[0].noteElements[8];
            note3.addChild(note3.longDecorationElements, new Model.NoteLongDecorationElement(note3, note4.absTime.Diff(note3.absTime), Model.LongDecorationType.decresc));
            app.ExecuteCommand({
                Execute: (app: ScoreApplication.ScoreApplication) => { }
            });
        }));
        app.AddPlugin(new Menus.QuickMenuPlugin("TestStaffExpMenu", "Create Allegro", "TestMenu", "Test", function () {
            var staff1 = app.document.staffElements[0];
            staff1.setStaffExpression("Allegro", Model.AbsoluteTime.startTime);
            app.ExecuteCommand({
                Execute: (app: ScoreApplication.ScoreApplication) => { }
            });
        }));
        app.AddPlugin(new Menus.QuickMenuPlugin("TripletMenu", "Add triplets", "TestMenu", "Test", function () {
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
            app.ExecuteCommand(cmd);
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
            app.ExecuteCommand(cmd);
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
            app.ExecuteCommand(cmd);
        }));

        app.AddPlugin(new Menus.QuickMenuPlugin("ClearBarsMenu", "Recalc bars", "TestMenu", "Test", function () {
            app.document.withBars((bar: Model.IBar, index: number) => { app.document.removeChild(bar); });
            app.ExecuteCommand({
                Execute: (app: ScoreApplication.ScoreApplication) => { }
            });
        }));
        app.AddPlugin(new Menus.QuickMenuPlugin("MementoTextMenu", "Show memento", "TestMenu", "Test", function () {
            var memento = app.document.getMemento(true);
            $('#events').empty().text(JSON.stringify(memento));
        }));
        app.AddPlugin(new Menus.QuickMenuPlugin("DebugTextMenu", "Debug to lyrics", "TestMenu", "Test", function () {
            app.document.withVoices(function (voice, index) {
                voice.withNotes((note: Model.INote) => {
                    var staff = voice.parent;
                    var staffContext = staff.getStaffContext(note.absTime);
                    if (note.syllableElements.length) {
                        var text = note.syllableElements[0];
                        text.text = staffContext.barNo + ':' + staffContext.timeInBar.ToString();
                    }
                });
            });
            app.ExecuteCommand({
                Execute: (app: ScoreApplication.ScoreApplication) => { }
            });
        }));
        app.AddPlugin(new Menus.QuickMenuPlugin("RecreateMenu", "Recreate score", "TestMenu", "Test", function () {
            app.document = <Model.IScore>Model.MusicElementFactory.RecreateElement(null, app.document.getMemento());
            app.ExecuteCommand({
                Execute: (app: ScoreApplication.ScoreApplication) => { }
            });
        }));
        app.AddPlugin(new UI.PianoPlugIn());

        app.AddPlugin(new FinaleUI.FinaleSmartEditPlugin());
        app.AddPlugin(new Players.MidiPlayer());
    });
} 