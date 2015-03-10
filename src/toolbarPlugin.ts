module jMusicScore {
    export module UI {

        export interface IAction {
            getCaption(): string;
            getImageUri(): string;
            getSvg(): string;
            getIndex(): number;
            checkEnabled(): void;
        }

        /*
        Needed images for buttons:
        Delete
        Change voice
        Change staff
        */

        class JToolbar {
            constructor(private app: ScoreApplication.ScoreApplication) {
                this.makeMenu('#notetools1', JToolbar.menuDef);

                $("#clefs").button(
                    {
                        icons:
                        {
                            secondary: "ui-icon-triangle-1-s"
                        }
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

            static menuDef = [
                {
                    type: "Radiogroup",
                    id: "notes",
                    name: "note",
                    buttons: [
                        {
                            id: "edit",
                            label: "Edit",
                            glyph: "icon-finale",
                            mode: new FinaleUI.FinaleSpeedyEntry()
                        },
                        {
                            id: "delete",
                            label: "Delete",
                            glyph: "icon-lyric",
                            mode: new Editors.EditNoteTextEditor()
                            //new Editors.DeleteNoteEditor("SVGcontext1")
                            //createMode: function(score) { return new Editors.DeleteNoteMode(score, score.getSvgHelper()); }
                        },
                        {
                            id: "2_1",
                            label: "Brevis",
                            glyph: "icon-2_1",
                            mode: new Editors.InsertNoteEditor("SVGcontext1", '2_1', new Model.TimeSpan(2, 1), false, 0)
                            //createMode: function(score) { return new Editors.AddNoteMode(score, 'edit2_1', '2_1', 512, score.getSvgHelper()); }
                        },
                        {
                            id: "1_1",
                            label: "1/1",
                            glyph: "icon-1_1",
                            mode: new Editors.InsertNoteEditor("SVGcontext1", '1_1', new Model.TimeSpan(1, 1), false, 0)
                            //createMode: function(score) { return new Editors.AddNoteMode(score, 'edit1_1', '1_1', 256, score.getSvgHelper()); }
                        },
                        {
                            id: "1_2",
                            label: "1/2",
                            glyph: "icon-1_2",
                            mode: new Editors.InsertNoteEditor("SVGcontext1", '1_2', new Model.TimeSpan(1, 2), false, 0)
                            //createMode: function(score) { return new Editors.AddNoteMode(score, 'edit1_2', '1_2', 128, score.getSvgHelper()); }
                        },
                        {
                            id: "1_4",
                            label: "1/4",
                            glyph: "icon-1_4",
                            mode: new Editors.InsertNoteEditor("SVGcontext1", '1_4', new Model.TimeSpan(1, 4), false, 0)
                            //createMode: function(score) { return new Editors.AddNoteMode(score, 'edit1_4', '1_4', 64, score.getSvgHelper()); }
                        },
                        {
                            id: "1_8",
                            label: "1/8",
                            glyph: "icon-1_8",
                            mode: new Editors.InsertNoteEditor("SVGcontext1", '1_8', new Model.TimeSpan(1, 8), false, 0)
                            //createMode: function(score) { return new Editors.AddNoteMode(score, 'edit1_8', '1_8', 32, score.getSvgHelper()); }
                        },
                        {
                            id: "1_16",
                            label: "1/16",
                            glyph: "icon-1_16",
                            mode: new Editors.InsertNoteEditor("SVGcontext1", '1_16', new Model.TimeSpan(1, 16), false, 0)
                            //createMode: function(score) { return new Editors.AddNoteMode(score, 'edit1_16', '1_16', 16, score.getSvgHelper()); }
                        },
                        {
                            id: "1_32",
                            label: "1/32",
                            glyph: "icon-1_32",
                            mode: new Editors.InsertNoteEditor("SVGcontext1", '1_32', new Model.TimeSpan(1, 32), false, 0)
                            //createMode: function(score) { return new Editors.AddNoteMode(score, 'edit1_32', '1_32', 8, score.getSvgHelper()); }
                        },
                        {
                            id: "1_64",
                            label: "1/64",
                            glyph: "icon-1_64",
                            mode: new Editors.InsertNoteEditor("SVGcontext1", '1_64', new Model.TimeSpan(1, 64), false, 0)
                            //createMode: function(score) { return new Editors.AddNoteMode(score, 'edit1_64', '1_64', 4, score.getSvgHelper()); }
                        },
                        {
                            id: "chgMeter",
                            label: "Meter",
                            glyph: "icon-meter",
                            mode: new Editors.ChangeMeterEditor("SVGcontext1")
                        },
                        {
                            id: "chgKey",
                            label: "Key",
                            glyph: "icon-key",
                            mode: new Editors.ChangeKeyEditor("SVGcontext1")
                        },
                        {
                            id: "chgClef",
                            label: "Clef",
                            glyph: "icon-clef",
                            mode: new Editors.ChangeClefEditor("SVGcontext1")
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
                            onChecked: function (button: HTMLInputElement, app: ScoreApplication.ScoreApplication) {
                                app.Status.rest = button.checked;
                            }
                        },
                        {
                            id: "dotted",
                            label: "Dotted",
                            glyph: "icon-dot",
                            onChecked: function (button: HTMLInputElement, app: ScoreApplication.ScoreApplication) {
                                app.Status.dots = button.checked ? 1 : 0;
                            }
                        },
                        {
                            id: "grace",
                            label: "Grace",
                            glyph: "icon-grace",
                            onChecked: function (button: HTMLInputElement, app: ScoreApplication.ScoreApplication) {
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
                            onChecked: function (button: HTMLInputElement, app: ScoreApplication.ScoreApplication) {
                                app.Undo();
                            },
                            validate: function (app: ScoreApplication.ScoreApplication): boolean {
                                return app.canUndo();
                            }
                        },
                        {
                            id: "redo",
                            label: "Redo",
                            glyph: "icon-redo",
                            onChecked: function (button: HTMLInputElement, app: ScoreApplication.ScoreApplication) {
                                app.Redo();
                            },
                            validate: function (app: ScoreApplication.ScoreApplication): boolean {
                                return app.canRedo();
                            }
                        },
                    ],
                },
                {
                    type: "Buttongroup",
                    id: "_play_operations",
                    buttons: [
                        {
                            id: "play",
                            label: "Play",
                            glyph: "icon-play",// todo: disable when playing
                            onChecked: function (button: HTMLInputElement, app: ScoreApplication.ScoreApplication) {
                                var player = new Players.MidiPlayer();
                                player.playAll(app);
                            },
                            /*validate: function (app: ScoreApplication.ScoreApplication): boolean {
                                return app.canUndo();
                            }*/
                        },
                        {
                            id: "pause",
                            label: "Pause",
                            glyph: "icon-pause",
                            onChecked: function (button: HTMLInputElement, app: ScoreApplication.ScoreApplication) {

                            },
                            /*validate: function (app: ScoreApplication.ScoreApplication): boolean {
                                return app.canRedo();
                            }*/
                        },
                    ],
                }
            ];

            public unregisterModes() {
                var def = JToolbar.menuDef;
                for (var i = 0; i < def.length; i++) {
                    var item = <any>def[i];
                    if (item.type === "Radiogroup" || item.type === "Checkgroup" || item.type === 'Buttongroup') {
                        for (var j = 0; j < item.buttons.length; j++) {
                            var btnDef = <any>item.buttons[j];
                            if (btnDef.mode) { this.app.UnregisterEventProcessor(btnDef.mode); }
                        }
                    }
                }
            }

            private makeMenu(id: string, def: any[]) {
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

                            if (item.type !== 'Buttongroup') {
                                var label = (<any>$('<label/>').attr('for', btnDef.id)
                                    .attr("title", btnDef.label))
                                    .appendTo(grp);
                            }
                            else {
                                //btn.attr('src','');
                            }

                            btn.button({
                                text: true,
                                icons: {
                                    primary: btnDef.glyph
                                },
                            })
                                .data('notedata', btnDef)
                                .data('parent', this)
                                .data('app', this.app)
                                .click(function () {
                                var notedata = $(this).data('notedata');
                                var parent = $(this).data('parent');
                                var app = <ScoreApplication.ScoreApplication>$(this).data('app');

                                if (notedata.mode) {
                                    parent.unregisterModes();
                                    app.RegisterEventProcessor(notedata.mode);
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
                        grp.buttonset();

                        grp.find('span.ui-button-text')
                            .css('padding', '2px');

                    }
                }
            }
        }

        class CheckButtons implements ScoreApplication.ScoreDesigner {
            Validate(app: ScoreApplication.ScoreApplication) {
                var $buttons = $('.note-icon');
                $buttons.each((i: number, e: Element) => {
                    var btnDef = $(e).data('notedata');
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

        export class ToolbarPlugin implements ScoreApplication.ScorePlugin {
            constructor() {
            }

            private toolbar: JToolbar;

            public GetToolbar(): JToolbar {
                return this.toolbar;
            }

            Init(app: ScoreApplication.ScoreApplication) {
                this.toolbar = new JToolbar(app);
                app.AddDesigner(new CheckButtons());
            }

            GetId(): string {
                return "Toolbar";
            }
        }

        export class PianoPlugIn implements ScoreApplication.ScorePlugin, Application.IFeedbackClient { // todo: change sizing of clientArea etc.
            Init(app: ScoreApplication.ScoreApplication) {
                var $root = (<any>$('<div>').addClass('piano').appendTo('#footer'));
                this.createPianoKeyboard($root, { tgWidth: 40 }, app);
                app.FeedbackManager.registerClient(this);
            }

            public changed(status: Application.IStatusManager, key: string, val: any) {
                if (key === "pressKey") {
                    $('#tast' + (<Model.Pitch>val).toMidi()).addClass('down');
                    //$('.staffTitleArea:first').text('#tast' + (<Model.Pitch>val).toMidi());
                }
                else if (key === "releaseKey") {
                    $('#tast' + (<Model.Pitch>val).toMidi()).removeClass('down');
                    //$('.staffTitleArea:last').text('#tast' + (<Model.Pitch>val).toMidi());
                }
            }

            private createPianoKeyboard($root: JQuery, param: { tgWidth: number }, app: ScoreApplication.ScoreApplication) {
                var tgSpacing = param.tgWidth * 7 / 12;
                for (var i = 21; i < 109; i++) {
                    var det = ((i + 7) * 7) % 12;
                    var className = 'bw' + det;
                    var left = (det < 7) ? (i - 21 - det / 7) * tgSpacing : (i - 21 - (det - 8) / 7) * tgSpacing;
                    $root.append(
                        $('<span>')
                            .attr('id', 'tast' + i)
                            .addClass('up')
                            .addClass(className)
                            .css('left', left)
                            .on('mousedown touchstart', function (event: JQueryEventObject) {
                            var $obj = $(this);
                            $obj.data('timer', 1);
                            $obj.data('downX', $obj.position().left);

                            var origEvent: any = event.originalEvent;
                            if (origEvent.targetTouches && origEvent.targetTouches.length === 1) {
                                var touch = origEvent.targetTouches[0];
                                $obj.data('downX', $obj.position().left + touch.clientX);
                            }
                            var p = $(this).attr('id').replace('tast', '');

                            setTimeout(function (p: string) {
                                var timer = $obj.data('timer');
                                if (timer) {
                                    var ev = event;
                                    ev.type = "midinoteon";
                                    (<any>ev).noteInt = parseInt(p);
                                    app.ProcessEvent("midinoteon", ev);
                                }
                            }, 50, p);
                            origEvent.preventDefault();
                        })
                            .on('mouseup touchend', function (ev: JQueryEventObject) {
                            var p = $(this).attr('id').replace('tast', '');
                            ev.type = "midinoteoff";
                            (<any>ev).noteInt = parseInt(p);
                            app.ProcessEvent("midinoteoff", ev);
                            event.preventDefault();
                        })
                    /*.on('touchmove', function (event) {
                        var $obj = $(this);
                        $obj.data('timer', 0);

                        var origEvent: any = event.originalEvent;

                        if (origEvent.targetTouches.length === 1) {
                            var touch = origEvent.targetTouches[0];
                            var downX = parseInt($obj.data('downX'));
                            $obj.parent().css({ position: 'absolute', left: touch.pageX - downX + 'px', bottom: '0px' });
                            //$('.staffTitleArea:last').text($obj.data('downX') + ' ' + downX);
                        }
                        origEvent.preventDefault();}*/
                        );
                }
                return this;
            }


            GetId(): string {
                return "PianoPlugin";
            }
        }
    }
}