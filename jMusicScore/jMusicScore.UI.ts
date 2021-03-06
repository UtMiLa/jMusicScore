//module JApps {
    import {Model} from "./jMusicScore";
    import {Commands} from "./commands";
    //import {MusicEditors} from "./jMusicScore.Editors";
    import {Views} from "./jMusicScore.Views";
    import { ScoreApplication } from "./jMusicScore.Application";
    import {UI} from "../jApps/Japps.ui";
    import {FinaleUi} from "./FinaleEmulator";
    //import {Players} from "./midiEditor";

    import {Application} from "../JApps/application";    

    export module JMusicScoreUi {
        /* Abstract toolkit */

        export interface IWidget {
            addTo(parent: JQuery, id: string, label: string): JQuery;
        }

        export interface IContainer {
            addWidget(widget: IWidget, id: string, label: string): IWidget;
            $container: JQuery;
        }

        export class UiContainer<TDocumentType extends Application.IAppDoc, TStatusManager extends Application.IStatusManager> {
            constructor(public idPrefix: string, public app: Application.AbstractApplication<TDocumentType, TStatusManager>) {
            }

            public $container: JQuery; // todo: ContainerType;

            public addWidget(widget: IWidget, id: string, label: string): IWidget {
                widget.addTo(this.$container, this.idPrefix + id, label);
                return widget;
            }
        }

        export interface IButtonSettings {
            id: string;
            text: string;
            click: () => void;
        }


        export interface IMenuDef {
            id: string;
            menu?: IMenuDef[];
            caption: string;
            action?: () => void;
        }

        /* tools using JQuery */

        export class MenuPlugin<TDocumentType extends Application.IAppDoc, TStatusManager extends Application.IStatusManager> implements Application.IPlugIn<TDocumentType, TStatusManager> {
            init(app: Application.AbstractApplication<TDocumentType, TStatusManager>) {
                this.app = app;
                var obj = this.getMenuObj(app);
                this.menuAddItem(obj/*, 0*/);
            }

            private app: Application.AbstractApplication<TDocumentType, TStatusManager>;

            getId(): string {
                return "Menu";
            }

            getMenuObj(app: Application.AbstractApplication<TDocumentType, TStatusManager>): IMenuDef {
                return null;
            }

            private menuAddItem(e: IMenuDef) {
                if (e.menu) {
                    if ($('#' + e.id + "Button").length === 0) {
                        $('#notetools')
                            .append(
                            $('<span>')
                                .append(
                                $('<button>')
                                    .attr('id', e.id + "Button")
                                    .text(e.caption)
                                    .addClass("ui-widget-header").addClass("ui-corner-all")
                                )
                                .append(this.menuSubMenu(e))
                            );
                        $('#' + e.id + "Button")
                            .button({
                                showLabel: true,
                            })
                            .click(function () {
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
                            .menu();
                    }
                    else {
                        $('#' + e.id + "Button")
                            .next()
                            //.find('ul')
                            .append(this.menuSubMenu(e).children())
                            .menu("refresh");
                    }

                }
                if (e.action) {
                    $('#notetools')
                        .append(
                        $('<button>')
                            .attr('id', e.id + "Button")
                            .text(e.caption)
                            .addClass("ui-widget-header").addClass("ui-corner-all")
                            .button({
                                showLabel: true,
                            })
                            .click(e.action)
                        );
                }
            }

            private menuSubMenu(e: IMenuDef) {
                var menuItems = $('<ul>');
                var me = this;
                $.each(e.menu, function (i, e1) {
                    var menuItem = $('<li>')
                        .attr('id', e1.id + "Button")
                        .append(
                        $('<a>')
                            .append(
                            $('<span>')
                                .addClass('ui-icon')
                                .addClass('ui-icon-stop')
                            )
                            .text(e1.caption)
                        );
                    menuItems.append(menuItem);

                    if (e1.menu) {
                        menuItem.append(this.menu_subMenu(e1));
                    }
                    if (e1.action) {
                        menuItem.click(e1.action);
                    }
                });
                return menuItems;
            }
        }

        export class Dialog<TDocumentType extends Application.IAppDoc, TStatusManager extends Application.IStatusManager> extends UiContainer<TDocumentType, TStatusManager> {
            constructor(public idPrefix: string, public app: Application.AbstractApplication<TDocumentType, TStatusManager>) {
                super(idPrefix, app);
                this.createDialogElement();
            }

            private get $dialog(): JQuery { return this.$container; }
            private set $dialog(d: JQuery) { this.$container = d; }
            public dialogId: string;
            public dialogTitle: string;
            public width = 350;
            public height = 300;
            public buttonSettings: IButtonSettings[];

            public get dialogObject(): JQuery {
                if (!this.$dialog) this.createDialogElement();
                return this.$dialog;
            }

            public createDialogElement() {
                this.$dialog = $("<div>").attr("id", this.idPrefix + this.dialogId).attr("title", this.dialogTitle).addClass("Dialog");
                $('body').append(this.$dialog);
                this.createBodyElements(this.$dialog);
            }

            public createBodyElements($element: JQuery) {
            }

            public open() {
                this.dialogObject.dialog("open");
            }

            public show() {
                this.addDialog();
                this.onInit();
                this.open();
            }

            public onOk(): boolean { return true; }
            public onCancel() { }
            public onCreate() { }
            public onInit() { }
            public onOpen() { }

            public addDialog() {
                var me = this;
                var buttonSettings = this.buttonSettings || [
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

                this.dialogObject.dialog({
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

        export class CheckboxWidget implements IWidget {
            private $check: JQuery;

            public set value(value: boolean) {
                this.$check.prop("checked", value);
            }

            public get value(): boolean {
                return this.$check.prop("checked");
            }

            public addTo(parent: JQuery, id: string, label: string): JQuery {
                var $div = $("<div>");
                $("<label>").attr("for", id).text(label).appendTo($div);
                this.$check = $("<input>").attr("type", "checkbox").attr("id", id).attr("name", id).appendTo($div);
                parent.append($div);
                return this.$check;
            }
        }


        export class DropdownWidget implements IWidget {
            constructor(public values: { [index: string]: string }) {
                //this.values = values;
            }

            private $ctl: JQuery;
            //public values = {};

            public set value(value: string) {
                this.$ctl.val(value);
            }

            public get value(): string {
                return this.$ctl.val();
            }

            public setOptions(items: Array<any>) {
                this.$ctl.empty();
                $.each(items, (i: number, e: { label: string; val: string; }) => {
                    $('<option>').text(e.label).attr('value', e.val).appendTo(this.$ctl);
                });
            }

            public change(f: () => void) {
                this.$ctl.change(f);
            }

            public addTo(parent: JQuery, id: string, label: string): JQuery {
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

        export class DisplayTextWidget implements IWidget {
            constructor() {
            }

            private $ctl: JQuery;

            public set value(value: string) {
                this.$ctl.text(value);
            }

            public get value(): string {
                return this.$ctl.text();
            }

            public addTo(parent: JQuery, id: string, label: string): JQuery {
                this.$ctl = $("<div>");
                parent.append(this.$ctl);
                return this.$ctl;
            }
        }

        export class CollectionWidget implements IWidget {
            constructor() {
            }

            private $ctl: JQuery;

            public set value(value: string) {
                this.$ctl.text(value);
            }

            public get value(): string {
                return this.$ctl.text();
            }

            public addItem(item: IContainer): void {
                this.$ctl.append(item.$container);
                item.$container.data('owner', item);
                this.$ctl.accordion("refresh");
            }

            public withItems(f: (item: IContainer, index: number) => boolean): void {
                this.$ctl.children().each(function (i: number, e: Element) {
                    return f(<IContainer><any>($(e).data('owner')), i);
                });
            }

            public addTo(parent: JQuery, id: string, label: string): JQuery {
                this.$ctl = $("<div>").attr('id', id);
                parent.append(this.$ctl);
                this.$ctl
                    .accordion({
                        header: "> div > h2",
                        collapsible: true,
                        heightStyle: "content"
                    })
                    .sortable({
                        axis: "y",
                        handle: "h2",
                        stop: function (event: Event, ui: JQueryUI.SortableUIParams) {
                            // IE doesn't register the blur when sorting
                            // so trigger focusout handlers to remove .ui-state-focus
                            ui.item.children("h3").triggerHandler("focusout");
                        }
                    });

                return this.$ctl;
            }
        }

        export class SpinnerWidget implements IWidget {
            private $spinner: JQuery;

            public set value(value: number) {
                this.$spinner.spinner("value", value);
            }

            public get value(): number {
                return this.$spinner.spinner("value");
            }

            public addTo(parent: JQuery, id: string, label: string): JQuery {
                var $div = $("<div>");
                $("<label>").attr("for", id).text(label).appendTo($div);
                this.$spinner = $("<input>").attr("id", id).val("1").attr("name", id).appendTo($div).spinner();
                parent.append($div);
                return this.$spinner;
            }
        }

        export class TextEditWidget implements IWidget {
            private $textEdit: JQuery;

            public set value(value: string) {
                this.$textEdit.val(value);
            }

            public get value(): string {
                return this.$textEdit.val();
            }

            public addTo(parent: JQuery, id: string, label: string): JQuery {
                var $div = $("<div>");
                $("<label>").attr("for", id).text(label).appendTo($div);
                this.$textEdit = $("<input>").attr({ "id": id }).attr("name", id).appendTo($div);
                parent.append($div);
                return this.$textEdit;
            }
        }

        // ************************* File widgets & dialogs ************************ //

        class FileListWidget implements IWidget {
            private $list: JQuery;

            public clear() {
                this.$list.empty();
            }

            public set value(value: string) {
                this.$list.data("filename", value);
            }

            public get value(): string {
                return this.$list.data("filename");
            }


            public existsInFileList(name: string): boolean {
                // tjek om findes
                return this.$list.children("li[value='" + name + "']").length > 0;
            }

            public updateFileList(data: string[]) {
                var $list = this.$list;
                $list.empty();

                $.each(data, function (i, e) {
                    if (e) {
                        $list.append(
                            $('<li>')
                                .attr("value", e)
                                .append(
                                $("<a>").text(e)
                                    .attr("href", "#")
                                    .click(function () {
                                        var name = $(this).text();
                                        $list.children("li").removeClass('selected');
                                        $(this).parent().addClass('selected');
                                        $list.data("filename", name);
                                    })
                                // todo: .dblclick(function () { $('#BtnOk_Open_FileDialog').trigger('click'); })
                                ));
                    }
                });
            }

            public addTo(parent: JQuery, id: string, label: string): JQuery {
                var $div = $("<div>");
                $("<label>").attr("for", id).text(label).appendTo($div);
                this.$list = $("<ul>").attr('id', id).appendTo($div);
                parent.append($div);
                return this.$list;
            }
        }

        export class FileDialog<TDocumentType extends Application.IAppDoc, TStatusManager extends Application.IStatusManager> extends Dialog<TDocumentType, TStatusManager> {
            constructor(public idPrefix: string, public app: Application.AbstractApplication<TDocumentType, TStatusManager>) {
                super(idPrefix, app);
                this.dialogId = "FileDialog";
                this.dialogTitle = "Select file";
                this.height = 600;
            }
            private sourceWidget: DropdownWidget;
            private fileListWidget: FileListWidget;
            private fileTypeWidget: DropdownWidget;

            public onOk(): boolean {
                return true;
            }

            public onInit() {
                var ids = this.app.getFileManagerIds();
                this.sourceWidget.setOptions(<any>$.map(ids, (e, i) => { return { val: e, label: e }; }));
                this.fileTypeWidget.setOptions(<any>$.map(this.app.getFileSaveTypes(), (e, i) => { return { val: e, label: e }; }));

                var me = this;
                var updateFileList = function (source: string) {
                    me.app.getFileList(source, function (data: string[]) {
                        me.fileListWidget.updateFileList(data);
                    });
                };
                this.sourceWidget.change(function () {
                    var item = $(this).val();
                    updateFileList(item);
                });
                updateFileList(this.sourceWidget.value);
            }

            public get filename(): string {
                return this.fileListWidget.value;
            }

            public get source(): string {
                return this.sourceWidget.value;
            }

            public get fileFormat() {
                return this.fileTypeWidget.value;
            }

            public existsInFileList(name: string): boolean {
                // tjek om findes
                return this.fileListWidget.existsInFileList(name);
            }

            public createBodyElements($element: JQuery) {
                this.addWidget(this.sourceWidget = new DropdownWidget({ 0: 'Local', 1: 'Server' }), "fileSource", "File source");
                this.addWidget(this.fileListWidget = new FileListWidget(), "FileList", "Select file"); // todo: class 
                this.addWidget(this.fileTypeWidget = new DropdownWidget({}), "fileTypes", "Select file type");
            }
        }

        export class OpenFileDialog<DocumentType extends Application.IAppDoc, StatusManager extends Application.IStatusManager> extends FileDialog<DocumentType, StatusManager> {
            constructor(public idPrefix: string, public app: Application.AbstractApplication<DocumentType, StatusManager>) {
                super(idPrefix, app);
                this.dialogId = "OpenFileDialog";
                this.dialogTitle = "Open file";
                this.height = 500;
            }

            // todo: dbclk filelist
            public onOk(): boolean {
                if (this.filename) {
                    var type: string = '*';
                    this.app.loadUsing(this.filename, this.source, type);
                }

                return true;
            }
        }

        export class SaveFileDialog<DocumentType extends Application.IAppDoc, StatusManager extends Application.IStatusManager> extends FileDialog<DocumentType, StatusManager> {
            constructor(public idPrefix: string, public app: Application.AbstractApplication<DocumentType, StatusManager>) {
                super(idPrefix, app);
                this.dialogId = "SaveFileDialog";
                this.dialogTitle = "Save file";
                this.height = 600;
            }

            // todo: dbclk filelist
            // todo: filelist clk => filename
            /*.click(function () {
                var name = $(this).text();
                $("#saveFileList li").removeClass('selected');
                $(this).parent().addClass('selected');
                $('#saveFileEdit').val(name);
            })
            .dblclick(function () { $('#BtnOk_SaveAsDialog').trigger('click'); })
            */
            public onOk(): boolean {
                if (this.filename) {
                    // Save file
                    var format = this.fileFormat;
                    var name: string = this.filename;
                    name = name.replace(/[^a-zA-Z0-9_\.]/, '');
                    try {
                        name = this.app.setExtension(name, format);
                        this.filename = name;
                    }
                    catch (exception) {
                        alert("Illegal name");
                        name = "";
                    }
                    if (name) {
                        if (this.existsInFileList(name)) {
                            if (!window.confirm("File exists; overwrite?")) { return; }
                        }
                        var source = this.source;
                        this.app.saveUsing(name, source, format);
                        return true;
                    }
                    return false;
                }

                return true;
            }

            private fileNameWidget: TextEditWidget;

            public get filename() {
                return this.fileNameWidget.value;
            }

            public set filename(name: string) {
                this.fileNameWidget.value = name;
            }

            public createBodyElements($element: JQuery) {
                super.createBodyElements($element);
                this.addWidget(this.fileNameWidget = new TextEditWidget(), "fileName", "Enter file name");
            }
        }
        export interface IAction {
            getCaption(): string;
            getImageUri(): string;
            getSvg(): string;
            getIndex(): number;
            getId(): string;
            getParentId(): string;
            checkEnabled(): void;
        }

        export class RadioActionGroup {
            getId(): string { return undefined; }
        }

        export class RadioAction {
        }

        export class FileMenuPlugin extends MenuPlugin<Model.IScore, ScoreApplication.ScoreStatusManager> {
            constructor() {
                super();
            }
            getMenuObj(app: Application.AbstractApplication<Model.IScore, ScoreApplication.ScoreStatusManager>): IMenuDef {
                return {
                    id: "FileMenu",
                    caption: "File",
                    menu: [
                        {
                            id: "NewMenu",
                            caption: "New",
                            action: () => {
                                app.executeCommand(new Commands.BundleCommand([
                                        new Commands.ClearScoreCommand({}),
                                        new Commands.NewStaffCommand({
                                            index: 0,
                                            title: 'new',
                                            initClef: Model.ClefDefinition.clefG
                                        })
                                    ])
                                );
                            }
                        },
                        {
                            id: "OpenMenu",
                            caption: "Open...",
                            action: () => {
                                new OpenFileDialog<Model.IScore, ScoreApplication.ScoreStatusManager >('open', app).show();
                            }
                        },
                        {
                            id: "SaveMenu",
                            caption: "Save as...",
                            action: () => {
                                new SaveFileDialog<Model.IScore, ScoreApplication.ScoreStatusManager>('save', app).show();
                            }
                        },
                    ]
                };
            }
        }


        // ************************* Music widgets ************************ //

        export class KeyWidget implements IWidget {
            constructor() {
            }
            private values: { [index: string]: string } = {
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

            public set value(value: string) {
                this.val = value;
                this.$button.addClass("ui-icon-triangle-1-s").button({
                    showLabel: false,
                    icon: "note-icon icon-key-" + value,
                    /*icons: {
                        primary: "note-icon icon-key-" + value,
                        secondary: "ui-icon-triangle-1-s"
                    }*/
                });
            }

            public get value(): string {
                return this.val;
            }

            public addTo(parent: JQuery, id: string, label: string): JQuery {
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
                            me.value = value;
                        });
                }
                parent.append($div);
                this.$button.append("<span class='ui-icon-triangle-1-s'>").button(
                    {
                        showLabel: false,
                        icon: "note-icon icon-key",
                        /*icons: {
                            primary: "note-icon icon-key",
                            secondary: "ui-icon-triangle-1-s"
                        }*/
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

        export class TimeWidget implements IWidget {
            private $spinner: JQuery;

            public set value(value: number) {
                this.$spinner.spinner("value", value);
            }

            public get value(): number {
                return this.$spinner.spinner("value");
            }

            public addTo(parent: JQuery, id: string, label: string): JQuery {
                var $div = $("<div>");
                $("<label>").attr("for", id).text(label).appendTo($div);
                this.$spinner = $("<input>").attr("id", id).val("4").attr("name", id).appendTo($div).spinner({
                    spin: function (event: Event, ui: { value: number; }): void {
                        if (ui.value < 1) {
                            $(this).spinner("value", 1);
                            return /*false*/;
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
                            return /*false*/;
                        }
                    }
                });
                parent.append($div);
                return this.$spinner;
            }
        }

        // ************************* Music dialogs ************************ //

        export class ScoreDialog extends Dialog<Model.IScore, ScoreApplication.ScoreStatusManager> {
            constructor(public idPrefix: string, public app: ScoreApplication.IScoreApplication) {
                super(idPrefix, app);
            }
        }

        export class MeterDialog extends ScoreDialog {
            constructor(public idPrefix: string, public app: ScoreApplication.IScoreApplication) {
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
                var numerator = this.numCtl.value;
                var denominator = this.denCtl.value;

                // todo: validation
                this.app.executeCommand(new Commands.SetMeterCommand({
                    meter: new Model.RegularMeterDefinition(numerator, denominator),
                    absTime: this.absTime
                }));
                return true;
            }

            public setTime(absTime: Model.AbsoluteTime): MeterDialog {
                this.absTime = absTime;
                return this;
            }

            public setMeter(definition: Model.IMeterDefinition): MeterDialog {
                var def = <Model.RegularMeterDefinition>definition;
                this.numCtl.value = def.numerator;
                this.denCtl.value = def.denominator;
                this.upbCtl.value = false;
                return this;
            }
            
            public createBodyElements($element: JQuery) {
                this.addWidget(this.numCtl = new SpinnerWidget(), "spinner_num", "Numerator");
                this.addWidget(this.denCtl = new TimeWidget(), "spinner_den", "Denominator");
                this.addWidget(this.upbCtl = new CheckboxWidget(), "check_upbeat", "Upbeat");
            }
        }

        export class KeyDialog extends ScoreDialog {
            constructor(public idPrefix: string, public app: ScoreApplication.IScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "KeyDialog";
                this.dialogTitle = "Edit key";
            }
            private absTime: Model.AbsoluteTime;
            private keyCtl: KeyWidget;

            public onOk(): boolean {
                var key = this.keyCtl.value;
                var no = parseInt(key.substr(0, 1));
                var acci = key.substr(1, 1);
                this.app.executeCommand(new Commands.SetKeyCommand({
                    key: new Model.RegularKeyDefinition(acci, no),
                    absTime: this.absTime
                }));
                return true;
            }

            public setTime(absTime: Model.AbsoluteTime): KeyDialog {
                this.absTime = absTime;
                return this;
            }
            
            public setKey(key: Model.IKey): KeyDialog {
                var def = <Model.RegularKeyDefinition>key.definition;
                this.keyCtl.value = def.number + def.acci;
                return this;
            }

            public createBodyElements($element: JQuery) {
                this.addWidget(this.keyCtl = new KeyWidget(), "key", "Key");                
            }
        }

        export class ClefDialog extends ScoreDialog {
            constructor(public idPrefix: string, public app: ScoreApplication.IScoreApplication) {
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
                var clef = parseInt(this.clefWidget.value);
                var line = this.lineWidget.value;
                var transpose = this.transposeWidget.value;

                this.app.executeCommand(new Commands.SetClefCommand({
                    clef: new Model.ClefDefinition(clef, line, transpose),
                    staff: this.staff,
                    absTime: this.absTime
                }));
                return true;
            }

            public setTime(absTime: Model.AbsoluteTime): ClefDialog {
                this.absTime = absTime;
                return this;
            }
            
            public setStaff(staff: Model.IStaff): ClefDialog {
                this.staff = staff;
                return this;
            }

            public setClef(clef: Model.IClef): ClefDialog {
                var def = clef.definition;
                this.clefWidget.value = '' + def.clefCode;
                this.lineWidget.value = def.clefLine;
                return this;
            }

            public createBodyElements($element: JQuery) {
                this.addWidget(this.clefWidget = new DropdownWidget({1: 'G', 2: 'C', 3: 'F', 4: 'Percussion'}), "clef", "Clef");
                this.addWidget(this.lineWidget = new SpinnerWidget(), "line", "Line");
                this.addWidget(this.transposeWidget = new SpinnerWidget(), "transpose", "Transpose");
                this.transposeWidget.value = 0;
            }
        }
        export class BarDialog extends ScoreDialog {
            constructor(public idPrefix: string, public app: ScoreApplication.IScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "BarDialog";
                this.dialogTitle = "Edit bar settings";
            }
        }
        export class ArticulationDialog extends ScoreDialog {
            constructor(public idPrefix: string, public app: ScoreApplication.IScoreApplication) {
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

        export class NoteDialog extends ScoreDialog {
            constructor(public idPrefix: string, public app: ScoreApplication.IScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "NoteDialog";
                this.dialogTitle = "Edit note settings";
            }
            private stemDirCtl: DropdownWidget;
            private note: Model.INote;

            public createBodyElements($element: JQuery) {
                this.addWidget(this.stemDirCtl = new DropdownWidget({
                    "0": "Free",
                    "1": "Up",
                    "2": "Down"
                }), "NoteDialogStemDirection", "Stem direction");
            }

            public setNote(note: Model.INote): NoteDialog {
                this.note = note;
                this.stemDirCtl.value = "" + note.getStemDirection();
                return this;
            }
             
            public onOk(): boolean {
                var stemDir = this.stemDirCtl.value;

                var note = this.note;
                
                this.app.executeCommand(new Commands.SetNoteStemDirectionCommand({
                    note: note,
                    direction: parseInt(this.stemDirCtl.value)
                }));

                return true;
            }                       
        }

        export class VoiceDialog extends ScoreDialog {
            constructor(public idPrefix: string, public app: ScoreApplication.IScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "VoiceDialog";
                this.dialogTitle = "Edit voice settings";
            }
            private stemDirCtl: DropdownWidget;
            private voice: Model.IVoice;

            public createBodyElements($element: JQuery) {
                this.addWidget(this.stemDirCtl = new DropdownWidget({
                    "0": "Free",
                    "1": "Up",
                    "2": "Down"
                }), "NoteDialogStemDirection", "Stem direction");
            }

            public setVoice(voice: Model.IVoice): VoiceDialog {
                this.voice = voice;
                this.stemDirCtl.value = "" + voice.getStemDirection();
                return this;
            }

            public onOk(): boolean {
                var stemDir = this.stemDirCtl.value;

                var voice = this.voice;

                this.app.executeCommand(new Commands.SetVoiceStemDirectionCommand({
                    voice: voice,
                    direction: parseInt(this.stemDirCtl.value)
                }));

                return true;
            }

        }

        export class NoteheadDialog extends ScoreDialog {
            constructor(public idPrefix: string, public app: ScoreApplication.IScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "NoteheadDialog";
                this.dialogTitle = "Edit notehead settings";
            }
        }
        export class ScoreInfoDialog extends ScoreDialog {
            constructor(public idPrefix: string, public app: ScoreApplication.IScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "ScoreDialog";
                this.dialogTitle = "Edit score settings";
            }
        }
        export class LyricDialog extends ScoreDialog {
            constructor(public idPrefix: string, public app: ScoreApplication.IScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "LyricDialog";
                this.dialogTitle = "Edit lyrics";
            }
        }

        export class TupletDialog extends ScoreDialog {
            constructor(public idPrefix: string, public app: ScoreApplication.IScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "TupletDialog";
                this.dialogTitle = "Edit tuplet";
            }
        }

        export class SpannerDialog extends ScoreDialog {
            constructor(public idPrefix: string, public app: ScoreApplication.IScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "SpannerDialog";
                this.dialogTitle = "Edit spanner";
            }
        }

        export class TextMarkDialog extends ScoreDialog {
            constructor(public idPrefix: string, public app: ScoreApplication.IScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "TextMarkDialog";
                this.dialogTitle = "Edit textmark";
            }
        }

        export class ShowTextDialog extends ScoreDialog {
            constructor(public idPrefix: string, public app: ScoreApplication.IScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "ShowTextDialog";
                this.dialogTitle = "Show text";
                this.width = 600;
                this.height = 500;
            }
            private textDivCtl: DisplayTextWidget;

            public createBodyElements($element: JQuery) {
                this.addWidget(this.textDivCtl = new DisplayTextWidget(), "ShowTextDialogTextDiv", "Text");
            }

            public setText(text: string): ShowTextDialog {
                this.textDivCtl.value = text;
                return this;
            }
            
            public onOk(): boolean {
                return true;
            }

        }

        class StaffContainer extends UiContainer<Model.IScore, ScoreApplication.ScoreStatusManager> implements IContainer {
            constructor(public idPrefix: string, public app: ScoreApplication.IScoreApplication, staff: Model.IStaff, index: number) {
                super(idPrefix, app);

                var title = staff ? staff.title : 'New';

                var $staffItem = $('<div class="StaffItem" >');
                $('<h2>').text(title + ' (' + index + ')').appendTo($staffItem);

                this.$staffDetails = $('<div class="StaffDetails">');
                $staffItem.append(this.$staffDetails);

                this.staff = staff;
                this.$container = $staffItem;
                this.createBodyElements();

                // todo: generalize via this.titleWidget:
                this.$staffDetails.find('#stafftitle') //Title: 
                    .change(function () {
                    $staffItem.children("h2").text(this.value);
                });
            }

            private $staffDetails: JQuery;
            private titleWidget: TextEditWidget;
            private clefWidget: DropdownWidget; // todo: clefWidget
            private lineWidget: SpinnerWidget;
            private transposeWidget: SpinnerWidget;
            public staff: Model.IStaff;

            public addWidget(widget: IWidget, id: string, label: string): IWidget {
                widget.addTo(this.$staffDetails, this.idPrefix + id, label);
                return widget;
            }

            public createBodyElements() {
                this.addWidget(this.titleWidget = new TextEditWidget(), 'title', 'Title');
                this.addWidget(this.clefWidget = new DropdownWidget({ 1: 'G', 2: 'C', 3: 'F', 4: 'Percussion' }), "clef", "Clef");
                this.addWidget(this.lineWidget = new SpinnerWidget(), "line", "Line");
                this.addWidget(this.transposeWidget = new SpinnerWidget(), "transpose", "Transpose");
                this.transposeWidget.value = 0;
            }
        }

        export class StavesDialog extends ScoreDialog {
            constructor(public idPrefix: string, public app: ScoreApplication.IScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "StavesDialog";
                this.dialogTitle = "Staves";
                this.width = 750;
                this.height = 500;
            }
            private stavesWidget: CollectionWidget;

            public onOk(): boolean {
                return true;
            }

            public show() {
                var me = this;

                this.buttonSettings = [
                    {
                        id: 'BtnAdd_StaffDialog',
                        text: "Add staff",
                        click: function () {
                            var s = new StaffContainer('staff', me.app, null, 0);
                            me.stavesWidget.addItem(s);
                        }
                    },
                    {
                        id: 'BtnCancel_' + this.idPrefix + this.dialogId,
                        text: "Cancel",
                        click: function () {
                            me.onCancel();
                            $(this).dialog("close").remove();
                        }
                    },
                    {
                        id: 'BtnOk_StaffDialog',
                        text: "Update staves",
                        click: function () {
                            // todo: DeleteStaffCommand
                            var changeStavesCommand = new Commands.BundleCommand([]);

                            me.stavesWidget.withItems((item: StaffContainer, index: number) => {
                                var staffItem = $(item.$container);
                                var staff = item.staff;
                                if (staff) {
                                    changeStavesCommand.add(new Commands.UpdateStaffCommand({
                                        staff: staff,
                                        index: index,
                                        title: staffItem.find('.TitleInput').val()
                                    }));
                                }
                                else {
                                    // Add Staff
                                    changeStavesCommand.add(new Commands.NewStaffCommand({
                                        index: index,
                                        initClef: Model.ClefDefinition.clefG,
                                        title: staffItem.find('.TitleInput').val()
                                    }));
                                }
                                return true;
                            });

                            me.app.executeCommand(changeStavesCommand);                                    

                            $(this).dialog("close");
                        }
                    },
                ];
                this.addDialog();

                this.app.document.withStaves((staff: Model.IStaff, index: number) => {
                    var s = new StaffContainer('staff', me.app, staff, index);
                    me.stavesWidget.addItem(s);
                });

                this.open();
            }

            public createBodyElements($element: JQuery) {
                var me = this;
                this.addWidget(this.stavesWidget = new CollectionWidget(), "staves", "Staves");
            }
        }

        export class QuickMenuPlugin extends MenuPlugin<Model.IScore, ScoreApplication.ScoreStatusManager> {
            constructor(private id: string, private menuCaption: string, private parentId: string, private parentCaption: string, private menuAction: () => void) {
                super();
            }

            getMenuObj(app: ScoreApplication.IScoreApplication): IMenuDef {
                // ****************** Custom action ******************* //
                var menuItem = {
                    id: this.id,
                    caption: this.menuCaption,
                    action: this.menuAction
                };

                return this.parentId ? {
                    id: this.parentId,
                    caption: this.parentCaption,
                    menu: [menuItem]
                } : menuItem;
            }
        }


        export class VoiceMenuPlugin extends QuickMenuPlugin {
            constructor(app: ScoreApplication.IScoreApplication) {
                super("VoiceMenu", "Voice", "", "", function () {
                    new VoiceDialog('menu', app).setVoice(app.Status.currentVoice).show();
                });
            }
        }

        export class StavesMenuPlugin extends QuickMenuPlugin {
            constructor(app: ScoreApplication.IScoreApplication) {
                super("StavesMenu", "Staves", "", "", function () {
                    new StavesDialog('menu', app).show();
                });
            }
        }

        export class ExportMenuPlugin extends MenuPlugin<Model.IScore, ScoreApplication.ScoreStatusManager> {
            constructor() {
                super();
            }
            getMenuObj(app: ScoreApplication.IScoreApplication): IMenuDef {
                return {
                    id: "ExportMenu",
                    caption: "Export",
                    menu: [
                        {
                            id: "SVGMenu",
                            caption: "SVG",
                            action: () => {
                                new ShowTextDialog('menu', app).setText(app.saveToString('SVG')).show();
                            }
                        },
                        {
                            id: "ExportJson",
                            caption: "JSON",
                            action: () => {
                                new ShowTextDialog('menu', app).setText(app.saveToString('JSON')).show();
                            }
                        },
                        {
                            id: "ExportLilypond",
                            caption: "Lilypond",
                            action: () => {
                                new ShowTextDialog('menu', app).setText(app.saveToString('Lilypond')).show();
                            }
                        },
                        {
                            id: "MusicXmlMenu",
                            caption: "MusicXml",
                            action: () => {
                                new ShowTextDialog('menu', app).setText(app.saveToString('MusicXML')).show();
                            }
                        }
                    ]
                };
            }
        }



        class FinaleSpeedyAction extends RadioAction {
            getCaption(): string { return "Edit"; }
            getImageUri(): string { return "icon-finale"; }
            getSvg(): string { return undefined; }
            getIndex(): number { return 0; }
            getId(): string { return "edit"; }
            getParentId(): string { return "notes"; }
            checkEnabled(): void {
            }

            private mode = new FinaleUi.FinaleSpeedyEntry();

            getMode(): ScoreApplication.IScoreEventProcessor {
                return this.mode;
            }
        }


        /*
        Needed images for buttons:
        Delete
        Change voice
        Change staff
        */
        export interface IToolBtnDef {
            id: string;
            label: string;
            glyph: string;
            mode?: ScoreApplication.IScoreEventProcessor;
            onChecked?: (button: HTMLInputElement, app: ScoreApplication.IScoreApplication) => void;
            validate?: (app: ScoreApplication.IScoreApplication) => boolean;
        }

        export interface IToolDef {
            type: string;
            name?: string;
            id: string;
            buttons?: IToolBtnDef[];
        }


        export class PianoPlugIn implements ScoreApplication.IScorePlugin, Application.IFeedbackClient { // todo: change sizing of clientArea etc.
            init(app: ScoreApplication.IScoreApplication) {
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

            private createPianoKeyboard($root: JQuery, param: { tgWidth: number }, app: ScoreApplication.IScoreApplication) {
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
                                    //var ev = new Event("midinoteon");
                                    //(<any>ev).noteInt = parseInt(p);
                                    app.processEvent("midinoteon", { noteInt: parseInt(p) });
                                }
                            }, 50, p);
                            origEvent.preventDefault();
                        })
                            .on('mouseup touchend', function (ev: JQueryEventObject) {
                            var p = $(this).attr('id').replace('tast', '');
                            //ev.type = "midinoteoff";
                            //(<any>ev).noteInt = parseInt(p);
                            app.processEvent("midinoteoff", { noteInt: parseInt(p) });
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


            getId(): string {
                return "PianoPlugin";
            }
        }
    }
//}