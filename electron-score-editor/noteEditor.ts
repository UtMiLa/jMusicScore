// / <reference path="jApps/jApps.d.ts" />
// / <reference path="jMusicScore/jMusicScore.d.ts" />
// / <reference path="../JApps/Scripts/typings/jquery/jquery.d.ts" />
//var JApps = import("jApps/jApps");

module JMusicScore {
    
        class MusicConfiguration extends JApps.Configuration.ConfigurationManager<Model.IScore, ScoreApplication.ScoreStatusManager> {
            constructor(app: ScoreApplication.IScoreApplication) {
                super(app);
    
                this.addConfiguration(new JApps.Configuration.PluginConfiguration("MusicXml", MusicXml.MusicXmlPlugin));
                this.addConfiguration(new JApps.Configuration.PluginConfiguration("Lilypond", Lilypond.LilypondPlugin));
                this.addConfiguration(new JApps.Configuration.PluginConfiguration("JSON", Model.JsonPlugin));
                this.addConfiguration(new JApps.Configuration.ValidatorConfiguration("Update Bars", Model.UpdateBarsValidator));
                this.addConfiguration(new JApps.Configuration.ValidatorConfiguration("CreateTimelineValidator", Model.CreateTimelineValidator));
                this.addConfiguration(new JApps.Configuration.ValidatorConfiguration("JoinNotesValidator", Model.JoinNotesValidator));
                this.addConfiguration(new JApps.Configuration.ValidatorConfiguration("SplitNotesValidator", Model.SplitNotesValidator));
                this.addConfiguration(new JApps.Configuration.ValidatorConfiguration("BeamValidator", Model.BeamValidator));
                this.addConfiguration(new JApps.Configuration.ValidatorConfiguration("TieValidator", Model.TieValidator));
                this.addConfiguration(new JApps.Configuration.ValidatorConfiguration("UpdateAccidentals", Model.UpdateAccidentalsValidator));
                this.addConfiguration(new JApps.Configuration.ValidatorConfiguration("GhostsValidator", GhostElements.GhostsValidator));
                this.addConfiguration(new JApps.Configuration.ValidatorConfiguration("UpdateBarsValidator", Model.UpdateBarsValidator));
    
                this.addConfiguration(new JApps.Configuration.FileManagerConfiguration("Aspx handler", () => { return new JApps.IO.ServerFileManager("/Handler.ashx", "Server (ashx)"); }));
                this.addConfiguration(new JApps.Configuration.FileManagerConfiguration("PHP handler", () => { return new JApps.IO.ServerFileManager("/Handler.php", "Server (PHP)"); }));
                this.addConfiguration(new JApps.Configuration.FileManagerConfiguration("Local", () => { return new JApps.IO.LocalStorageFileManager("Local"); }));
    
                this.addConfiguration(new JApps.Configuration.PluginConfiguration("CanvasView", () => { return new CanvasView.CanvasViewer($('#svgArea'), $("#appContainer")); }));
                this.addConfiguration(new JApps.Configuration.PluginConfiguration("SvgView", () => { return new SvgView.SvgViewer($('#svgArea'), $("#appContainer")); }));
                this.addConfiguration(new JApps.Configuration.PluginConfiguration("SvgView.HintAreaPlugin", SvgView.HintAreaPlugin));
                this.addConfiguration(new JApps.Configuration.PluginConfiguration("Ui.ToolbarPlugin", Ui.ToolbarPlugin));
                this.addConfiguration(new JApps.Configuration.PluginConfiguration("Ui.FileMenuPlugin", Ui.FileMenuPlugin));
                this.addConfiguration(new JApps.Configuration.PluginConfiguration("Ui.ExportMenuPlugin", Ui.ExportMenuPlugin));/**/
            }
        }
    
        var app = <ScoreApplication.IScoreApplication>new JApps.Application.AbstractApplication<Model.ScoreElement, ScoreApplication.ScoreStatusManager>(
            new Model.ScoreElement(null),
            new ScoreApplication.ScoreStatusManager());
    
    
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
    
