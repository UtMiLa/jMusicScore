import{Application} from "../jApps/application";
import{Editors as JAppsEditors} from "../jApps/Browser/keyboard";
import{Configuration} from "../jApps/Configuration";
//import{IO} from "../jApps/jApps.BrowserFileSystem";
import {CanvasView} from "../jMusicScore/jMusicScore.CanvasView";
import {SvgView} from "../jMusicScore/jMusicScore.SvgView";
import {ScoreApplication} from "../jMusicScore/jMusicScore.Application";
import {MusicEditors} from "../jMusicScore/jMusicScore.Editors";
import {MusicToolbar} from "../jMusicScore/jMusicScore.Toolbar";
import {Model} from "../jMusicScore/jMusicScore";
import {JMusicScoreUi} from "../jMusicScore/jMusicScore.UI";
import {Commands} from "../jMusicScore/commands";
import {Players} from "../jMusicScore/midiEditor";
import {Editors as MidiEditors} from "../jMusicScore/midiIn";
import {FinaleUi} from "../jMusicScore/FinaleEmulator";

import {MusicXml} from "../jMusicScore/jMusicScore.MusicXml";
import {Lilypond} from "../jMusicScore/jMusicScore.Lilypond";
import {Json} from "../jMusicScore/jsonReader";
import {Validators} from "../jMusicScore/validators";
import {GhostElements} from "../jMusicScore/ghostElements";

import {UI} from "../jApps/Japps.ui";
import {MenuManager} from "./main-process/menus/MenuManager";
import {NodeFs} from "./render-process/NodeFileSystem";

//import {menu} from "./main-process/menus/menu";
//menu();

const JApps = {
    Configuration: Configuration,
    Application: Application
    //IO:IO
};

//var $ = require('./Scripts/jquery-3.1.1.js');
//$(()=> {alert("Hej");});

export module JMusicScore {
    
        class MusicConfiguration extends JApps.Configuration.ConfigurationManager<Model.IScore, ScoreApplication.ScoreStatusManager> {
            constructor(app: ScoreApplication.IScoreApplication) {
                super(app);

                this.addConfiguration(new JApps.Configuration.PluginConfiguration("JSON", Json.JsonPlugin));
                this.addConfiguration(new JApps.Configuration.PluginConfiguration("MusicXml", MusicXml.MusicXmlPlugin));
                this.addConfiguration(new JApps.Configuration.PluginConfiguration("Lilypond", Lilypond.LilypondPlugin));
                this.addConfiguration(new JApps.Configuration.ValidatorConfiguration("Update Bars", Validators.UpdateBarsValidator));
                this.addConfiguration(new JApps.Configuration.ValidatorConfiguration("CreateTimelineValidator", Validators.CreateTimelineValidator));
                this.addConfiguration(new JApps.Configuration.ValidatorConfiguration("JoinNotesValidator", Validators.JoinNotesValidator));
                this.addConfiguration(new JApps.Configuration.ValidatorConfiguration("SplitNotesValidator", Validators.SplitNotesValidator));
                this.addConfiguration(new JApps.Configuration.ValidatorConfiguration("BeamValidator", Validators.BeamValidator));
                this.addConfiguration(new JApps.Configuration.ValidatorConfiguration("TieValidator", Validators.TieValidator));
                this.addConfiguration(new JApps.Configuration.ValidatorConfiguration("UpdateAccidentals", Validators.UpdateAccidentalsValidator));
                this.addConfiguration(new JApps.Configuration.ValidatorConfiguration("GhostsValidator", GhostElements.GhostsValidator));
                this.addConfiguration(new JApps.Configuration.ValidatorConfiguration("UpdateBarsValidator", Validators.UpdateBarsValidator));
    
                this.addConfiguration(new JApps.Configuration.FileManagerConfiguration("File", () => { return new NodeFs.FsFileManager("File");}));
                //this.addConfiguration(new JApps.Configuration.FileManagerConfiguration("Aspx handler", () => { return new IO.ServerFileManager("/Handler.ashx", "Server (ashx)"); }));
                //this.addConfiguration(new JApps.Configuration.FileManagerConfiguration("PHP handler", () => { return new IO.ServerFileManager("/Handler.php", "Server (PHP)"); }));
                //this.addConfiguration(new JApps.Configuration.FileManagerConfiguration("Local", () => { return new IO.LocalStorageFileManager("Local"); }));
    
                this.addConfiguration(new JApps.Configuration.PluginConfiguration("CanvasView", () => { return new CanvasView.CanvasViewer($('#svgArea'), $("#appContainer")); }));
                this.addConfiguration(new JApps.Configuration.PluginConfiguration("SvgView", () => { return new SvgView.SvgViewer($('#svgArea'), $("#appContainer")); }));
                this.addConfiguration(new JApps.Configuration.PluginConfiguration("SvgView.HintAreaPlugin", SvgView.HintAreaPlugin));
                this.addConfiguration(new JApps.Configuration.PluginConfiguration("Ui.ToolbarPlugin", MusicToolbar.ToolbarPlugin));
                //this.addConfiguration(new JApps.Configuration.PluginConfiguration("Ui.FileMenuPlugin", JMusicScoreUi.FileMenuPlugin));
                //this.addConfiguration(new JApps.Configuration.PluginConfiguration("Ui.ExportMenuPlugin", JMusicScoreUi.ExportMenuPlugin));
            }
        }
        
