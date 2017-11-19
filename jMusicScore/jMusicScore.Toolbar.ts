import {Model} from "./jMusicScore";
import {Commands} from "./commands";
import {MusicEditors} from "./jMusicScore.Editors";
import {Views} from "./jMusicScore.Views";
import { ScoreApplication } from "./jMusicScore.Application";
import {UI} from "../jApps/Japps.ui";
import {FinaleUi} from "./FinaleEmulator";
import {JMusicScoreUi} from "./jMusicScore.UI";

export module MusicToolbar{
    export class JToolbar {
        constructor(private app: ScoreApplication.IScoreApplication) {
            this.makeMenu('#notetools1', JToolbar.menuDef);

            $("#clefs").button(
                {
                 
                        icon: "ui-icon-triangle-1-s",
                        iconPosition: "end"
                 
                }).click(function () {
                var menu = $(this).next().show().position({
                    my: "left top",
                    at: "left bottom",
                    of: this
                });
                $(document).one("click", function () {
                    menu.hide();
                });
                return false;
            })
                .next()
                .hide()
                .menu()
                .click(function () {
                this.app.map.generateMap();
            });
        }

        static menuDef: JMusicScoreUi.IToolDef[] = [
            {
                type: "Radiogroup",
                id: "notes",
                name: "note",
                buttons: [
                    {
                        id: "edit",
                        label: "Edit",
                        glyph: "icon-finale",
                        mode: new FinaleUi.FinaleSpeedyEntry()
                    },
                    {
                        id: "delete",
                        label: "Delete",
                        glyph: "icon-lyric",
                        mode: new MusicEditors.EditNoteTextEditor()
                        //new Editors.DeleteNoteEditor("SVGcontext1")
                        //createMode: function(score) { return new Editors.DeleteNoteMode(score, score.getSvgHelper()); }
                    },
                    {
                        id: "2_1",
                        label: "Brevis",
                        glyph: "icon-2_1",
                        mode: new MusicEditors.InsertNoteEditor("SVGcontext1", '2_1', new Model.TimeSpan(2, 1), false, 0)
                        //createMode: function(score) { return new Editors.AddNoteMode(score, 'edit2_1', '2_1', 512, score.getSvgHelper()); }
                    },
                    {
                        id: "1_1",
                        label: "1/1",
                        glyph: "icon-1_1",
                        mode: new MusicEditors.InsertNoteEditor("SVGcontext1", '1_1', new Model.TimeSpan(1, 1), false, 0)
                        //createMode: function(score) { return new Editors.AddNoteMode(score, 'edit1_1', '1_1', 256, score.getSvgHelper()); }
                    },
                    {
                        id: "1_2",
                        label: "1/2",
                        glyph: "icon-1_2",
                        mode: new MusicEditors.InsertNoteEditor("SVGcontext1", '1_2', new Model.TimeSpan(1, 2), false, 0)
                        //createMode: function(score) { return new Editors.AddNoteMode(score, 'edit1_2', '1_2', 128, score.getSvgHelper()); }
                    },
                    {
                        id: "1_4",
                        label: "1/4",
                        glyph: "icon-1_4",
                        mode: new MusicEditors.InsertNoteEditor("SVGcontext1", '1_4', new Model.TimeSpan(1, 4), false, 0)
                        //createMode: function(score) { return new Editors.AddNoteMode(score, 'edit1_4', '1_4', 64, score.getSvgHelper()); }
                    },
                    {
                        id: "1_8",
                        label: "1/8",
                        glyph: "icon-1_8",
                        mode: new MusicEditors.InsertNoteEditor("SVGcontext1", '1_8', new Model.TimeSpan(1, 8), false, 0)
                        //createMode: function(score) { return new Editors.AddNoteMode(score, 'edit1_8', '1_8', 32, score.getSvgHelper()); }
                    },
                    {
                        id: "1_16",
                        label: "1/16",
                        glyph: "icon-1_16",
                        mode: new MusicEditors.InsertNoteEditor("SVGcontext1", '1_16', new Model.TimeSpan(1, 16), false, 0)
                        //createMode: function(score) { return new Editors.AddNoteMode(score, 'edit1_16', '1_16', 16, score.getSvgHelper()); }
                    },
                    {
                        id: "1_32",
                        label: "1/32",
                        glyph: "icon-1_32",
                        mode: new MusicEditors.InsertNoteEditor("SVGcontext1", '1_32', new Model.TimeSpan(1, 32), false, 0)
                        //createMode: function(score) { return new Editors.AddNoteMode(score, 'edit1_32', '1_32', 8, score.getSvgHelper()); }
                    },
                    {
                        id: "1_64",
                        label: "1/64",
                        glyph: "icon-1_64",
                        mode: new MusicEditors.InsertNoteEditor("SVGcontext1", '1_64', new Model.TimeSpan(1, 64), false, 0)
                        //createMode: function(score) { return new Editors.AddNoteMode(score, 'edit1_64', '1_64', 4, score.getSvgHelper()); }
                    },
                    {
                        id: "chgMeter",
                        label: "Meter",
                        glyph: "icon-meter",
                        mode: new MusicEditors.ChangeMeterEditor("SVGcontext1")
                    },
                    {
                        id: "chgKey",
                        label: "Key",
                        glyph: "icon-key",
                        mode: new MusicEditors.ChangeKeyEditor("SVGcontext1")
                    },
                    {
                        id: "chgClef",
                        label: "Clef",
                        glyph: "icon-clef",
                        mode: new MusicEditors.ChangeClefEditor("SVGcontext1")
                    },
                ]
            },
            {
                type: "Checkgroup",
                id: "_note_modifiers",
                buttons: [
                    {
                        id: "rest",
                        label: "Rest",
                        glyph: "icon-rest",
                        onChecked: function (button: HTMLInputElement, app: ScoreApplication.IScoreApplication) {
                            app.Status.rest = button.checked;
                        }
                    },
                    {
                        id: "dotted",
                        label: "Dotted",
                        glyph: "icon-dot",
                        onChecked: function (button: HTMLInputElement, app: ScoreApplication.IScoreApplication) {
                            app.Status.dots = button.checked ? 1 : 0;
                        }
                    },
                    {
                        id: "grace",
                        label: "Grace",
                        glyph: "icon-grace",
                        onChecked: function (button: HTMLInputElement, app: ScoreApplication.IScoreApplication) {
                            app.Status.grace = button.checked;
                        }
                    },
                ]
            },
            {
                type: "Buttongroup",
                id: "_edit_operations",
                buttons: [
                    {
                        id: "undo",
                        label: "Undo",
                        glyph: "icon-undo",
                        onChecked: function (button: HTMLInputElement, app: ScoreApplication.IScoreApplication) {
                            app.undo();
                        },
                        validate: function (app: ScoreApplication.IScoreApplication): boolean {
                            return app.canUndo();
                        }
                    },
                    {
                        id: "redo",
                        label: "Redo",
                        glyph: "icon-redo",
                        onChecked: function (button: HTMLInputElement, app: ScoreApplication.IScoreApplication) {
                            app.redo();
                        },
                        validate: function (app: ScoreApplication.IScoreApplication): boolean {
                            return app.canRedo();
                        }
                    },
                ],
            }/*,
            {
                type: "Buttongroup",
                id: "_play_operations",
                buttons: [
                    {
                        id: "play",
                        label: "Play",
                        glyph: "icon-play",// todo: disable when playing
                        onChecked: function (button: HTMLInputElement, app: ScoreApplication.IScoreApplication) {
                            var player = new Players.MidiPlayer();
                            player.playAll(app);
                        },
                    },
                    {
                        id: "pause",
                        label: "Pause",
                        glyph: "icon-pause",
                        onChecked: function (button: HTMLInputElement, app: ScoreApplication.IScoreApplication) {

                        },
                    },
                ],
            }*/
        ];