        $(function() {
    
            var conf = new MusicConfiguration(app);
    
    
            /* Menus */
            //app.addPlugin(new CanvasView.CanvasViewer($('#svgArea'), $("#appContainer")));
            //app.addPlugin(new SvgView.SvgViewer($('#svgArea'), $("#appContainer")));
            conf.disableConfiguration("CanvasView");
            
            app.addPlugin(new Ui.VoiceMenuPlugin(app));
            
            app.addPlugin(new Ui.StavesMenuPlugin(app));
    
            app.addPlugin(new JApps.Editors.KeybordInputPlugin());
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
            //app.addPlugin(new Ui.PianoPlugIn());
            //app.addPlugin(new ScriptRunner.ScriptRunnerPlugIn());
    
            app.addPlugin(new FinaleUi.FinaleSmartEditPlugin());
            //app.AddPlugin(new Players.MidiPlayer());
            
            var jMusicActions: JApps.UI.ActionCollection = {
                FileNew: { caption: "New", action: () => { app.executeCommand(new JMusicScore.Model.ClearScoreCommand({})); }, type: JApps.UI.ActionType.execute },
                FileLoad: { caption: "Load", action: () => { new JApps.Ui.OpenFileDialog('open', app).show(); }, type: JApps.UI.ActionType.execute },
                FileSaveAs: { caption: "SaveAs", action: () => { new JApps.Ui.SaveFileDialog('save', app).show(); }, type: JApps.UI.ActionType.execute },
                Voice: {
                    caption: "Voice",
                    action: () => {
                        new Ui.VoiceDialog('menu', app).setVoice(app.Status.currentVoice).show();
                    },
                    type: JApps.UI.ActionType.execute,
                    enabled: () => { return app.Status.currentVoice != undefined; }
                },
                ExportSVG: { caption: "SVG", action: () => { new Ui.ShowTextDialog('menu', app).setText(app.saveToString('SVG')).show(); }, type: JApps.UI.ActionType.execute },
                ExportJSON: { caption: "JSON", action: () => { new Ui.ShowTextDialog('menu', app).setText(app.saveToString('JSON')).show(); }, type: JApps.UI.ActionType.execute },
                ExportLilypond: { caption: "Lilypond", action: () => { new Ui.ShowTextDialog('menu', app).setText(app.saveToString('Lilypond')).show(); }, type: JApps.UI.ActionType.execute },
                ExportMusicXml: { caption: "MusicXml", action: () => { new Ui.ShowTextDialog('menu', app).setText(app.saveToString('MusicXML')).show(); }, type: JApps.UI.ActionType.execute },
                Staves: { caption: "Staves", action: () => { new Ui.StavesDialog('menu', app).show(); }, type: JApps.UI.ActionType.execute },
                TestLoadSaved: { caption: "LoadSaved", action: () => { app.loadUsing('saved.xml', 'Server', 'JSON'); }, type: JApps.UI.ActionType.execute },
                TestSaveSaved: { caption: "SaveSaved", action: () => { app.saveUsing('saved.xml', 'Server', 'JSON'); }, type: JApps.UI.ActionType.execute },
            };
            var jMusicMenuDef: JApps.UI.MenuDef = {
                items: [
                    {
                        caption: "File",
                        subItems: [
                            {
                                action: "FileLoad",
                            },
                            {
                                action: "FileSaveAs",
                            },
                            {
                                action: "FileNew",
                            }
                        ]
                    },
                    {
                        action: "Voice",
                    },
                    {
                        caption: "Export",
                        subItems: [
                            {
                                action: "ExportSVG",
                            },
                            {
                                action: "ExportJSON",
                            },
                            {
                                action: "ExportLilypond",
                            },
                            {
                                action: "ExportMusicXml",
                            }
                        ]
                    },
                    {
                        action: "Staves",
                    },
                    {
                        caption: "Test",
                        subItems: [
                            {
                                action: "TestLoadSaved",
                            },
                            {
                                action: "TestSaveSaved",
                            },
                        ]
                    },
                ],
            };
    
           
            var menuman = new MenuManager.MenuManager('#notetools5');
            menuman.addActions(jMusicActions);
            menuman.setMenu(jMusicMenuDef);
    
    
    
            conf.apply();
    
            app.loadFromString(mus, 'JSON');
            
        });
    } 

