module jMusicScore {
    export module Dialogs {
        export class Menu {
        }
        export class MenuItem {
        }

        export interface IWidget {
            AddTo(parent: JQuery, id: string, label: string): JQuery;
        }

        export class CheckboxWidget implements IWidget {
            private $check: JQuery;

            public set Value(value: boolean) {
                this.$check.prop("checked", value);
            }

            public get Value(): boolean {
                return this.$check.prop("checked");
            }

            public AddTo(parent: JQuery, id: string, label: string): JQuery {
                var $div = $("<div>");
                $("<label>").attr("for", id).text(label).appendTo($div);
                this.$check = $("<input>").attr("type", "checkbox").attr("id", id).attr("name", id).appendTo($div);
                parent.append($div);
                return this.$check;
            }
        }


        export class DropdownWidget implements IWidget {
            constructor(public values: { [Index: string]: string} ) {
                //this.values = values;
            }

            private $ctl: JQuery;
            //public values = {};

            public set Value(value: string) {
                this.$ctl.val(value);
            }

            public get Value(): string {
                return this.$ctl.val();
            }

            public SetOptions(items: Array<any>) {
                this.$ctl.empty();
                $.each(items, (i, e) => {
                    $('<option>').text(e.label).attr('value', e.val).appendTo(this.$ctl);
                });
            }

            public change(f: () => void) {
                this.$ctl.change(f);
            }

            public AddTo(parent: JQuery, id: string, label: string): JQuery {
                var $div = $("<div>");
                $("<label>").attr("for", id).text(label).appendTo($div);
                this.$ctl = $("<select>").attr("id", id).attr("name", id).appendTo($div);
                for (var key in this.values) {
                    var valu = this.values[key];
                    $('<option>').text(valu).attr('value', key).appendTo(this.$ctl);
                }
                parent.append($div);
                return this.$ctl;
            }
        }

        export class KeyWidget implements IWidget {
            constructor() {
            }
            private values: { [Index: string]: string } = {
                    "0": "C/a",
                    "1x": "G/e",
                    "2x": "D/h",
                    "3x": "A/fis",
                    "4x": "E/cis",
                    "5x": "H/gis",
                    "6x": "Fis/dis",
                    "7x": "Cis/ais",
                    "1b": "F/d",
                    "2b": "B/g",
                    "3b": "Es/c",
                    "4b": "As/f",
                    "5b": "Des/b",
                    "6b": "Ges/es"
                };

            private val: string;
            private $button: JQuery;

            public set Value(value: string) {
                this.val = value;
                this.$button.button({
                    text: false,
                    icons: {
                        primary: "note-icon icon-key-" + value,
                        secondary: "ui-icon-triangle-1-s"
                    }
                });
            }

            public get Value(): string {
                return this.val;
            }

            public AddTo(parent: JQuery, id: string, label: string): JQuery {
                var $div = $("<div>");
                $("<label>").attr("for", id).text(label).appendTo($div);
                this.$button = $('<button>').attr('id', id).appendTo($div);
                var $ul = $('<ul>').appendTo($div);
                var me = this;
                //this.$ctl = $("<select>").attr("id", id).attr("name", id).appendTo($div);
                for (var key in this.values) {
                    var valu = this.values[key];
                    var $li = $('<li>').attr('id', key).appendTo($ul);
                    $('<a>').attr('href', "#").appendTo($li)
                        .append($('<span>').addClass('ui-icon note-icon icon-key-' + key))
                        .append($('<span>').text(valu))
                        .click(function () {
                            var value = $(this).parent().attr('id');
                            me.Value = value;
                        });
                }
                parent.append($div);
                this.$button.button(
                    {
                        text: false,
                        icons: {
                            primary: "note-icon icon-key",
                            secondary: "ui-icon-triangle-1-s"
                        }
                    })
                    .click(function () {
                        var menu = $ul.show().position({
                            my: "left top",
                            at: "left bottom",
                            of: this
                        });
                        $(document).one("click", function () {
                            menu.hide();
                        });
                        return false;
                    });
                $ul.hide().menu();

                return null;
            }

        }

        export class SpinnerWidget implements IWidget{
            private $spinner: JQuery;

            public set Value(value: number) {
                this.$spinner.spinner("value", value);
            }

            public get Value(): number {
                return this.$spinner.spinner("value");
            }

