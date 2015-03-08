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
        Key
        Clef
        Meter
        Play
        Rest
        Dot
        Grace
        Finale speedy entry
        Note values 1/128 - 2/1
        Enter
        Arrows up down left right
        Accidental +
        Accidental -
        Accidental toggle
        Accidental ()
        Tie
        Flip stem
        Enharmonic
        courtesy accidental
        Delete
        Change voice
        Tuplet 2-8 and generic
        Change staff
        Break/join beam
        Undo
        Redo

        */

        export class JToolbar {
            constructor(private app: ScoreApplication.ScoreApplication) {
                //var _this = this;
                /*UtMiLa.application.State("currentVoice", null);
                UtMiLa.application.State("rest", false);
                UtMiLa.application.State("dots", 0);*/

                this.makeMenu('#notetools1', JToolbar.menuDef);

                /*for (var i = 0; i < scoreOutput.owner.staffElements.length; i++) {
                    for (var j = 0; j < scoreOutput.owner.staffElements[i].voiceElements.length; j++) {
                        var voice = scoreOutput.owner.staffElements[i].voiceElements[j];
                        var voiceOutputs = <ViewsStaves.SVGVoiceOutput[]>voice.getOutputsByContext(scoreOutput.getContext());
                        if (voiceOutputs.length) {
                            voiceOutputs[0].getRef();
                            $(voiceOutputs[0].quickBtn).bind('click', voiceOutputs[0], (event) => {
                                this.selectCurrent(event.data);
                            });
                        }
                    }
                }*/
                //this.noteTools = new JRadioTool(jNoteLengthList, this.scoreOutput, this);
                //this.restTool = new JOnOffTool('rest');
                //this.dotTool = new JOnOffTool('dot');

                /*$("#key").button(
                    {
                        text: false,
                        icons: {
                            primary: "note-icon icon-key",
                            secondary: "ui-icon-triangle-1-s"
                        }
                    }
                    ).click(function () {
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
                    .children("li")
                    .click(function () {
                        var antal = parseInt(this.id.substring(0, 1));
                        var tegn = this.id.substring(1, 2);
                        app.score.setKey(new Model.RegularKeyDefinition(tegn, antal), new Model.AbsoluteTime(0));
                    });*/

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

                /*$("#meter").button(
                    {
                        text: false,
                        icons: {
                            primary: "note-icon icon-meter",
                            //secondary: "ui-icon-triangle-1-s"
                        }
                    }
                    ).click(function () {
                        $("#MeterDialog").dialog("open");
                    });

                /*$('#theText').bind('input', (event) => {
                    if (!this.currentVoice) return;
                    var voiceElm = this.currentVoice.owner;
                    var stringParts = $('#theText').val().split(/\s/);
                    for (var i = 0; i < voiceElm.noteElements.length; i++) {
                        var noteElm = voiceElm.noteElements[i];
                        if (i < stringParts.length) {
                            if (noteElm.syllableElements.length > 0) {
                                noteElm.syllableElements[0].setText(stringParts[i]);
                            }
                            else {
                                var syllableElm = new Model.TextSyllableElement(noteElm, stringParts[i]);
                                noteElm.addChild(noteElm.syllableElements, syllableElm);
                            }
                        }
                        else {
                            if (noteElm.syllableElements.length > 0) {
                                noteElm.syllableElements[0].setText('');
                            }
                        }
                    }
                    //$('#hahaha').text(stringParts.length);
                });*/


                /*$("#MeterDialog").dialog({
                    autoOpen: false,
                    height: 300,
                    width: 350,
                    modal: true,
                    buttons: {
                        "Set time signature": function () {
                            /* set meter* /
                            app.score.setMeter(new Model.RegularMeterDefinition($("#spinner_den").val(), $("#spinner_nom").val()), new Model.AbsoluteTime(0));
                            $(this).dialog("close");
                        },
                        Cancel: function () {
                            $(this).dialog("close");
                        }
                    },
                    close: function () {
                        //allFields.val( "" ).removeClass( "ui-state-error" );
                    }
                });*/
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
                            glyph: "pointer",
                            dx: 7,
                            dy: 16,
                            scale: 1.5,
                            mode: new FinaleUI.FinaleSpeedyEntry()
                        },
                        {
                            id: "delete",
                            label: "Delete",
                            glyph: "pointer",
                            dx: 7,
                            dy: 16,
                            scale: 1.5,
                            mode: new Editors.EditNoteTextEditor ()
                            //new Editors.DeleteNoteEditor("SVGcontext1")
                            //createMode: function(score) { return new Editors.DeleteNoteMode(score, score.getSvgHelper()); }
                        },
                        {
                            id: "2_1",
                            label: "Brevis",
                            glyph: "e_noteheads.sM1",
                            dx: 8,
                            dy: 17,
                            scale: 1.2,
                            mode: new Editors.InsertNoteEditor("SVGcontext1", '2_1', new Model.TimeSpan(2, 1), false, 0)
                            //createMode: function(score) { return new Editors.AddNoteMode(score, 'edit2_1', '2_1', 512, score.getSvgHelper()); }
                        },
                        {
                            id: "1_1",
                            label: "1/1",
                            glyph: "e_noteheads.s0",
                            dx: 8,
                            dy: 17,
                            scale: 1.2,
                            mode: new Editors.InsertNoteEditor("SVGcontext1", '1_1', new Model.TimeSpan(1, 1), false, 0)
                            //createMode: function(score) { return new Editors.AddNoteMode(score, 'edit1_1', '1_1', 256, score.getSvgHelper()); }
                        },
                        {
                            id: "1_2",
                            label: "1/2",
                            glyph: "edit1_2",
                            dx: 12,
                            dy: 18,
                            scale: 1.2,
                            mode: new Editors.InsertNoteEditor("SVGcontext1", '1_2', new Model.TimeSpan(1, 2), false, 0)
                            //createMode: function(score) { return new Editors.AddNoteMode(score, 'edit1_2', '1_2', 128, score.getSvgHelper()); }
                        },
                        {
                            id: "1_4",
                            label: "1/4",
                            glyph: "edit1_4",
                            dx: 10,
                            dy: 21,
                            scale: 1.1,
                            mode: new Editors.InsertNoteEditor("SVGcontext1", '1_4', new Model.TimeSpan(1, 4), false, 0)
                            //createMode: function(score) { return new Editors.AddNoteMode(score, 'edit1_4', '1_4', 64, score.getSvgHelper()); }
                        },
                        {
                            id: "1_8",
                            label: "1/8",
                            glyph: "edit1_8",
                            dx: 10,
                            dy: 17,
                            scale: 1.4,
                            mode: new Editors.InsertNoteEditor("SVGcontext1", '1_8', new Model.TimeSpan(1, 8), false, 0)
                            //createMode: function(score) { return new Editors.AddNoteMode(score, 'edit1_8', '1_8', 32, score.getSvgHelper()); }
                        },
                        {
                            id: "1_16",
                            label: "1/16",
                            glyph: "edit1_16",
                            dx: 10,
                            dy: 24,
                            scale: 1,
                            mode: new Editors.InsertNoteEditor("SVGcontext1", '1_16', new Model.TimeSpan(1, 16), false, 0)
                            //createMode: function(score) { return new Editors.AddNoteMode(score, 'edit1_16', '1_16', 16, score.getSvgHelper()); }
                        },
                        {
                            id: "1_32",
                            label: "1/32",
                            glyph: "edit1_32",
                            dx: 15,
                            dy: 26,
                            scale: 1,
                            mode: new Editors.InsertNoteEditor("SVGcontext1", '1_32', new Model.TimeSpan(1, 32), false, 0)
                            //createMode: function(score) { return new Editors.AddNoteMode(score, 'edit1_32', '1_32', 8, score.getSvgHelper()); }
                        },
                        {
                            id: "1_64",
                            label: "1/64",
                            glyph: "edit1_64",
                            dx: 15,
                            dy: 28,
                            scale: 0.9,
                            mode: new Editors.InsertNoteEditor("SVGcontext1", '1_64', new Model.TimeSpan(1, 64), false, 0)
                            //createMode: function(score) { return new Editors.AddNoteMode(score, 'edit1_64', '1_64', 4, score.getSvgHelper()); }
                        },
                        {
                            id: "chgMeter",
                            label: "Meter",
                            //glyph: "edit1_64",
                            dx: 15,
                            dy: 28,
                            scale: 0.9,
                            mode: new Editors.ChangeMeterEditor("SVGcontext1")
                        },
                        {
                            id: "chgKey",
                            label: "Key",
                            glyph: "icon-key",
                            /*dx: 15,
                            dy: 28,
                            scale: 0.9,*/
                            mode: new Editors.ChangeKeyEditor("SVGcontext1")
                        },
                        {
                            id: "chgClef",
                            label: "Clef",
                            glyph: "icon-clef",
                            /*dx: 15,
                            dy: 28,
                            scale: 0.9,*/
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
                            glyph: "e_rests.2",
                            dx: 7,
                            dy: 16,
                            scale: 1.2,
                            onChecked: function (button: HTMLInputElement, app: ScoreApplication.ScoreApplication) {
                                //toolbar.rest = button.checked;
                                app.Status.rest = button.checked;
                            }
                        },
                        {
                            id: "dotted",
                            label: "Dotted",
                            glyph: "e_dots.dot",
                            dx: 8,
                            dy: 17,
                            scale: 1.2,
                            onChecked: function (button: HTMLInputElement, app: ScoreApplication.ScoreApplication) {
                                //toolbar.dots = button.checked ? 1 : 0;
                                app.Status.dots = button.checked ? 1: 0;
                            }
                        },
                        {
                            id: "grace",
                            label: "Grace",
                            glyph: "edit1_8",
                            dx: 19,
                            dy: 29,
                            scale: 0.8,
                            onChecked: function (button: HTMLInputElement, app: ScoreApplication.ScoreApplication) {
                                app.Status.grace = button.checked;
                            }
                        },
                    ]
                },
            ];

            public unregisterModes() {
                var def = JToolbar.menuDef;
                for (var i = 0; i < def.length; i++) {
                    var item = <any>def[i];
                    if (item.type == "Radiogroup" || item.type == "Checkgroup") {
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
                    if (item.type == "Radiogroup" || item.type == "Checkgroup") {
                        var grp = $('<span>').attr('id', item.id).appendTo(toolbar);
                        for (var j = 0; j < item.buttons.length; j++) {
                            var btnDef = item.buttons[j];
                            var btn = $('<input/>').attr({
                                type: item.type == "Radiogroup" ? "radio" : "checkbox",
                                id: btnDef.id,
                                name: item.type == "Radiogroup" ? item.name : btnDef.id
                            })
                                .appendTo(grp);

                            var label = (<any>$('<label/>').attr('for', btnDef.id)
                                .attr("title", btnDef.label))
                                .text('')
                                /*.addClass('ui-icon')
                                .addClass('note-icon')
                                .addClass(btnDef.glyph)*/
                                .append('<div style="background-position: -4px -4px; background-image: url(images/symbol1/' + btnDef.glyph + '.png); width:35px; height:35px;"></div>')
                                .appendTo(grp);

                            btn.button({
                                text: true,
                                icons: {
                                    primary: btnDef.glyph
                                },
                            })
                                .data('notedata', btnDef)
                            //.data('score', this.scoreOutput)
                                .data('parent', this)
                                .data('app', this.app)
                                .click(function () {
                                    var notedata = $(this).data('notedata');
                                    var parent = $(this).data('parent');
                                    //var score =  $( this ).data('score');
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

                        grp.find('svg')
                            .height(30)
                            .width(35);

                        grp.find('span.ui-button-text')
                            .css('padding', '2px');

                    }
                    else if (item.type == "Button") {
                    }
                }
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

            private createPianoKeyboard($root: JQuery, param: {tgWidth: number}, app: ScoreApplication.ScoreApplication) {
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
                                origEvent.preventDefault();
                            })*/);
                }
                return this;
            }


            GetId(): string {
                return "PianoPlugin";
            }
        }

    }
}