        public unregisterModes() {
            var def = JToolbar.menuDef;
            for (var i = 0; i < def.length; i++) {
                var item = def[i];
                if (item.type === "Radiogroup" || item.type === "Checkgroup" || item.type === 'Buttongroup') {
                    for (var j = 0; j < item.buttons.length; j++) {
                        var btnDef = item.buttons[j];
                        if (btnDef.mode) { this.app.unregisterEventProcessor(btnDef.mode); }
                    }
                }
            }
        }

        private makeMenu(id: string, def: JMusicScoreUi.IToolDef[]) {
            var toolbar = $(id).addClass("ui-widget-header").addClass("ui-corner-all");
            for (var i = 0; i < def.length; i++) {
                var item = def[i];
                if (item.type == "Radiogroup" || item.type == "Checkgroup" || item.type === 'Buttongroup') {
                    var grp = $('<span>').attr('id', item.id).appendTo(toolbar);
                    for (var j = 0; j < item.buttons.length; j++) {
                        var btnDef = item.buttons[j];
                        var btn: JQuery;
                        if (item.type === 'Buttongroup') {
                            btn = $('<button/>').attr({
                                id: btnDef.id,
                                name: btnDef.id
                            })
                                .addClass('note-icon')
                                .appendTo(grp);
                        }
                        else {
                            btn = $('<input/>').attr({
                                type: item.type === "Radiogroup" ? "radio" : "checkbox",
                                id: btnDef.id,
                                name: item.type === "Radiogroup" ? item.name : btnDef.id
                            })
                                .addClass('note-icon')
                                .appendTo(grp);
                        }

                        if (item.type === 'Buttongroup') {
                            btn.button({
                                showLabel: true,
                                icon: btnDef.glyph
                            })
                                .data('notedata', btnDef)
                                .data('parent', this)
                                .data('app', this.app)
                                .click(function () {
                                    var notedata = $(this).data('notedata');
                                    var parent = $(this).data('parent');
                                    var app = <ScoreApplication.IScoreApplication>$(this).data('app');

                                    if (notedata.mode) {
                                        parent.unregisterModes();
                                        app.registerEventProcessor(notedata.mode);
                                    }
                                    /*if (notedata.createMode) {
                                        parent.currentNoteMode = notedata.createMode(score);
                                        parent.currentNoteMode.currentVoice = parent.currentVoice;
                                        parent.currentNoteMode.actionSelected();
                                    }*/
                                    if (notedata.onChecked) {
                                        notedata.onChecked(this, app);
                                    }
                                });/**/

                        }
                        else {
                            var label = (<any>$('<label/>').attr('for', btnDef.id)
                                .attr("title", btnDef.label))
                                .appendTo(grp);

                            //btn.attr('src','');
                            btn.checkboxradio({
                                classes: {
                                    "ui-checkboxradio-icon": btnDef.glyph
                                }
                                //showLabel: true,
                                //icon: btnDef.glyph
                            })
                                .data('notedata', btnDef)
                                .data('parent', this)
                                .data('app', this.app)
                                .click(function () {
                            var notedata = <JMusicScoreUi.IToolBtnDef>$(this).data('notedata');
                            var parent = <JToolbar>$(this).data('parent');
                            var app = <ScoreApplication.IScoreApplication>$(this).data('app');

                                    if (notedata.mode) {
                                        parent.unregisterModes();
                                app.registerEventProcessor(notedata.mode);
                                    }
                                    /*if (notedata.createMode) {
                                        parent.currentNoteMode = notedata.createMode(score);
                                        parent.currentNoteMode.currentVoice = parent.currentVoice;
                                        parent.currentNoteMode.actionSelected();
                                    }*/
                                    if (notedata.onChecked) {
                                        notedata.onChecked(this, app);
                                    }
                                });/**/
                        }

                    }
                    grp.controlgroup();

                    grp.find('span.ui-button-text')
                        .css('padding', '2px');

                }
            }
        }
    }

    
    class CheckButtons implements ScoreApplication.IScoreDesigner {
        validate(app: ScoreApplication.IScoreApplication) {
            var $buttons = $('.note-icon');
            $buttons.each((i: number, e: Element) => {
                var btnDef = <JMusicScoreUi.IToolBtnDef>$(e).data('notedata');
                if (btnDef && btnDef.validate) {
                    if (btnDef.validate(app)) {
                        $(e).button('enable');
                    }
                    else {
                        $(e).button('disable');
                    }
                }
            });
        }
    }

    export class ToolbarPlugin implements ScoreApplication.IScorePlugin {
        constructor() {
        }

        private toolbar: JToolbar;

        public getToolbar(): JToolbar {
            return this.toolbar;
        }

        init(app: ScoreApplication.IScoreApplication) {
            this.toolbar = new JToolbar(app);
            app.addDesigner(new CheckButtons());
        }

        getId(): string {
            return "Toolbar";
        }
    }

}