            public AddTo(parent: JQuery, id: string, label: string): JQuery {
                var $div = $("<div>");
                $("<label>").attr("for", id).text(label).appendTo($div);
                this.$spinner = $("<input>").attr("id", id).val("1").attr("name", id).appendTo($div).spinner();
                parent.append($div);
                return this.$spinner;
            }
        }

        export class TimeWidget implements IWidget {
            private $spinner: JQuery;

            public set Value(value: number) {
                this.$spinner.spinner("value", value);
            }

            public get Value(): number {
                return this.$spinner.spinner("value");
            }

            public AddTo(parent: JQuery, id: string, label: string): JQuery {
                var $div = $("<div>");
                $("<label>").attr("for", id).text(label).appendTo($div);
                this.$spinner = $("<input>").attr("id", id).val("4").attr("name", id).appendTo($div).spinner({
                    spin: function (event: Event, ui: { value: number; }) {
                        if (ui.value < 1) {
                            $(this).spinner("value", 1);
                            return false;
                        }
                        else {
                            var currentVal = $(this).spinner("value");
                            if (ui.value < currentVal) {
                                $(this).spinner("value", currentVal / 2);
                            }
                            else if (ui.value > currentVal) {
                                $(this).spinner("value", currentVal * 2);
                            }
                            else { }
                            return false;
                        }
                    }
                });
                parent.append($div);
                return this.$spinner;
            }
        }

        export class UIContainer {
            constructor(public idPrefix: string, public app: ScoreApplication.ScoreApplication) {
            }

            public AddWidget(widget: IWidget, parent: JQuery, id: string, label: string): IWidget {
                widget.AddTo(parent, this.idPrefix + id, label);
                return widget;
            }
        }

        export class Dialog extends UIContainer {
            constructor(public idPrefix: string, public app: ScoreApplication.ScoreApplication) {
                super(idPrefix, app);
            }

            private $dialog: JQuery;
            public dialogId: string;
            public dialogTitle: string;
            public width = 350;
            public height = 300;

            public get DialogObject(): JQuery {
                if (!this.$dialog) this.CreateDialogElement();
                return this.$dialog;
            }

            public CreateDialogElement() {
                this.$dialog = $("<div>").attr("id", this.idPrefix + this.dialogId).attr("title", this.dialogTitle).addClass("Dialog");
                $('body').append(this.$dialog);
                this.CreateBodyElements(this.$dialog);                
            }

            public CreateBodyElements($element: JQuery) {
            }

            public onOk(): boolean { return true; }
            public onCancel() { }
            public onCreate() { }
            public onInit() { }
            public onOpen() { }

            public addDialog() {
                var me = this;
                var buttonSettings = [
                            {
                                id: 'BtnOk_' + this.idPrefix + this.dialogId,
                                text: "Ok",
                                click: function () {
                                    if (me.onOk()) {
                                        $(this).dialog("close").remove();
                                    }
                                }
                            },
                            {
                                id: 'BtnCancel_' + this.idPrefix + this.dialogId,
                                text: "Cancel",
                                click: function () {
                                    me.onCancel();
                                    $(this).dialog("close").remove();
                                }
                            }
                        ];
                
                this.DialogObject.dialog({
                        autoOpen: false,
                        height: this.height,
                        width: this.width,
                        modal: true,
                        buttons: buttonSettings,
                        open: this.onOpen,
                        close: function () {
                            //allFields.val( "" ).removeClass( "ui-state-error" );
                        }
                    });

                this.onCreate();                
            }

        }

        export class MeterDialog extends Dialog {
            constructor(public idPrefix: string, public app: ScoreApplication.ScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "MeterDialog";
                this.dialogTitle = "Select time signature";
            }
            public height = 400;

            private numCtl: SpinnerWidget;
            private denCtl: TimeWidget;
            private upbCtl: CheckboxWidget;

            private absTime = Model.AbsoluteTime.startTime;

            public onOk(): boolean {
                var numerator = this.numCtl.Value;
                var denominator = this.denCtl.Value;

                // todo: validation
                this.app.ExecuteCommand(new Model.SetMeterCommand({
                    meter: new Model.RegularMeterDefinition(numerator, denominator),
                    absTime: this.absTime
                }));
                return true;
            }

