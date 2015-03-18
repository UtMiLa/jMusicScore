module jMusicScore {
    export module UI {

        /* Abstract toolkit */

        export interface IWidget {
            AddTo(parent: JQuery, id: string, label: string): JQuery;
        }

        export interface IContainer {
            AddWidget(widget: IWidget, id: string, label: string): IWidget;
            $container: JQuery;
        }

        export class UIContainer<DocumentType extends Application.IAppDoc, StatusManager extends Application.IStatusManager, ContainerType> {
            constructor(public idPrefix: string, public app: Application.Application<DocumentType, StatusManager, ContainerType>) {
            }

            public $container: JQuery; // todo: ContainerType;

            public AddWidget(widget: IWidget, id: string, label: string): IWidget {
                widget.AddTo(this.$container, this.idPrefix + id, label);
                return widget;
            }
        }

        export interface IButtonSettings {
            id: string;
            text: string;
            click: () => void;
        }


        export interface IMenuDef {
            Id: string;
            Menu?: IMenuDef[];
            Caption: string;
            action?: (e: Event) => void;
        }

        /* tools using JQuery */

        export class MenuPlugin implements ScoreApplication.ScorePlugin {
            Init(app: ScoreApplication.ScoreApplication) {
                this.app = app;
                var obj = this.GetMenuObj(app);
                this.menu_addItem(obj/*, 0*/);
            }

            private app: ScoreApplication.ScoreApplication;

            GetId(): string {
                return "Menu";
            }

            GetMenuObj(app: ScoreApplication.ScoreApplication): IMenuDef {
                return null;
            }

            private menu_addItem(e: IMenuDef) {
                if (e.Menu) {
                    if ($('#' + e.Id + "Button").length === 0) {
                        $('#notetools')
                            .append(
                            $('<span>')
                                .append(
                                $('<button>')
                                    .attr('id', e.Id + "Button")
                                    .text(e.Caption)
                                    .addClass("ui-widget-header").addClass("ui-corner-all")
                                )
                                .append(this.menu_subMenu(e))
                            );
                        $('#' + e.Id + "Button")
                            .button({
                            text: true,
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
                        $('#' + e.Id + "Button")
                            .next()
                        //.find('ul')
                            .append(this.menu_subMenu(e).children())
                            .menu("refresh");
                    }

                }
                if (e.action) {
                    $('#notetools')
                        .append(
                        $('<button>')
                            .attr('id', e.Id + "Button")
                            .text(e.Caption)
                            .addClass("ui-widget-header").addClass("ui-corner-all")
                            .button({
                            text: true,
                        })
                            .click(e.action)
                        );
                }
            }

            private menu_subMenu(e: IMenuDef) {
                var menuItems = $('<ul>');
                var me = this;
                $.each(e.Menu, function (i, e1) {
                    var menuItem = $('<li>')
                        .attr('id', e1.Id + "Button")
                        .append(
                        $('<a>')
                            .append(
                            $('<span>')
                                .addClass('ui-icon')
                                .addClass('ui-icon-stop')
                            )
                            .text(e1.Caption)
                        );
                    menuItems.append(menuItem);

                    if (e1.Menu) {
                        menuItem.append(this.menu_subMenu(e1));
                    }
                    if (e1.action) {
                        menuItem.click(e1.action);
                    }
                });
                return menuItems;
            }
        }

        export class Dialog<DocumentType extends Application.IAppDoc, StatusManager extends Application.IStatusManager, ContainerType> extends UIContainer<DocumentType, StatusManager, ContainerType> {
            constructor(public idPrefix: string, public app: Application.Application<DocumentType, StatusManager, ContainerType>) {
                super(idPrefix, app);
                this.CreateDialogElement();
            }

            private get $dialog(): JQuery { return this.$container; }
            private set $dialog(d: JQuery) { this.$container = d; }
            public dialogId: string;
            public dialogTitle: string;
            public width = 350;
            public height = 300;
            public buttonSettings: IButtonSettings[];

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

            public Open() {
                this.DialogObject.dialog("open");
            }

            public Show() {
                this.addDialog();
                this.onInit();
                this.Open();
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

        export class DisplayTextWidget implements IWidget {
            constructor() {                
            }

            private $ctl: JQuery;
            
            public set Value(value: string) {
                this.$ctl.text(value);
            }

            public get Value(): string {
                return this.$ctl.text();
            }

            public AddTo(parent: JQuery, id: string, label: string): JQuery {
                this.$ctl = $("<div>");
                parent.append(this.$ctl);
                return this.$ctl;
            }
        }

        export class CollectionWidget implements IWidget {
            constructor() {
            }

            private $ctl: JQuery;

            public set Value(value: string) {
                this.$ctl.text(value);
            }

            public get Value(): string {
                return this.$ctl.text();
            }

            public AddItem(item: IContainer): void {
                this.$ctl.append(item.$container);
                item.$container.data('owner', item);
                this.$ctl.accordion("refresh");
            }

            public withItems(f: (item: IContainer, index: number) => boolean): void {
                this.$ctl.children().each(function (i: number, e: Element) {
                    return f($(e).data('owner'), i);
                });
            }

            public AddTo(parent: JQuery, id: string, label: string): JQuery {
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

        export class TextEditWidget implements IWidget {
            private $textEdit: JQuery;

            public set Value(value: string) {
                this.$textEdit.val(value);
            }

            public get Value(): string {
                return this.$textEdit.val();
            }

            public AddTo(parent: JQuery, id: string, label: string): JQuery {
                var $div = $("<div>");
                $("<label>").attr("for", id).text(label).appendTo($div);
                this.$textEdit = $("<input>").attr({ "id": id }).attr("name", id).appendTo($div);
                parent.append($div);
                return this.$textEdit;
            }
        }

        // ************************* File widgets & dialogs ************************ //

        class FileListWidget implements UI.IWidget {
            private $list: JQuery;

            public Clear() {
                this.$list.empty();
            }

            public set Value(value: string) {
                this.$list.data("filename", value);
            }

            public get Value(): string {
                return this.$list.data("filename");
            }


            public existsInFileList(name: string): boolean {
                // tjek om findes
                return this.$list.children("li[value='" + name + "']").length > 0;
            }

            public UpdateFileList(data: string[]) {
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

            public AddTo(parent: JQuery, id: string, label: string): JQuery {
                var $div = $("<div>");
                $("<label>").attr("for", id).text(label).appendTo($div);
                this.$list = $("<ul>").attr('id', id).appendTo($div);
                parent.append($div);
                return this.$list;
            }
        }

        export class FileDialog<DocumentType extends Application.IAppDoc, StatusManager extends Application.IStatusManager, ContainerType> extends UI.Dialog<DocumentType, StatusManager, ContainerType> {
            constructor(public idPrefix: string, public app: Application.Application<DocumentType, StatusManager, ContainerType>) {
                super(idPrefix, app);
                this.dialogId = "FileDialog";
                this.dialogTitle = "Select file";
                this.height = 600;
            }
            private sourceWidget: UI.DropdownWidget;
            private fileListWidget: FileListWidget;
            private fileTypeWidget: UI.DropdownWidget;

            public onOk(): boolean {
                return true;
            }

            public onInit() {
                var ids = this.app.GetFileManagerIds();
                this.sourceWidget.SetOptions(<any>$.map(ids,(e, i) => { return { val: e, label: e }; }));
                this.fileTypeWidget.SetOptions(<any>$.map(this.app.GetFileSaveTypes(),(e, i) => { return { val: e, label: e }; }));

                var me = this;
                var updateFileList = function (source: string) {
                    me.app.GetFileList(source, function (data: string[]) {
                        me.fileListWidget.UpdateFileList(data);
                    });
                }
                this.sourceWidget.change(function () {
                    var item = $(this).val();
                    updateFileList(item);
                });
                updateFileList(this.sourceWidget.Value);
            }

            public get filename(): string {
                return this.fileListWidget.Value;
            }

            public get source(): string {
                return this.sourceWidget.Value;
            }

            public get fileFormat() {
                return this.fileTypeWidget.Value;
            }

            public existsInFileList(name: string): boolean {
                // tjek om findes
                return this.fileListWidget.existsInFileList(name);
            }

            public CreateBodyElements($element: JQuery) {
                this.AddWidget(this.sourceWidget = new UI.DropdownWidget({ 0: 'Local', 1: 'Server' }), "fileSource", "File source");
                this.AddWidget(this.fileListWidget = new FileListWidget(), "FileList", "Select file"); // todo: class 
                this.AddWidget(this.fileTypeWidget = new UI.DropdownWidget({}), "fileTypes", "Select file type");
            }
        }

        class OpenFileDialog<DocumentType extends Application.IAppDoc, StatusManager extends Application.IStatusManager, ContainerType> extends FileDialog<DocumentType, StatusManager, ContainerType> {
            constructor(public idPrefix: string, public app: Application.Application<DocumentType, StatusManager, ContainerType>) {
                super(idPrefix, app);
                this.dialogId = "OpenFileDialog";
                this.dialogTitle = "Open file";
                this.height = 500;
            }

            // todo: dbclk filelist
            public onOk(): boolean {
                if (this.filename) {
                    var type: string = '*';
                    this.app.LoadUsing(this.filename, this.source, type);
                }

                return true;
            }
        }

        class SaveFileDialog<DocumentType extends Application.IAppDoc, StatusManager extends Application.IStatusManager, ContainerType> extends FileDialog<DocumentType, StatusManager, ContainerType> {
            constructor(public idPrefix: string, public app: Application.Application<DocumentType, StatusManager, ContainerType>) {
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
                        name = this.app.SetExtension(name, format);
                        this.filename = name;
                    }
                    catch (Exception) {
                        alert("Illegal name");
                        name = "";
                    }
                    if (name) {
                        if (this.existsInFileList(name)) {
                            if (!window.confirm("File exists; overwrite?")) { return; }
                        }
                        var source = this.source;
                        this.app.SaveUsing(name, source, format);
                        return true;
                    }
                    return false;
                }

                return true;
            }

            private fileNameWidget: UI.TextEditWidget;

            public get filename() {
                return this.fileNameWidget.Value;
            }

            public set filename(name: string) {
                this.fileNameWidget.Value = name;
            }

            public CreateBodyElements($element: JQuery) {
                super.CreateBodyElements($element);
                this.AddWidget(this.fileNameWidget = new UI.TextEditWidget(), "fileName", "Enter file name");
            }
        }

        export class FileMenuPlugin extends MenuPlugin {
            constructor() {
                super();
            }
            GetMenuObj(app: ScoreApplication.ScoreApplication): IMenuDef {
                return {
                    Id: "FileMenu",
                    Caption: "File",
                    Menu: [
                        {
                            Id: "NewMenu",
                            Caption: "New",
                            action: () => {
                                app.ExecuteCommand(new Model.ClearScoreCommand({}));
                            }
                        },
                        {
                            Id: "OpenMenu",
                            Caption: "Open...",
                            action: () => {
                                new OpenFileDialog<Model.IScore, ScoreApplication.ScoreStatusManager, JQuery>('open', app).Show();
                            }
                        },
                        {
                            Id: "SaveMenu",
                            Caption: "Save as...",
                            action: () => {
                                new SaveFileDialog<Model.IScore, ScoreApplication.ScoreStatusManager, JQuery>('save', app).Show();
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

        // ************************* Music dialogs ************************ //

        export class ScoreDialog extends Dialog<Model.IScore, ScoreApplication.ScoreStatusManager, JQuery> {}

        export class MeterDialog extends ScoreDialog {
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

            public setTime(absTime: Model.AbsoluteTime): MeterDialog {
                this.absTime = absTime;
                return this;
            }

            public setMeter(definition: Model.IMeterDefinition): MeterDialog {
                var def = <Model.RegularMeterDefinition>definition;
                this.numCtl.Value = def.numerator;
                this.denCtl.Value = def.denominator;
                this.upbCtl.Value = false;
                return this;
            }
            
            public CreateBodyElements($element: JQuery) {
                this.AddWidget(this.numCtl = new SpinnerWidget(), "spinner_num", "Numerator");
                this.AddWidget(this.denCtl = new TimeWidget(), "spinner_den", "Denominator");
                this.AddWidget(this.upbCtl = new CheckboxWidget(), "check_upbeat", "Upbeat");
            }
        }

        export class KeyDialog extends ScoreDialog {
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

            public setTime(absTime: Model.AbsoluteTime): KeyDialog {
                this.absTime = absTime;
                return this;
            }
            
            public setKey(key: Model.IKey): KeyDialog {
                var def = <Model.RegularKeyDefinition>key.definition;
                this.keyCtl.Value = def.number + def.acci;
                return this;
            }

            public CreateBodyElements($element: JQuery) {
                this.AddWidget(this.keyCtl = new KeyWidget(), "key", "Key");                
            }
        }

        export class ClefDialog extends ScoreDialog {
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
                this.clefWidget.Value = '' + def.clefCode;
                this.lineWidget.Value = def.clefLine;
                return this;
            }

            public CreateBodyElements($element: JQuery) {
                this.AddWidget(this.clefWidget = new DropdownWidget({1: 'G', 2: 'C', 3: 'F', 4: 'Percussion'}), "clef", "Clef");
                this.AddWidget(this.lineWidget = new SpinnerWidget(), "line", "Line");
                this.AddWidget(this.transposeWidget = new SpinnerWidget(), "transpose", "Transpose");
                this.transposeWidget.Value = 0;
            }
        }
        export class BarDialog extends ScoreDialog {
            constructor(public idPrefix: string, public app: ScoreApplication.ScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "BarDialog";
                this.dialogTitle = "Edit bar settings";
            }
        }
        export class ArticulationDialog extends ScoreDialog {
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

        export class NoteDialog extends ScoreDialog {
            constructor(public idPrefix: string, public app: ScoreApplication.ScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "NoteDialog";
                this.dialogTitle = "Edit note settings";
            }
            private stemDirCtl: DropdownWidget;
            private note: Model.INote;

            public CreateBodyElements($element: JQuery) {
                this.AddWidget(this.stemDirCtl = new DropdownWidget({
                    "0": "Free",
                    "1": "Up",
                    "2": "Down"
                }), "NoteDialogStemDirection", "Stem direction");
            }

            public setNote(note: Model.INote): NoteDialog {
                this.note = note;
                this.stemDirCtl.Value = "" + note.getStemDirection();
                return this;
            }
             
            public onOk(): boolean {
                var stemDir = this.stemDirCtl.Value;

                var note = this.note;
                
                this.app.ExecuteCommand(new Model.SetNoteStemDirectionCommand({
                    note: note,
                    direction: parseInt(this.stemDirCtl.Value)
                }));

                return true;
            }                       
        }

        export class VoiceDialog extends ScoreDialog {
            constructor(public idPrefix: string, public app: ScoreApplication.ScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "VoiceDialog";
                this.dialogTitle = "Edit voice settings";
            }
            private stemDirCtl: DropdownWidget;
            private voice: Model.IVoice;

            public CreateBodyElements($element: JQuery) {
                this.AddWidget(this.stemDirCtl = new DropdownWidget({
                    "0": "Free",
                    "1": "Up",
                    "2": "Down"
                }), "NoteDialogStemDirection", "Stem direction");
            }

            public setVoice(voice: Model.IVoice): VoiceDialog {
                this.voice = voice;
                this.stemDirCtl.Value = "" + voice.getStemDirection();
                return this;
            }

            public onOk(): boolean {
                var stemDir = this.stemDirCtl.Value;

                var voice = this.voice;

                this.app.ExecuteCommand(new Model.SetVoiceStemDirectionCommand({
                    voice: voice,
                    direction: parseInt(this.stemDirCtl.Value)
                }));

                return true;
            }

        }

        export class NoteheadDialog extends ScoreDialog {
            constructor(public idPrefix: string, public app: ScoreApplication.ScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "NoteheadDialog";
                this.dialogTitle = "Edit notehead settings";
            }
        }
        export class ScoreInfoDialog extends ScoreDialog {
            constructor(public idPrefix: string, public app: ScoreApplication.ScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "ScoreDialog";
                this.dialogTitle = "Edit score settings";
            }
        }
        export class LyricDialog extends ScoreDialog {
            constructor(public idPrefix: string, public app: ScoreApplication.ScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "LyricDialog";
                this.dialogTitle = "Edit lyrics";
            }
        }

        export class TupletDialog extends ScoreDialog {
            constructor(public idPrefix: string, public app: ScoreApplication.ScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "TupletDialog";
                this.dialogTitle = "Edit tuplet";
            }
        }

        export class SpannerDialog extends ScoreDialog {
            constructor(public idPrefix: string, public app: ScoreApplication.ScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "SpannerDialog";
                this.dialogTitle = "Edit spanner";
            }
        }

        export class TextMarkDialog extends ScoreDialog {
            constructor(public idPrefix: string, public app: ScoreApplication.ScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "TextMarkDialog";
                this.dialogTitle = "Edit textmark";
            }
        }

        export class ShowTextDialog extends ScoreDialog {
            constructor(public idPrefix: string, public app: ScoreApplication.ScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "ShowTextDialog";
                this.dialogTitle = "Show text";
                this.width = 600;
                this.height = 500;
            }
            private textDivCtl: DisplayTextWidget;

            public CreateBodyElements($element: JQuery) {
                this.AddWidget(this.textDivCtl = new DisplayTextWidget(), "ShowTextDialogTextDiv", "Text");
            }

            public setText(text: string): ShowTextDialog {
                this.textDivCtl.Value = text;
                return this;
            }
            
            public onOk(): boolean {
                return true;
            }

        }

        class StaffContainer extends UI.UIContainer<Model.IScore, ScoreApplication.ScoreStatusManager, JQuery> {
            constructor(public idPrefix: string, public app: ScoreApplication.ScoreApplication, staff: Model.IStaff, index: number) {
                super(idPrefix, app);

                var title = staff ? staff.title : 'New';

                var $staffItem = $('<div class="StaffItem" >');
                $('<h2>').text(title + ' (' + index + ')').appendTo($staffItem);

                this.$staffDetails = $('<div class="StaffDetails">');
                $staffItem.append(this.$staffDetails);

                this.staff = staff;
                this.$container = $staffItem;
                this.CreateBodyElements();

                // todo: generalize via this.titleWidget:
                this.$staffDetails.find('#stafftitle') //Title: 
                    .change(function () {
                    $staffItem.children("h2").text(this.value);
                });
            }

            private $staffDetails: JQuery;
            private titleWidget: UI.TextEditWidget;
            private clefWidget: UI.DropdownWidget; // todo: clefWidget
            private lineWidget: UI.SpinnerWidget;
            private transposeWidget: UI.SpinnerWidget;
            public staff: Model.IStaff;

            public AddWidget(widget: UI.IWidget, id: string, label: string): UI.IWidget {
                widget.AddTo(this.$staffDetails, this.idPrefix + id, label);
                return widget;
            }

            public CreateBodyElements() {
                this.AddWidget(this.titleWidget = new UI.TextEditWidget(), 'title', 'Title');
                this.AddWidget(this.clefWidget = new UI.DropdownWidget({ 1: 'G', 2: 'C', 3: 'F', 4: 'Percussion' }), "clef", "Clef");
                this.AddWidget(this.lineWidget = new UI.SpinnerWidget(), "line", "Line");
                this.AddWidget(this.transposeWidget = new UI.SpinnerWidget(), "transpose", "Transpose");
                this.transposeWidget.Value = 0;
            }
        }

        export class StavesDialog extends UI.ScoreDialog {
            constructor(public idPrefix: string, public app: ScoreApplication.ScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "StavesDialog";
                this.dialogTitle = "Staves";
                this.width = 750;
                this.height = 500;
            }
            private stavesWidget: UI.CollectionWidget;

            public onOk(): boolean {
                return true;
            }

            public Show() {
                var me = this;

                this.buttonSettings = [
                    {
                        id: 'BtnAdd_StaffDialog',
                        text: "Add staff",
                        click: function () {
                            var s = new StaffContainer('staff', me.app, null, 0);
                            me.stavesWidget.AddItem(s);
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
                            var changeStavesCommand = new Model.BundleCommand();

                            me.stavesWidget.withItems((item: StaffContainer, index: number) => {
                                var staffItem = $(item.$container);
                                var staff = item.staff;
                                if (staff) {
                                    changeStavesCommand.Add(new Model.UpdateStaffCommand({
                                        staff: staff,
                                        index: index,
                                        title: staffItem.find('.TitleInput').val()
                                    }));
                                }
                                else {
                                    // Add Staff
                                    changeStavesCommand.Add(new Model.NewStaffCommand({
                                        index: index,
                                        initClef: Model.ClefDefinition.clefG,
                                        title: staffItem.find('.TitleInput').val()
                                    }));
                                }
                                return true;
                            });

                            me.app.ExecuteCommand(changeStavesCommand);                                    

                            $(this).dialog("close");
                        }
                    },
                ];
                this.addDialog();

                this.app.document.withStaves((staff: Model.IStaff, index: number) => {
                    var s = new StaffContainer('staff', me.app, staff, index);
                    me.stavesWidget.AddItem(s);
                });

                this.Open();
            }

            public CreateBodyElements($element: JQuery) {
                var me = this;
                this.AddWidget(this.stavesWidget = new UI.CollectionWidget(), "staves", "Staves");
            }
        }

        export class QuickMenuPlugin extends MenuPlugin {
            constructor(private id: string, private menuCaption: string, private parentId: string, private parentCaption: string, private menuAction: () => void) {
                super();
            }

            GetMenuObj(app: ScoreApplication.ScoreApplication): IMenuDef {
                // ****************** Custom action ******************* //
                var menuItem = {
                    Id: this.id,
                    Caption: this.menuCaption,
                    action: this.menuAction
                };

                return this.parentId ? {
                    Id: this.parentId,
                    Caption: this.parentCaption,
                    Menu: [menuItem]
                } : menuItem;
            }
        }


        export class VoiceMenuPlugin extends QuickMenuPlugin {
            constructor(app: ScoreApplication.ScoreApplication) {
                super("VoiceMenu", "Voice", "", "", function () {
                    new UI.VoiceDialog('menu', app).setVoice(app.Status.currentVoice).Show();
                });
            }
        }

        export class StavesMenuPlugin extends QuickMenuPlugin {
            constructor(app: ScoreApplication.ScoreApplication) {
                super("StavesMenu", "Staves", "", "", function () {
                    new StavesDialog('menu', app).Show();
                });
            }
        }

        export class ExportMenuPlugin extends MenuPlugin {
            constructor() {
                super();
            }
            GetMenuObj(app: ScoreApplication.ScoreApplication): IMenuDef {
                return {
                    Id: "ExportMenu",
                    Caption: "Export",
                    Menu: [
                        {
                            Id: "SVGMenu",
                            Caption: "SVG",
                            action: () => {
                                new UI.ShowTextDialog('menu', app).setText(app.SaveToString('SVG')).Show();
                            }
                        },
                        {
                            Id: "ExportJson",
                            Caption: "JSON",
                            action: () => {
                                new UI.ShowTextDialog('menu', app).setText(app.SaveToString('JSON')).Show();
                            }
                        },
                        {
                            Id: "ExportLilypond",
                            Caption: "Lilypond",
                            action: () => {
                                new UI.ShowTextDialog('menu', app).setText(app.SaveToString('Lilypond')).Show();
                            }
                        },
                        {
                            Id: "MusicXmlMenu",
                            Caption: "MusicXml",
                            action: () => {
                                new UI.ShowTextDialog('menu', app).setText(app.SaveToString('MusicXML')).Show();
                            }
                        }
                    ]
                };
            }
        }


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
                                    //(<any>ev).noteInt = parseInt(p);
                                    app.ProcessEvent("midinoteon", { noteInt: parseInt(p) });
                                }
                            }, 50, p);
                            origEvent.preventDefault();
                        })
                            .on('mouseup touchend', function (ev: JQueryEventObject) {
                            var p = $(this).attr('id').replace('tast', '');
                            ev.type = "midinoteoff";
                            //(<any>ev).noteInt = parseInt(p);
                            app.ProcessEvent("midinoteoff", { noteInt: parseInt(p) });
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