        var app = <ScoreApplication.IScoreApplication>new Application.AbstractApplication<Model.ScoreElement, ScoreApplication.ScoreStatusManager>(
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

            app.addPlugin(new MidiEditors.MidiInputPlugin());
            app.registerEventProcessor(new MidiEditors.MidiEditor()); // "midiNoteOff", 
    
            
            var jMusicActions: UI.ActionCollection = {
                FileNew: { caption: "New", action: () => { app.executeCommand(new Commands.ClearScoreCommand({})); }, type: UI.ActionType.execute },
                FileLoad: { caption: "Load", action: () => { new JMusicScoreUi.OpenFileDialog('open', app).show(); }, type: UI.ActionType.execute },
                FileSaveAs: { caption: "SaveAs", action: () => { new JMusicScoreUi.SaveFileDialog('save', app).show(); }, type: UI.ActionType.execute },
                Voice: {
                    caption: "Voice",
                    action: () => {
                        new JMusicScoreUi.VoiceDialog('menu', app).setVoice(app.Status.currentVoice).show();
                    },
                    type: UI.ActionType.execute,
                    enabled: () => { return app.Status.currentVoice != undefined; }
                },
                ExportSVG: { caption: "SVG", action: () => { new JMusicScoreUi.ShowTextDialog('menu', app).setText(app.saveToString('SVG')).show(); }, type: UI.ActionType.execute },
                ExportJSON: { caption: "JSON", action: () => { new JMusicScoreUi.ShowTextDialog('menu', app).setText(app.saveToString('JSON')).show(); }, type: UI.ActionType.execute },
                ExportLilypond: { caption: "Lilypond", action: () => { new JMusicScoreUi.ShowTextDialog('menu', app).setText(app.saveToString('Lilypond')).show(); }, type: UI.ActionType.execute },
                ExportMusicXml: { caption: "MusicXml", action: () => { new JMusicScoreUi.ShowTextDialog('menu', app).setText(app.saveToString('MusicXML')).show(); }, type: UI.ActionType.execute },
                Staves: { caption: "Staves", action: () => { new JMusicScoreUi.StavesDialog('menu', app).show(); }, type: UI.ActionType.execute },
                TestLoadSaved: { caption: "LoadSaved", action: () => { app.loadUsing('saved.xml', 'Server', 'JSON'); }, type: UI.ActionType.execute },
                TestSaveSaved: { caption: "SaveSaved", action: () => { app.saveUsing('saved.xml', 'Server', 'JSON'); }, type: UI.ActionType.execute },
            };

//var actions: string[] = [];

            function addMenuItem(a: string, b: string, c: string, d: string, e: () => void): void {
                //app.addPlugin (new JMusicScoreUi.QuickMenuPlugin(a,b,c,d,e));
                jMusicActions[a.replace("Menu", "Action")] = {
                    caption: b, action: e, type: UI.ActionType.execute
                }
                //actions.push(a.replace("Menu", "Action"));
            }
    
            /* Menus */
            //app.addPlugin(new CanvasView.CanvasViewer($('#svgArea'), $("#appContainer")));
            //app.addPlugin(new SvgView.SvgViewer($('#svgArea'), $("#appContainer")));
            conf.disableConfiguration("CanvasView");
            
            //app.addPlugin(new JMusicScoreUi.VoiceMenuPlugin(app));
            
            //app.addPlugin(new JMusicScoreUi.StavesMenuPlugin(app));
    
            app.addPlugin(new JAppsEditors.KeybordInputPlugin());
            /*app.addPlugin(new MidiEditors.MidiInputPlugin());
            app.registerEventProcessor(new MidiEditors.MidiEditor()); // "midiNoteOff", */
    
                    /** test **/
    
            addMenuItem("LoadSavedMenu", "Load Saved", "TestMenu", "Test", function() { app.loadUsing('saved.xml', 'Server', 'JSON'); });
            addMenuItem("SaveSavedMenu", "Save Saved", "TestMenu", "Test", function() { app.saveUsing('saved.xml', 'Server', 'JSON'); });
            addMenuItem("UpdateAllMenu", "Update all", "TestMenu", "Test", function() {
                app.executeCommand({
                    execute: (app: ScoreApplication.IScoreApplication) => {},
                    undo: (app: ScoreApplication.IScoreApplication) => {}
                });
            });
            addMenuItem("TestHideHintMenu", "Hint show/hide", "TestMenu", "Test", function() { $('.overlay').toggle(); });
            addMenuItem("TestSlurMenu", "Create slur", "TestMenu", "Test", function() {
                var note1 = app.document.staffElements[0].voiceElements[0].noteElements[1];
                var note2 = app.document.staffElements[0].voiceElements[0].noteElements[4];
                note1.addChild(note1.longDecorationElements, new Model.NoteLongDecorationElement(note1, note2.absTime.diff(note1.absTime), Model.LongDecorationType.Slur));
                app.executeCommand({
                    execute: (app: ScoreApplication.IScoreApplication) => {}
                });
            });
            addMenuItem("TestCrescMenu", "Create cresc.", "TestMenu", "Test", function() {
                var note1 = app.document.staffElements[0].voiceElements[0].noteElements[1];
                var note2 = app.document.staffElements[0].voiceElements[0].noteElements[4];
                note1.addChild(note1.longDecorationElements, new Model.NoteLongDecorationElement(note1, note2.absTime.diff(note1.absTime), Model.LongDecorationType.Cresc));
                var note3 = app.document.staffElements[0].voiceElements[0].noteElements[5];
                var note4 = app.document.staffElements[0].voiceElements[0].noteElements[8];
                note3.addChild(note3.longDecorationElements, new Model.NoteLongDecorationElement(note3, note4.absTime.diff(note3.absTime), Model.LongDecorationType.Decresc));
                app.executeCommand({
                    execute: (app: ScoreApplication.IScoreApplication) => {}
                });
            });
            addMenuItem("TestStaffExpMenu", "Create Allegro", "TestMenu", "Test", function() {
                var staff1 = app.document.staffElements[0];
                staff1.setStaffExpression("Allegro", Model.AbsoluteTime.startTime);
                app.executeCommand({
                    execute: (app: ScoreApplication.IScoreApplication) => {}
                });
            });
            addMenuItem("TripletMenu", "Add triplets", "TestMenu", "Test", function() {
                var cmd = new Commands.AddNoteCommand(
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
                cmd = new Commands.AddNoteCommand(
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
                cmd = new Commands.AddNoteCommand(
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
            });
    
            
            addMenuItem("ClearBarsMenu", "Recalc bars", "TestMenu", "Test", function() {
                app.document.withBars((bar: Model.IBar, index: number) => { app.document.removeChild(bar); });
                app.executeCommand({
                    execute: (app: ScoreApplication.IScoreApplication) => {}
                });
            });
            addMenuItem("DebugTextMenu", "Debug to lyrics", "TestMenu", "Test", function() {
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
            });
            addMenuItem("RecreateMenu", "Recreate score", "TestMenu", "Test", function() {
                app.document = <Model.IScore>Model.MusicElementFactory.recreateElement(null, app.document.getMemento());
                app.executeCommand({
                    execute: (app: ScoreApplication.IScoreApplication) => {}
                });
            });
    
            addMenuItem("MacroMenu", "Export command stack", "TestMenu", "Test", () => {
                var res: string[] = [];
                $.each((<any>app).undoStack, (i: number, e: any) => {
                    if (e.args) {
                        var macroDef = Commands.MacroExporter.makeMacro(e); //e.macro();
                        var keyValues: string[] = [];
                        $.each(macroDef.args, (key: string, val: any) => {
                            keyValues.push(key + ': ' + val);
                        });
                        res.push(['app.executeCommand(new JMusicScore.Model.', macroDef.commandName, '({', keyValues.join(', '), '}));'].join(''));
                    } else res.push("null");
                });
                new JMusicScoreUi.ShowTextDialog('menu', app).setText(res.join("\n")).show();
            });
            app.addPlugin(new JMusicScoreUi.PianoPlugIn());
            //app.addPlugin(new ScriptRunner.ScriptRunnerPlugIn());
    
            app.addPlugin(new FinaleUi.FinaleSmartEditPlugin());
            //app.AddPlugin(new Players.MidiPlayer());

            var jMusicMenuDef: UI.MenuDef = {
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
                            {
                                action: "LoadSavedAction",
                            },
                            {
                                action: "SaveSavedAction",
                            },
                            {
                                action: "UpdateAllAction",
                            },
                            {
                                action: "TestHideHintAction",
                            },
                            {
                                action: "TestSlurAction",
                            },
                            {
                                action: "TestCrescAction",
                            },
                            {
                                action: "TestStaffExpAction",
                            },
                            {
                                action: "TripletAction",
                            },
                            {
                                action: "DebugTextAction",
                            },
                            {
                                action: "ClearBarsAction",
                            },
                            {
                                action: "RecreateAction",
                            },
                            {
                                action: "MacroAction",
                            },
                        ]
                    },
                ],
            };
//console.log(actions);

            var menuman = new MenuManager.MenuManager('#notetools5');
            menuman.addActions(jMusicActions);
            menuman.setMenu(jMusicMenuDef);
    
    
    
            conf.apply();
    
            app.loadFromString(mus, 'JSON');
            
        });
    } 