            public Show(absTime: Model.AbsoluteTime, definition: Model.IMeterDefinition = null) {
                this.absTime = absTime;
                this.addDialog();

                var $dlg = this.DialogObject;
                $dlg.data('absTime', absTime);
                this.onInit();

                if (definition) {
                    var def = <Model.RegularMeterDefinition>definition;
                    this.numCtl.Value = def.numerator;
                    this.denCtl.Value = def.denominator;
                    this.upbCtl.Value = false;
                }

                $dlg.dialog("open");
            }

            public CreateBodyElements($element: JQuery) {
                this.AddWidget(this.numCtl = new SpinnerWidget(), $element, "spinner_num", "Numerator");
                this.AddWidget(this.denCtl = new TimeWidget(), $element, "spinner_den", "Denominator");
                this.AddWidget(this.upbCtl = new CheckboxWidget(), $element, "check_upbeat", "Upbeat");
            }
        }

        export class KeyDialog extends Dialog {
            constructor(public idPrefix: string, public app: ScoreApplication.ScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "KeyDialog";
                this.dialogTitle = "Edit key";
            }
            private absTime: Model.AbsoluteTime;
            private keyCtl: KeyWidget;

            public onOk(): boolean {
                var key = this.keyCtl.Value;
                var no = parseInt(key.substr(0, 1));
                var acci = key.substr(1, 1);
                this.app.ExecuteCommand(new Model.SetKeyCommand({
                    key: new Model.RegularKeyDefinition(acci, no),
                    absTime: this.absTime
                }));
                return true;
            }

            public Show(absTime: Model.AbsoluteTime, key: Model.IKey = null) {
                this.absTime = absTime;
                this.addDialog();

                var $dlg = this.DialogObject;
                $dlg.data('absTime', absTime);
                this.onInit();

                if (key) {
                    var def = <Model.RegularKeyDefinition>key.definition;
                    this.keyCtl.Value = def.number + def.acci;
                }

                $dlg.dialog("open");
            }

            public CreateBodyElements($element: JQuery) {
                this.AddWidget(this.keyCtl = new KeyWidget(), $element, "key", "Key");                
            }
        }

        export class ClefDialog extends Dialog {
            constructor(public idPrefix: string, public app: ScoreApplication.ScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "ClefDialog";
                this.dialogTitle = "Edit clef";
            }
            private clefWidget: DropdownWidget;
            private lineWidget: SpinnerWidget;
            private transposeWidget: SpinnerWidget;
            private absTime: Model.AbsoluteTime;
            private staff: Model.IStaff;

            public onOk(): boolean {
                var clef = parseInt(this.clefWidget.Value);
                var line = this.lineWidget.Value;
                var transpose = this.transposeWidget.Value;

                this.app.ExecuteCommand(new Model.SetClefCommand({
                    clef: new Model.ClefDefinition(clef, line, transpose),
                    staff: this.staff,
                    absTime: this.absTime
                }));
                return true;
            }

            public Show(absTime: Model.AbsoluteTime, staff: Model.IStaff, clef: Model.IClef = null) {
                this.absTime = absTime;
                this.staff = staff;
                this.addDialog();

                var $dlg = this.DialogObject;
                //$dlg.data('absTime', absTime);
                this.onInit();

                if (clef) {
                    // todo: inititalize
                    var def = clef.definition;
                    this.clefWidget.Value = '' + def.clefCode;
                    this.lineWidget.Value = def.clefLine;
                }

                $dlg.dialog("open");
            }

            public CreateBodyElements($element: JQuery) {
                this.AddWidget(this.clefWidget = new DropdownWidget({1: 'G', 2: 'C', 3: 'F', 4: 'Percussion'}), $element, "clef", "Clef");
                this.AddWidget(this.lineWidget = new SpinnerWidget(), $element, "line", "Line");
                this.AddWidget(this.transposeWidget = new SpinnerWidget(), $element, "transpose", "Transpose");
                this.transposeWidget.Value = 0;
            }
        }
        export class BarDialog extends Dialog {
            constructor(public idPrefix: string, public app: ScoreApplication.ScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "BarDialog";
                this.dialogTitle = "Edit bar settings";
            }
        }
        export class ArticulationDialog extends Dialog {
            constructor(public idPrefix: string, public app: ScoreApplication.ScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "ArticulationDialog";
                this.dialogTitle = "Select articulation";
            }
            /*
            
                <div id="ArticulationDialog" class="Dialog" title = "Select articulation" >
        <div class="expressionmark" id = "e_scripts.espr" >< / div >
        <div class="expressionmark" id = "e_scripts.staccato" >< / div >
        <div class="expressionmark" id = "e_scripts.ustaccatissimo" >< / div >
        <div class="expressionmark" id = "e_scripts.tenuto" >< / div >
        <div class="expressionmark" id = "e_scripts.uportato" >< / div >
        <div class="expressionmark" id = "e_scripts.umarcato" >< / div >
        < / div >

        $('.expressionmark')
            .svg(function (svg, error) {
                svg.path(emmentaler_notes[this.id], { transform: 'scale(1.2,1.2), translate(10,12)' });
            })
            .height(25)
            .width(30)
            .button()
            .click(function () {
                alert(this.id);
            })
            .find('span.ui-button-text').css('padding', '2px')
            .find('svg')
            .height(20)
            .width(35);
        ;

            
            */


        }

