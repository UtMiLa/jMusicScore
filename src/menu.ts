module jMusicScore {
    export module Menus {

        interface IMenuDef {
            Id: string;
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

        class StaffContainer extends Dialogs.UIContainer<Model.IScore, ScoreApplication.ScoreStatusManager, JQuery> {
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
            private titleWidget: Dialogs.TextEditWidget;
            private clefWidget: Dialogs.DropdownWidget; // todo: clefWidget
            private lineWidget: Dialogs.SpinnerWidget;
            private transposeWidget: Dialogs.SpinnerWidget;
            public staff: Model.IStaff;

            public AddWidget(widget: Dialogs.IWidget, id: string, label: string): Dialogs.IWidget {
                widget.AddTo(this.$staffDetails, this.idPrefix + id, label);
                return widget;
            }

            public CreateBodyElements() {
                this.AddWidget(this.titleWidget = new Dialogs.TextEditWidget(), 'title', 'Title');
                this.AddWidget(this.clefWidget = new Dialogs.DropdownWidget({ 1: 'G', 2: 'C', 3: 'F', 4: 'Percussion' }), "clef", "Clef");
                this.AddWidget(this.lineWidget = new Dialogs.SpinnerWidget(), "line", "Line");
                this.AddWidget(this.transposeWidget = new Dialogs.SpinnerWidget(), "transpose", "Transpose");
                this.transposeWidget.Value = 0;
            }
        }

        export class StavesDialog extends Dialogs.ScoreDialog {
            constructor(public idPrefix: string, public app: ScoreApplication.ScoreApplication) {
                super(idPrefix, app);
                this.dialogId = "StavesDialog";
                this.dialogTitle = "Staves";
                this.width = 750;
                this.height = 500;
            }
            private stavesWidget: Dialogs.CollectionWidget;

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
                            me.stavesWidget.withItems((item: StaffContainer, index: number) => {
                                var staffItem = $(item.$container);
                                var staff = item.staff;//<Model.IStaff>staffItem.data('staff');
                                if (staff) {
                                    var application = me.app;
                                    application.ExecuteCommand(new Model.UpdateStaffCommand({
                                        staff: staff,
                                        index: index,
                                        title: staffItem.find('.TitleInput').val()
                                    }));
                                }
                                else {
                                    // Add Staff
                                    var application = me.app;
                                    application.ExecuteCommand(new Model.NewStaffCommand({
                                        index: index,
                                        initClef: Model.ClefDefinition.clefG,
                                        title: staffItem.find('.TitleInput').val()
                                    }));
                                }

                                return true;
                            });

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
                this.AddWidget(this.stavesWidget = new Dialogs.CollectionWidget(), "staves", "Staves");
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
                    new Dialogs.VoiceDialog('menu', app).setVoice(app.Status.currentVoice).Show();
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
                                new Dialogs.ShowTextDialog('menu', app).setText(app.SaveToString('SVG')).Show();
                            }
                        },
                        {
                            Id: "ExportJson",
                            Caption: "JSON",
                            action: () => {
                                new Dialogs.ShowTextDialog('menu', app).setText(app.SaveToString('JSON')).Show();
                            }
                        },
                        {
                            Id: "ExportLilypond",
                            Caption: "Lilypond",
                            action: () => {
                                new Dialogs.ShowTextDialog('menu', app).setText(app.SaveToString('Lilypond')).Show();
                            }
                        },
                        {
                            Id: "MusicXmlMenu",
                            Caption: "MusicXml",
                            action: () => {
                                new Dialogs.ShowTextDialog('menu', app).setText(app.SaveToString('MusicXML')).Show();
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