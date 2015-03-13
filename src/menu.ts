module jMusicScore {
    export module Menus {

        interface IControlDef {
            tag: string;
            id: string;
            text?: string;
            options?: { [key: number]: string };
        }

        interface IDialogDef {
            Title: string;
            Controls: IControlDef[];
        }

        interface IMenuDef {
            Id: string;
            Dialog?: IDialogDef;
            Menu?: IMenuDef[];
            Caption: string;
            action?: (e: Event) => void;
        }

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

            private menu_addItem(e: IMenuDef /*, level*/) {
                if (e.Dialog) {
                    var dialogDom = $('<div>')
                        .attr('id', e.Id + "Dialog")
                        .attr('title', e.Dialog.Title)
                        .addClass('Dialog');
                    $.each(e.Dialog.Controls, function (i1, e1) {
                        var elm = $(e1.tag)
                            .attr('id', e1.id)
                            .appendTo(dialogDom);
                        if (e1.text) elm.text(e1.text);
                        if (e1.options && typeof e1.options === "object") {
                            $.each(e1.options, function (i2, e2) {
                                $("<option>")
                                    .attr('value', i2)
                                    .text(e2)
                                    .appendTo(elm);
                            });
                        }
                    });
                    $('body').append(dialogDom);
                    $('#notetools')
                        .append(
                        $('<button>')
                            .attr('id', e.Id + "Button")
                            .text(e.Caption)
                            .addClass("ui-widget-header").addClass("ui-corner-all")
                        );
                    this.addDialog("#" + e.Id + "Dialog", "#" + e.Id + "Button", this.app, e.Dialog);
                }
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

            /** old style dialog creation - should die eventually */
            private addDialog(dialogId: string, buttonId: any, a: ScoreApplication.ScoreApplication, dialogTransferrer: any = null) {
                if (!dialogTransferrer) {
                    dialogTransferrer = {
                        buttonSettings: [
                            {
                                id: 'BtnOk_' + dialogId.substring(1),
                                text: "Ok",
                                click: function () { $(this).dialog("close"); }
                            },
                            {
                                id: 'BtnCancel_' + dialogId.substring(1),
                                text: "Cancel",
                                click: function () { $(this).dialog("close"); }
                            }
                        ],
                        okFunction: function () { },
                        cancelFunction: function () { },
                        initFunction: function () { },
                        width: 350,
                        height: 300
                    }
                }
                var dlg = $(dialogId)
                    .data('dlgobj', dialogTransferrer)
                    .dialog({
                    autoOpen: false,
                    height: dialogTransferrer.height,
                    width: dialogTransferrer.width,
                    modal: true,
                    buttons: dialogTransferrer.buttonSettings,
                    open: dialogTransferrer.open,
                    close: function () {
                        //allFields.val( "" ).removeClass( "ui-state-error" );
                    }
                });

                if (typeof buttonId === "string") {
                    $(buttonId).button(
                    /*{ 
                        text: false,
                        icons: {
                                primary: "note-icon icon-meter",
                                //secondary: "ui-icon-triangle-1-s"
                            } 
                    }*/
                        ).click(function () {
                        var obj = $(dialogId).data('dlgobj');
                        var app: ScoreApplication.ScoreApplication = a;
                        obj.initFunction(app);
                        $(dialogId).dialog("open");
                    });
                }
                else if (typeof buttonId === "object") {
                    buttonId.click(function () {
                        var obj = $(dialogId).data('dlgobj');
                        var app: ScoreApplication.ScoreApplication = a;
                        obj.initFunction(app);
                        $(dialogId).dialog("open");
                    });
                }

                return dlg;
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
                    if (e1.Dialog) {
                        var dialogDom = $('<div>')
                            .attr('id', e1.Id + "Dialog")
                            .attr('title', e1.Dialog.Title)
                            .addClass('Dialog');
                        $.each(e1.Dialog.Controls, function (i1, e2) {
                            dialogDom.append($(e2.tag)
                                .attr('id', e2.id));
                        });
                        $('body').append(dialogDom);

                        //$("#" + e1.Id + "Button").click( function() { alert ("hej"); });

                        me.addDialog("#" + e1.Id + "Dialog", menuItem, me.app, e1.Dialog);
                    }
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

        // ****************** STAFF ******************* //
        export class StaffMenuPlugin extends MenuPlugin {
            GetMenuObj(app: ScoreApplication.ScoreApplication): IMenuDef {
                // ****************** staves ******************* //
                return {
                    Id: "StaffMenu",
                    Caption: "Staves",
                    Dialog: {
                        Title: "Edit staves",
                        Controls: [
                            {
                                tag: "<div>",
                                id: "Staves",
                            }
                        ],
                        buttonSettings: [
                            {
                                id: 'BtnAdd_StaffDialog',
                                text: "Add staff",
                                click: function () {
                                    var newItem = $('<div class="StaffItem"></div>');
                                    newItem.append('<h2>New</h2>');
                                    newItem.append('<div class="StaffDetails">Title: <input class="TitleInput" type="text" value="New" />Clef: <ul id="staff-clef"><li><a href="#">G<span class="ui-icon note-icon icon-clef-g"></span></a></li><li><a href="#">G8<span class="ui-icon note-icon icon-clef-g8"></span></a></li></ul></div>');
                                    $("#Staves").append(newItem);
                                    $("#Staves").accordion("refresh");
                                }
                            },
                            {
                                id: 'BtnOk_StaffDialog',
                                text: "Update staves",
                                click: function () {
                                    // todo: DeleteStaffCommand
                                    $("#Staves .StaffItem")
                                        .each(function (i, e) {
                                            var staffItem = $(e);
                                            var staff = <Model.IStaff>staffItem.data('staff');
                                            if (staff) {
                                                var application = app;
                                                application.ExecuteCommand(new Model.UpdateStaffCommand({
                                                    staff: staff,
                                                    index: i,
                                                    title: staffItem.find('.TitleInput').val()
                                                }));
                                            }
                                            else {
                                                // Add Staff
                                                var application = app;
                                                application.ExecuteCommand(new Model.NewStaffCommand({
                                                    index: i,
                                                    initClef: Model.ClefDefinition.clefG,
                                                    title: staffItem.find('.TitleInput').val()
                                                }));
                                            }
                                        });
                                    $(this).dialog("close");
                                }
                            },
                            {
                                id: 'BtnCancel_StaffDialog',
                                text: "Cancel",
                                click: function () { $(this).dialog("close"); }
                            }
                        ],
                        okFunction: function () { },
                        cancelFunction: function () { },
                        initFunction: function () {
                            var score = app.document;

                            $('#Staves').empty();
                            score.withStaves((staff: Model.IStaff, index: number) => {
                                var staffItem = $('<div class="StaffItem" >');
                                $('<h2>').text(staff.title + ' (' + index + ')').appendTo(staffItem);
                                var staffDetails = $('<div class="StaffDetails">');
                                staffDetails
                                    .append('Title: <input class="TitleInput" type="text" value="' + staff.title + '" />')
                                    .append('Clef: <span class="staffClef" ></span>');
                                staffItem.append(staffDetails);
                                staffItem.data('staff', staff);
                                $('#Staves').append(staffItem);
                            });

                            $("#Staves")
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
                            //$( "#Staves" ).disableSelection();

                            // todo: clefs
                            /*$('.staffClef')
                                .svg(function (svg, error) {
                                    svg.path(emmentaler_notes['e_clefs.C'], {
                                        transform: 'scale(1,1), translate(0,0)'
                                    });
                                })
                                .append('<button />')
                            ;*/

                            $(".StaffItem .TitleInput")
                                .change(function () {
                                    //alert(this.value);
                                    $(this).parent().parent().children("h2").text(this.value);
                                });

                            $("#stavesButton").button(
                            /* {
                                    text: false,
                                    icons: {
                                        primary: "note-icon icon-meter",
                                        //secondary: "ui-icon-triangle-1-s"
                                    }
                                }*/
                                ).click(function () {
                                    $("#StaffDialog").dialog("open");
                                });

                            return this;
                        },
                        width: 750,
                        height: 500
                    }
                };
            }
        }

        class FileListWidget implements Dialogs.IWidget {
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

        export class StavesDialog extends Dialogs.ScoreDialog {
            constructor(public idPrefix: string, public app: ScoreApplication.ScoreApplication) {
                super(idPrefix, app);
                /*this.dialogId = "FileDialog";
                this.dialogTitle = "Select file";
                this.height = 600;*/
                this.width = 750;
                this.height = 500;

            }
            /*private sourceWidget: Dialogs.DropdownWidget;
            private fileListWidget = new FileListWidget();
            private fileTypeWidget: Dialogs.DropdownWidget;*/

            public onOk(): boolean {
                return true;
            }

            public Show() {
                this.addDialog();
/*
                var $dlg = this.DialogObject;
                //$dlg.data('absTime', absTime);
                this.onInit();

                /**** /

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

                
                $dlg.dialog("open");*/
                this.Open();
            }

            public CreateBodyElements($element: JQuery) {
                /*this.AddWidget(this.sourceWidget = new Dialogs.DropdownWidget({ 0: 'Local', 1: 'Server' }), $element, "fileSource", "File source");
                this.AddWidget(this.fileListWidget = new FileListWidget(), $element, "FileList", "Select file"); // todo: class 
                this.AddWidget(this.fileTypeWidget = new Dialogs.DropdownWidget({}), $element, "fileTypes", "Select file type");*/
            }

        }

        export class FileDialog<DocumentType extends Application.IAppDoc, StatusManager extends Application.IStatusManager, ContainerType> extends Dialogs.Dialog<DocumentType, StatusManager, ContainerType> {
            constructor(public idPrefix: string, public app: Application.Application<DocumentType, StatusManager , ContainerType>) {
                super(idPrefix, app);
                this.dialogId = "FileDialog";
                this.dialogTitle = "Select file";
                this.height = 600;
            }
            private sourceWidget: Dialogs.DropdownWidget;
            private fileListWidget = new FileListWidget();
            private fileTypeWidget: Dialogs.DropdownWidget;

            public onOk(): boolean {
                return true;
            }

            public Show() {
                this.addDialog();

                this.onInit();

                var ids = this.app.GetFileManagerIds();
                this.sourceWidget.SetOptions(<any>$.map(ids, (e, i) => { return { val: e, label: e }; }));
                this.fileTypeWidget.SetOptions(<any>$.map(this.app.GetFileSaveTypes(), (e, i) => { return { val: e, label: e }; }));
                
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

                this.Open();
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
                this.AddWidget(this.sourceWidget = new Dialogs.DropdownWidget({ 0: 'Local', 1: 'Server' }), "fileSource", "File source");
                this.AddWidget(this.fileListWidget = new FileListWidget(), "FileList", "Select file"); // todo: class 
                this.AddWidget(this.fileTypeWidget = new Dialogs.DropdownWidget({}), "fileTypes", "Select file type");
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

            private fileNameWidget: Dialogs.TextEditWidget;

            public get filename() {
                return this.fileNameWidget.Value;
            }

            public set filename(name: string) {
                this.fileNameWidget.Value = name;
            }

            public CreateBodyElements($element: JQuery) {
                super.CreateBodyElements($element);
                this.AddWidget(this.fileNameWidget = new Dialogs.TextEditWidget(), "fileName", "Enter file name");
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
                    new Dialogs.VoiceDialog('menu', app).Show(app.Status.currentVoice);
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
                                new Dialogs.ShowTextDialog('menu', app).Show(app.SaveToString('SVG'));
                            }
                        },
                        {
                            Id: "ExportJson",
                            Caption: "JSON",
                            action: () => {
                                new Dialogs.ShowTextDialog('menu', app).Show(app.SaveToString('JSON'));
                            }
                        },
                        {
                            Id: "ExportLilypond",
                            Caption: "Lilypond",
                            action: () => {
                                new Dialogs.ShowTextDialog('menu', app).Show(app.SaveToString('Lilypond'));
                            }
                        },
                        // ****************** MusicXml ******************* //
                        {
                            Id: "MusicXmlMenu",
                            Caption: "MusicXml",
                            action: () => {
                                new Dialogs.ShowTextDialog('menu', app).Show(app.SaveToString('MusicXML'));
                            }
                        }
                    ]
                };
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

    }
}