        export class NoteDialog extends Dialog {
            constructor(public idPrefix: string, public app: ScoreApplication.ScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "NoteDialog";
                this.dialogTitle = "Edit note settings";
            }
            private stemDirCtl: DropdownWidget;

            public CreateBodyElements($element: JQuery) {
                this.AddWidget(this.stemDirCtl = new DropdownWidget({
                    "0": "Free",
                    "1": "Up",
                    "2": "Down"
                }), $element, "NoteDialogStemDirection", "Stem direction");
            }

            public Show(note: Model.INote) {
                this.addDialog();
                var $dlg = this.DialogObject;
                $dlg.data('note', note);
                this.onInit();
                this.stemDirCtl.Value = "" + note.getStemDirection();

                $dlg.dialog("open");
            }
             
            public onOk(): boolean {
                var stemDir = this.stemDirCtl.Value;

                var note = $("#" + this.idPrefix + this.dialogId).data("note");
                
                this.app.ExecuteCommand(new Model.SetNoteStemDirectionCommand({
                    note: note,
                    direction: parseInt(this.stemDirCtl.Value)
                }));

                return true;
            }                       
        }

        export class VoiceDialog extends Dialog {
            constructor(public idPrefix: string, public app: ScoreApplication.ScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "VoiceDialog";
                this.dialogTitle = "Edit voice settings";
            }
            private stemDirCtl: DropdownWidget;

            public CreateBodyElements($element: JQuery) {
                this.AddWidget(this.stemDirCtl = new DropdownWidget({
                    "0": "Free",
                    "1": "Up",
                    "2": "Down"
                }), $element, "NoteDialogStemDirection", "Stem direction");
            }

            public Show(voice: Model.IVoice) {
                this.addDialog();
                var $dlg = this.DialogObject;
                $dlg.data('voice', voice);
                this.onInit();
                this.stemDirCtl.Value = "" + voice.getStemDirection();

                $dlg.dialog("open");
            }

            public onOk(): boolean {
                var stemDir = this.stemDirCtl.Value;

                var voice = this.DialogObject.data("voice");

                this.app.ExecuteCommand(new Model.SetVoiceStemDirectionCommand({
                    voice: voice,
                    direction: parseInt(this.stemDirCtl.Value)
                }));

                return true;
            }

        }

        export class NoteheadDialog extends Dialog {
            constructor(public idPrefix: string, public app: ScoreApplication.ScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "NoteheadDialog";
                this.dialogTitle = "Edit notehead settings";
            }
        }
        export class ScoreDialog extends Dialog {
            constructor(public idPrefix: string, public app: ScoreApplication.ScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "ScoreDialog";
                this.dialogTitle = "Edit score settings";
            }
        }
        export class LyricDialog extends Dialog {
            constructor(public idPrefix: string, public app: ScoreApplication.ScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "LyricDialog";
                this.dialogTitle = "Edit lyrics";
            }
        }

        export class TupletDialog extends Dialog {
            constructor(public idPrefix: string, public app: ScoreApplication.ScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "TupletDialog";
                this.dialogTitle = "Edit tuplet";
            }
        }

        export class SpannerDialog extends Dialog {
            constructor(public idPrefix: string, public app: ScoreApplication.ScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "SpannerDialog";
                this.dialogTitle = "Edit spanner";
            }
        }

        export class TextMarkDialog extends Dialog {
            constructor(public idPrefix: string, public app: ScoreApplication.ScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "TextMarkDialog";
                this.dialogTitle = "Edit textmark";
            }
        }
    }

}