/*var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

try {

var JMusicScore;
(function (JMusicScore) {
    var MusicConfiguration = (function (_super) {
        __extends(MusicConfiguration, _super);
        function MusicConfiguration(app) {
            var _this = _super.call(this, app) || this;
            _this.addConfiguration(new JApps.Configuration.PluginConfiguration("MusicXml", JMusicScore.MusicXml.MusicXmlPlugin));
            _this.addConfiguration(new JApps.Configuration.PluginConfiguration("Lilypond", JMusicScore.Lilypond.LilypondPlugin));
            _this.addConfiguration(new JApps.Configuration.PluginConfiguration("JSON", JMusicScore.Model.JsonPlugin));
            _this.addConfiguration(new JApps.Configuration.ValidatorConfiguration("Update Bars", JMusicScore.Model.UpdateBarsValidator));
            _this.addConfiguration(new JApps.Configuration.ValidatorConfiguration("CreateTimelineValidator", JMusicScore.Model.CreateTimelineValidator));
            _this.addConfiguration(new JApps.Configuration.ValidatorConfiguration("JoinNotesValidator", JMusicScore.Model.JoinNotesValidator));
            _this.addConfiguration(new JApps.Configuration.ValidatorConfiguration("SplitNotesValidator", JMusicScore.Model.SplitNotesValidator));
            _this.addConfiguration(new JApps.Configuration.ValidatorConfiguration("BeamValidator", JMusicScore.Model.BeamValidator));
            _this.addConfiguration(new JApps.Configuration.ValidatorConfiguration("TieValidator", JMusicScore.Model.TieValidator));
            _this.addConfiguration(new JApps.Configuration.ValidatorConfiguration("UpdateAccidentals", JMusicScore.Model.UpdateAccidentalsValidator));
            _this.addConfiguration(new JApps.Configuration.ValidatorConfiguration("GhostsValidator", JMusicScore.GhostElements.GhostsValidator));
            _this.addConfiguration(new JApps.Configuration.ValidatorConfiguration("UpdateBarsValidator", JMusicScore.Model.UpdateBarsValidator));
            _this.addConfiguration(new JApps.Configuration.FileManagerConfiguration("Aspx handler", function () { return new JApps.IO.ServerFileManager("/Handler.ashx", "Server (ashx)"); }));
            _this.addConfiguration(new JApps.Configuration.FileManagerConfiguration("PHP handler", function () { return new JApps.IO.ServerFileManager("/Handler.php", "Server (PHP)"); }));
            _this.addConfiguration(new JApps.Configuration.FileManagerConfiguration("Local", function () { return new JApps.IO.LocalStorageFileManager("Local"); }));
            _this.addConfiguration(new JApps.Configuration.PluginConfiguration("CanvasView", function () { return new JMusicScore.CanvasView.CanvasViewer($('#svgArea'), $("#appContainer")); }));
            _this.addConfiguration(new JApps.Configuration.PluginConfiguration("SvgView", function () { return new JMusicScore.SvgView.SvgViewer($('#svgArea'), $("#appContainer")); }));
            _this.addConfiguration(new JApps.Configuration.PluginConfiguration("SvgView.HintAreaPlugin", JMusicScore.SvgView.HintAreaPlugin));
            _this.addConfiguration(new JApps.Configuration.PluginConfiguration("Ui.ToolbarPlugin", JMusicScore.Ui.ToolbarPlugin));
            _this.addConfiguration(new JApps.Configuration.PluginConfiguration("Ui.FileMenuPlugin", JMusicScore.Ui.FileMenuPlugin));
            _this.addConfiguration(new JApps.Configuration.PluginConfiguration("Ui.ExportMenuPlugin", JMusicScore.Ui.ExportMenuPlugin));
            return _this;
        }
        return MusicConfiguration;
    }(JApps.Configuration.ConfigurationManager));
    var app = new JApps.Application.AbstractApplication(new JMusicScore.Model.ScoreElement(null), new JMusicScore.ScoreApplication.ScoreStatusManager());
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
                            { "id": "129", "t": "Note", "def": { "time": { "num": 1, "den": 4 }, "abs": { "num": 3, "den": 2 }, "noteId": "n1_4" }, "children": [{ "id": "130", "t": "Notehead", "def": { "p": 5, "a": "" } }] }
                        ]
                    },
                    {
                        "id": "131", "t": "Voice", "def": { "stem": 2 },
                        "children": [
                            { "id": "132", "t": "Note", "def": { "time": { "num": 1, "den": 1 }, "abs": { "num": 0, "den": 1 }, "noteId": "hidden", "rest": true, "hidden": true } },
                            { "id": "133", "t": "Note", "def": { "time": { "num": 3, "den": 4 }, "abs": { "num": 1, "den": 1 }, "noteId": "hidden", "rest": true, "hidden": true } }
                        ]
                    },
                    { "id": "150", "t": "Meter" },
                    { "id": "151", "t": "Meter" },
                    { "id": "163", "t": "StaffExpression", "def": { "text": "Allegro", "abs": { "num": 0, "den": 1 } } }
                ]
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
                    { "id": "153", "t": "Meter" }
                ]
            }
        ]
    };
    //alert("Hej");
    $(function () {
        var conf = new MusicConfiguration(app);
        conf.disableConfiguration("CanvasView");
        app.addPlugin(new JMusicScore.Ui.VoiceMenuPlugin(app));
        app.addPlugin(new JMusicScore.Ui.StavesMenuPlugin(app));
        app.addPlugin(new JApps.Editors.KeybordInputPlugin());
        app.addPlugin(new JMusicScore.Editors.MidiInputPlugin());
        app.registerEventProcessor(new JMusicScore.Editors.MidiEditor());
        app.addPlugin(new JMusicScore.Ui.QuickMenuPlugin("LoadSavedMenu", "Load Saved", "TestMenu", "Test", function () { app.loadUsing('saved.xml', 'Server', 'JSON'); }));
        app.addPlugin(new JMusicScore.Ui.QuickMenuPlugin("SaveSavedMenu", "Save Saved", "TestMenu", "Test", function () { app.saveUsing('saved.xml', 'Server', 'JSON'); }));
        app.addPlugin(new JMusicScore.Ui.QuickMenuPlugin("UpdateAllMenu", "Update all", "TestMenu", "Test", function () {
            app.executeCommand({
                execute: function (app) { },
                undo: function (app) { }
            });
        }));
        app.addPlugin(new JMusicScore.Ui.QuickMenuPlugin("TestHideHintMenu", "Hint show/hide", "TestMenu", "Test", function () { $('.overlay').toggle(); }));
        app.addPlugin(new JMusicScore.Ui.QuickMenuPlugin("TestSlurMenu", "Create slur", "TestMenu", "Test", function () {
            var note1 = app.document.staffElements[0].voiceElements[0].noteElements[1];
            var note2 = app.document.staffElements[0].voiceElements[0].noteElements[4];
            note1.addChild(note1.longDecorationElements, new JMusicScore.Model.NoteLongDecorationElement(note1, note2.absTime.diff(note1.absTime), JMusicScore.Model.LongDecorationType.Slur));
            app.executeCommand({
                execute: function (app) { }
            });
        }));
        app.addPlugin(new JMusicScore.Ui.QuickMenuPlugin("TestCrescMenu", "Create cresc.", "TestMenu", "Test", function () {
            var note1 = app.document.staffElements[0].voiceElements[0].noteElements[1];
            var note2 = app.document.staffElements[0].voiceElements[0].noteElements[4];
            note1.addChild(note1.longDecorationElements, new JMusicScore.Model.NoteLongDecorationElement(note1, note2.absTime.diff(note1.absTime), JMusicScore.Model.LongDecorationType.Cresc));
            var note3 = app.document.staffElements[0].voiceElements[0].noteElements[5];
            var note4 = app.document.staffElements[0].voiceElements[0].noteElements[8];
            note3.addChild(note3.longDecorationElements, new JMusicScore.Model.NoteLongDecorationElement(note3, note4.absTime.diff(note3.absTime), JMusicScore.Model.LongDecorationType.Decresc));
            app.executeCommand({
                execute: function (app) { }
            });
        }));
        app.addPlugin(new JMusicScore.Ui.QuickMenuPlugin("TestStaffExpMenu", "Create Allegro", "TestMenu", "Test", function () {
            var staff1 = app.document.staffElements[0];
            staff1.setStaffExpression("Allegro", JMusicScore.Model.AbsoluteTime.startTime);
            app.executeCommand({
                execute: function (app) { }
            });
        }));
        app.addPlugin(new JMusicScore.Ui.QuickMenuPlugin("TripletMenu", "Add triplets", "TestMenu", "Test", function () {
            var cmd = new JMusicScore.Model.AddNoteCommand({
                noteName: '1_4',
                noteTime: JMusicScore.Model.TimeSpan.quarterNote,
                rest: false,
                dots: 0,
                grace: false,
                pitches: [new JMusicScore.Model.Pitch(-10, '')],
                voice: app.document.staffElements[1].voiceElements[0],
                beforeNote: null,
                absTime: JMusicScore.Model.AbsoluteTime.startTime,
                tuplet: new JMusicScore.Model.TupletDef(JMusicScore.Model.TimeSpan.halfNote, new JMusicScore.Model.Rational(2, 3))
            });
            app.executeCommand(cmd);
            cmd = new JMusicScore.Model.AddNoteCommand({
                noteName: '1_4',
                noteTime: JMusicScore.Model.TimeSpan.quarterNote,
                rest: false,
                dots: 0,
                grace: false,
                pitches: [new JMusicScore.Model.Pitch(-9, '')],
                voice: app.document.staffElements[1].voiceElements[0],
                beforeNote: null,
                absTime: JMusicScore.Model.AbsoluteTime.startTime,
                tuplet: new JMusicScore.Model.TupletDef(JMusicScore.Model.TimeSpan.halfNote, new JMusicScore.Model.Rational(2, 3))
            });
            app.executeCommand(cmd);
            cmd = new JMusicScore.Model.AddNoteCommand({
                noteName: '1_4',
                noteTime: JMusicScore.Model.TimeSpan.quarterNote,
                rest: false,
                dots: 0,
                grace: false,
                pitches: [new JMusicScore.Model.Pitch(-8, '')],
                voice: app.document.staffElements[1].voiceElements[0],
                beforeNote: null,
                absTime: JMusicScore.Model.AbsoluteTime.startTime,
                tuplet: new JMusicScore.Model.TupletDef(JMusicScore.Model.TimeSpan.halfNote, new JMusicScore.Model.Rational(2, 3))
            });
            app.executeCommand(cmd);
        }));
        app.addPlugin(new JMusicScore.Ui.QuickMenuPlugin("ClearBarsMenu", "Recalc bars", "TestMenu", "Test", function () {
            app.document.withBars(function (bar, index) { app.document.removeChild(bar); });
            app.executeCommand({
                execute: function (app) { }
            });
        }));
        app.addPlugin(new JMusicScore.Ui.QuickMenuPlugin("DebugTextMenu", "Debug to lyrics", "TestMenu", "Test", function () {
            app.document.withVoices(function (voice, index) {
                voice.withNotes(function (note) {
                    var staff = voice.parent;
                    var staffContext = staff.getStaffContext(note.absTime);
                    if (note.syllableElements.length) {
                        var text = note.syllableElements[0];
                        text.Text = staffContext.barNo + ':' + staffContext.timeInBar.toString();
                    }
                });
            });
            app.executeCommand({
                execute: function (app) { }
            });
        }));
        app.addPlugin(new JMusicScore.Ui.QuickMenuPlugin("RecreateMenu", "Recreate score", "TestMenu", "Test", function () {
            app.document = JMusicScore.Model.MusicElementFactory.recreateElement(null, app.document.getMemento());
            app.executeCommand({
                execute: function (app) { }
            });
        }));
        app.addPlugin(new JMusicScore.Ui.QuickMenuPlugin("MacroMenu", "Export command stack", "TestMenu", "Test", function () {
            var res = [];
            $.each(app.undoStack, function (i, e) {
                if (e.args) {
                    var macroDef = JMusicScore.Model.MacroExporter.makeMacro(e);
                    var keyValues = [];
                    $.each(macroDef.args, function (key, val) {
                        keyValues.push(key + ': ' + val);
                    });
                    res.push(['app.executeCommand(new JMusicScore.Model.', macroDef.commandName, '({', keyValues.join(', '), '}));'].join(''));
                }
                else
                    res.push("null");
            });
            new JMusicScore.Ui.ShowTextDialog('menu', app).setText(res.join("\n")).show();
        }));
        app.addPlugin(new ScriptRunner.ScriptRunnerPlugIn());
        app.addPlugin(new JMusicScore.FinaleUi.FinaleSmartEditPlugin());
        var jMusicActions = {
            FileNew: { caption: "New", action: function () { app.executeCommand(new JMusicScore.Model.ClearScoreCommand({})); }, type: JApps.UI.ActionType.execute },
            FileLoad: { caption: "Load", action: function () { new JApps.Ui.OpenFileDialog('open', app).show(); }, type: JApps.UI.ActionType.execute },
            FileSaveAs: { caption: "SaveAs", action: function () { new JApps.Ui.SaveFileDialog('save', app).show(); }, type: JApps.UI.ActionType.execute },
            Voice: {
                caption: "Voice",
                action: function () {
                    new JMusicScore.Ui.VoiceDialog('menu', app).setVoice(app.Status.currentVoice).show();
                },
                type: JApps.UI.ActionType.execute,
                enabled: function () { return app.Status.currentVoice != undefined; }
            },
            ExportSVG: { caption: "SVG", action: function () { new JMusicScore.Ui.ShowTextDialog('menu', app).setText(app.saveToString('SVG')).show(); }, type: JApps.UI.ActionType.execute },
            ExportJSON: { caption: "JSON", action: function () { new JMusicScore.Ui.ShowTextDialog('menu', app).setText(app.saveToString('JSON')).show(); }, type: JApps.UI.ActionType.execute },
            ExportLilypond: { caption: "Lilypond", action: function () { new JMusicScore.Ui.ShowTextDialog('menu', app).setText(app.saveToString('Lilypond')).show(); }, type: JApps.UI.ActionType.execute },
            ExportMusicXml: { caption: "MusicXml", action: function () { new JMusicScore.Ui.ShowTextDialog('menu', app).setText(app.saveToString('MusicXML')).show(); }, type: JApps.UI.ActionType.execute },
            Staves: { caption: "Staves", action: function () { new JMusicScore.Ui.StavesDialog('menu', app).show(); }, type: JApps.UI.ActionType.execute },
            TestLoadSaved: { caption: "LoadSaved", action: function () { app.loadUsing('saved.xml', 'Server', 'JSON'); }, type: JApps.UI.ActionType.execute },
            TestSaveSaved: { caption: "SaveSaved", action: function () { app.saveUsing('saved.xml', 'Server', 'JSON'); }, type: JApps.UI.ActionType.execute }
        };
        //alert("Dav");
        var jMusicMenuDef = {
            items: [
                {
                    caption: "File",
                    subItems: [
                        {
                            action: "FileLoad"
                        },
                        {
                            action: "FileSaveAs"
                        },
                        {
                            action: "FileNew"
                        }
                    ]
                },
                {
                    action: "Voice"
                },
                {
                    caption: "Export",
                    subItems: [
                        {
                            action: "ExportSVG"
                        },
                        {
                            action: "ExportJSON"
                        },
                        {
                            action: "ExportLilypond"
                        },
                        {
                            action: "ExportMusicXml"
                        }
                    ]
                },
                {
                    action: "Staves"
                },
                {
                    caption: "Test",
                    subItems: [
                        {
                            action: "TestLoadSaved"
                        },
                        {
                            action: "TestSaveSaved"
                        },
                    ]
                },
            ]
        };
        var menuman = new JApps.UI.JQUIMenuManager('#notetools5');
        menuman.addActions(jMusicActions);
        menuman.setMenu(jMusicMenuDef);
        conf.apply();
        app.loadFromString(mus, 'JSON');
    });
})(JMusicScore || (JMusicScore = {}));
//alert("Hallo");
var ScriptRunner;
(function (ScriptRunner) {
    var ScriptRunnerPlugIn = (function () {
        function ScriptRunnerPlugIn() {
        }
        ScriptRunnerPlugIn.prototype.init = function (app) {
            var $root = $('<div>').addClass('scripteditor').appendTo('#footer');
            this.createInputArea($root, { tgWidth: 40 }, app);
            app.FeedbackManager.registerClient(this);
        };
        ScriptRunnerPlugIn.prototype.changed = function (status, key, val) {
        };
        ScriptRunnerPlugIn.prototype.createInputArea = function ($root, param, app) {
            var _this = this;
            var $inputArea = $('<textarea>').text("SetVoiceStemDir s1v1 StemDown\nSetVoiceStemDir s1v2 StemUp").css({ "height": "80px", "width": "480px" });
            var $inputButton = $('<button>').text("Execute");
            $root.append($('<div>').append($inputArea).append($inputButton));
            $inputButton.click(function () {
                var t = $inputArea.val();
                try {
                    var command = _this.parseScript(t, app);
                    app.executeCommand(command);
                }
                catch (e) {
                    alert("Fejl: " + e);
                }
            });
            return this;
        };
        ScriptRunnerPlugIn.findCommand = function (t) {
            for (var i = 0; i < ScriptRunnerPlugIn.commands.length; i++) {
                var cmd = ScriptRunnerPlugIn.commands[i];
                if (cmd.name.toLowerCase() === t.toLowerCase()) {
                    return cmd;
                }
            }
            return null;
        };
        ScriptRunnerPlugIn.findDataType = function (t) {
            for (var i = 0; i < ScriptRunnerPlugIn.dataTypes.length; i++) {
                var dt = ScriptRunnerPlugIn.dataTypes[i];
                if (dt.name.toLowerCase() === t.toLowerCase()) {
                    return dt;
                }
            }
            return null;
        };
        ScriptRunnerPlugIn.prototype.parseScript = function (t, app) {
            var lines = t.split("\n");
            var parse = commandParser.exports.parse;
            var commands = [];
            for (var i = 0; i < lines.length; i++) {
                var res = parse(lines[i]);
                if (!res)
                    throw "Syntax Error";
                switch (res.type) {
                    case "assignment":
                        throw "Assignment not supported";
                    case "command":
                        var cmd = ScriptRunnerPlugIn.findCommand(res.c);
                        if (!cmd)
                            throw "Unknown Command: " + res.c;
                        var args = {};
                        for (var j = 0; j < cmd.args.length; j++) {
                            var value;
                            var arg = cmd.args[j];
                            var param = null;
                            if (res.args.length > j)
                                param = res.args[j];
                            var dt = ScriptRunnerPlugIn.findDataType(arg.type);
                            if (!dt)
                                throw "Unknown Type: " + arg.type;
                            value = dt.valueGetter(arg, param, app);
                            args[arg.name] = value;
                        }
                        commands.push(new cmd.cls(args));
                        break;
                    default:
                        throw "Unknown Command Type";
                }
            }
            return new JMusicScore.Model.BundleCommand(commands);
        };
        ScriptRunnerPlugIn.prototype.getId = function () {
            return "ScriptRunnerPlugin";
        };
        ScriptRunnerPlugIn.registerCommand = function (cls) {
            this.commands.push(cls);
        };
        ScriptRunnerPlugIn.registerDataType = function (dt) {
            this.dataTypes.push(dt);
        };
        ScriptRunnerPlugIn.commands = [];
        ScriptRunnerPlugIn.dataTypes = [];
        return ScriptRunnerPlugIn;
    }());
    ScriptRunner.ScriptRunnerPlugIn = ScriptRunnerPlugIn;
    ScriptRunnerPlugIn.registerCommand({
        cls: JMusicScore.Model.SetVoiceStemDirectionCommand,
        name: "SetVoiceStemDir",
        args: [{ name: "voice", type: "Voice" },
            { name: "direction", type: "Enum", cls: JMusicScore.Model.StemDirectionType }]
    });
    ScriptRunnerPlugIn.registerDataType({
        name: "Voice",
        valueGetter: function (arg, param, app) {
            var value;
            if (param.val === ".") {
                value = app.Status.currentVoice;
            }
            else if (param.type === "voice") {
                var s = param.val.s;
                var v = param.val.v;
                value = app.document.staffElements[s - 1].voiceElements[v - 1];
            }
            if (!value)
                throw "No voice selected";
            return value;
        }
    });
    ScriptRunnerPlugIn.registerDataType({
        name: "Enum",
        valueGetter: function (arg, param, app) {
            return arg.cls[param.val];
            ;
        }
    });
})(ScriptRunner || (ScriptRunner = {}));
//alert("Finito");

} catch(e){
    alert(e.message);
}*/