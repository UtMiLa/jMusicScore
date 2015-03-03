module jMusicScore {
    export module Menus {

        interface IMenuDef {
            Id: string;
            Dialog: any;
            Menu: IMenuDef;
            Caption: string;
            action: (e: Event) => void;
        }

        export class MenuPlugin implements Application.IPlugIn {
            Init(app: Application.Application) {
                this.app = app;
                var obj = this.GetMenuObj(app);
                this.menu_addItem(obj/*, 0*/);
            }

            private app: Application.Application;

            GetId(): string {
                return "Menu";
            }

            GetMenuObj(app: Application.Application): any {
                return {};
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
                    addDialog("#" + e.Id + "Dialog", "#" + e.Id + "Button", this.app, e.Dialog);
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

                        addDialog("#" + e1.Id + "Dialog", menuItem, me.app, e1.Dialog);
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


        export class SvgMenuPlugin extends MenuPlugin {
            GetMenuObj(app: Application.Application): any {
                // ****************** svg ******************* //
                return {
                    Id: "ExportMenu",
                    Caption: "Export",
                    Menu: [
                        {
                            Id: "SvgMenu",
                            Caption: "SVG",
                            Dialog: {
                                Title: "SVG",
                                Controls: [
                                    {
                                        tag: "<div>",
                                        id: "svgText"
                                    }
                                ],
                                buttonSettings: [
                                    {
                                        id: 'BtnOk_SVGDialog',
                                        text: "OK",
                                        click: function () {
                                            $(this).dialog("close");
                                        }
                                    },
                                    {
                                        id: 'BtnCancel_SVGDialog',
                                        text: "Cancel",
                                        click: function () { $(this).dialog("close"); }
                                    }
                                ],
                                okFunction: function () { },
                                cancelFunction: function () { },
                                initFunction: function () {
                                    $('#svgText').html(app.SaveToString('SVG').replace(/&/g, '&amp;').replace(/</g, '\n&lt;').replace(/>/g, '&gt;'));
                                },
                                width: 350,
                                height: 300
                            }
                        }
                    ]
                };
            }
        }



        export class ExportMenuPlugin extends MenuPlugin {
            GetMenuObj(app: Application.Application): any {
                // ****************** Export menu ******************* //
                return {
                    Id: "ExportMenu",
                    Caption: "Export",
                    Menu: [
                        // ****************** JSON ******************* //
                        {
                            Id: "ExportJson",
                            Caption: "JSON",
                            Dialog: {

                                Title: "JSON",
                                Controls: [
                                    {
                                        tag: "<div>",
                                        id: "jsonText"
                                    }
                                ],
                                buttonSettings: [
                                    {
                                        id: 'BtnOk_JSONDialog',
                                        text: "OK",
                                        click: function () {
                                            $(this).dialog("close");
                                        }
                                    },
                                    {
                                        id: 'BtnCancel_JSONDialog',
                                        text: "Cancel",
                                        click: function () { $(this).dialog("close"); }
                                    }
                                ],
                                okFunction: function () { },
                                cancelFunction: function () { },
                                initFunction: function (application: Application.Application) {
                                    $('#jsonText').text(application.SaveToString('JSON'));
                                },
                                width: 350,
                                height: 300
                            }
                        },
                        // ****************** Lilypond ******************* //
                        {
                            Id: "ExportLily",
                            Caption: "Lilypond",
                            Dialog: {

                                Title: "Lilypond",
                                Controls: [
                                    {
                                        tag: "<div>",
                                        id: "lilypond"
                                    }
                                ],
                                buttonSettings: [
                                    {
                                        id: 'BtnOk_LilypondDialog',
                                        text: "OK",
                                        click: function () {
                                            $(this).dialog("close");
                                        }
                                    },
                                    {
                                        id: 'BtnCancel_LilypondDialog',
                                        text: "Cancel",
                                        click: function () { $(this).dialog("close"); }
                                    }
                                ],
                                okFunction: function () { },
                                cancelFunction: function () { },
                                initFunction: function () {
                                },
                                width: 350,
                                height: 300

                            }
                        },
                        // ****************** MusicXml ******************* //
                        {
                            Id: "MusicXmlMenu",
                            Caption: "MusicXml",
                            Dialog: {
                                Title: "MusicXml",
                                Controls: [
                                    {
                                        tag: "<div>",
                                        id: "musicXMLText"
                                    }
                                ],
                                buttonSettings: [
                                    {
                                        id: 'BtnOk_MusicXmlDialog',
                                        text: "OK",
                                        click: function () {
                                            $(this).dialog("close");
                                        }
                                    },
                                    {
                                        id: 'BtnCancel_MusicXmlDialog',
                                        text: "Cancel",
                                        click: function () { $(this).dialog("close"); }
                                    }
                                ],
                                okFunction: function () { },
                                cancelFunction: function () { },
                                initFunction: function (application: Application.Application) {
                                    //$('#musicXMLText').text(application.SaveToString('MusicXML'));
                                    $('#musicXMLText').html(application.SaveToString('MusicXML').replace(/&/g, '&amp;').replace(/</g, '\n&lt;').replace(/>/g, '&gt;'));
                                    /*var xmlGen = new MusicXml.MusicXmlWriter(application.score);
                                    $('#musicXMLText').html(
                                        xmlGen.getAsXml()
                                            .replace(/&/g, '&amp;').replace(/</g, '\n&lt;').replace(/>/g, '&gt;')
                                        );*/
                                },
                                width: 350,
                                height: 300
                            }
                        },
                        /*{
                            Id: "MusicXmlMenu",
                            Caption: "Midi",
                            Dialog: {
                                Title: "Midi",
                                Controls: [
                                    {
                                        tag: "<audio>",
                                        id: "midiPlayer"
                                    }
                                ],
                                buttonSettings: [
                                    {
                                        id: 'BtnOk_MusicXmlDialog',
                                        text: "OK",
                                        click: function () {
                                            $(this).dialog("close");
                                        }
                                    },
                                    {
                                        id: 'BtnCancel_MusicXmlDialog',
                                        text: "Cancel",
                                        click: function () { $(this).dialog("close"); }
                                    }
                                ],
                                okFunction: function () { },
                                cancelFunction: function () { },
                                initFunction: function (application: Application.Application) {

                                    // We pass some notes to |MidiWriter.createNote| to create the MIDI
                                    // events that define the notes that will be in the final MIDI stream. If
                                    // no other parameters are specified to |createNote|, a NoteOff event
                                    // will be inserted automatically, instead of letting the note ring forever.

                                    // Disregard the |push.apply|, it is used here simply to flatten the
                                    // resulting array, since |createNote| returns an array of events.

                                    // Create a track that contains the events to play the notes above
                                    var trackses = [];
                                    var score = application.getScore();
                                    for (var i = 0; i < score.staffElements.length; i++) {
                                        for (var j = 0; j < score.staffElements[i].voiceElements.length; j++) {
                                            trackses.push(getMidiTrack(score.staffElements[i].voiceElements[j]));
                                        }
                                    }

                                    // Creates an object that contains the final MIDI track in base64 and some
                                    // useful methods.
                                    var song = MidiWriter({ tracks: trackses });

                                    var embed = document.getElementById("midiPlayer");
                                    embed.setAttribute("src", "data:audio/midi;base64," + song.b64);
                                    embed.setAttribute("type", "audio/midi");
                                    document.body.appendChild(embed);
                                },
                                width: 350,
                                height: 300
                            }
                        },*/
                        // ****************** svg ******************* //
                        /*{
                            Id: "SvgMenu",
                            Caption: "SVG",
                            Dialog: {
                                Title: "SVG",
                                Controls: [
                                    {
                                        tag: "<div>",
                                        id: "svgText"
                                    }
                                ],
                                buttonSettings: [ 
                                    {
                                        id: 'BtnOk_SVGDialog', 
                                        text: "OK", 
                                        click: function() { 
                                            /*var note = $(this).data("note");
                                            note.owner.setStemDirection($('#NoteDialogStemDirection').val());* /
                                            $( this ).dialog( "close" );
                                        } 
                                    },
                                    {
                                        id: 'BtnCancel_SVGDialog', 
                                        text: "Cancel", 
                                        click: function() { $( this ).dialog( "close" ); } 
                                    }
                                ],
                                okFunction: function() {},
                                cancelFunction: function() {},
                                initFunction: function() {
                                    var xml = $('#svgload').svg('get').toSVG();
                                    $('#svgText').html(xml.replace(/&/g, '&amp;').replace(/</g, '\n&lt;').replace(/>/g, '&gt;'));
                                },
                                width: 350,
                                height: 300				
                            }
                        }*/
                    ]
                };
            }
        }

        /* todo: jsmidi-master function getMidiTrack(voice) {
            var noteEvents = [];
            var restDur = 60;
            var tempo = 1.414022;
            for (var i = 0; i < voice.noteElements.length; i++) {
                var note = voice.noteElements[i];
                if (note.rest) {
                    restDur += note.getTimeVal();
                }
                else {
                    for (var j = 0; j < note.pitchElements.length; j++) {
                        noteEvents.push(MidiEvent.noteOn({ channel: 2, pitch: note.pitchElements[j].pitch.toMidi(), duration: restDur * tempo, volume: 64 }));
                        restDur = 0;
                    }
                    restDur = note.getTimeVal();
                    for (var j = 0; j < note.pitchElements.length; j++) {
                        noteEvents.push(MidiEvent.noteOff({ channel: 2, pitch: note.pitchElements[j].pitch.toMidi(), duration: restDur * tempo, volume: 64 }));
                        restDur = 0;
                    }
                    restDur = 0;
                }
            }
            noteEvents.push(MidiEvent.noteOff({ channel: 2, pitch: 68, duration: 100, volume: 64 }));
            // Create a track that contains the events to play the notes above
            return new MidiTrack({ events: noteEvents });
        }*/


        // ****************** STAFF ******************* //
        export class StaffMenuPlugin extends MenuPlugin {
            GetMenuObj(app: Application.Application): any {
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
                            var score = app.score;

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

            public set Value(value: number) {
                this.$list.data("filename", value);
            }

            public get Value(): number {
                return this.$list.data("filename");
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
                this.$list = $("<ul>").appendTo($div);
                parent.append($div);
                return this.$list;
            }
        }

        export class FileDialog extends Dialogs.Dialog {
            constructor(public idPrefix: string, public app: Application.Application) {
                super(idPrefix, app);
                this.dialogId = "FileDialog";
                this.dialogTitle = "Select file";
            }
            private sourceWidget: Dialogs.DropdownWidget;
            private fileListWidget = new FileListWidget
            private fileTypeWidget: Dialogs.DropdownWidget;

            public onOk(): boolean {
                return true;
            }

            public Show() {
                this.addDialog();

                var $dlg = this.DialogObject;
                //$dlg.data('absTime', absTime);
                this.onInit();

                /****/

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

                /*****/
                $dlg.dialog("open");
            }

            public CreateBodyElements($element: JQuery) {
                this.AddWidget(this.sourceWidget = new Dialogs.DropdownWidget({ 0: 'Local', 1: 'Server' }), $element, "fileSource", "File source");
                this.AddWidget(this.fileListWidget = new FileListWidget(), $element, "FileList", "Select file"); // todo: class 
                this.AddWidget(this.fileTypeWidget = new Dialogs.DropdownWidget({}), $element, "fileTypes", "Select file type");
            }
        }

        export class OpenFileDialog extends FileDialog {
        } // todo: implement

        export class SaveFileDialog extends FileDialog {
        }

        export class OpenFileMenuPlugin extends MenuPlugin {
            GetMenuObj(app: Application.Application): any {
                // ****************** Open file ******************* //
                return {
                    
                Id: "FileMenu",
                    Caption: "File",
                    Menu: [{

                        Id: "OpenMenu",
                        Caption: "Open",
                        Dialog: {
                            Title: "Open file",
                            Controls: [
                                {
                                    tag: "<select>",
                                    id: "OpenFileSourceSelect",
                                    options: {
                                        0: "Local",
                                        1: "Server"
                                    }
                                },
                                {
                                    tag: "<ul>",
                                    id: "openFileList",
                                }
                            ],
                            buttonSettings: [
                                {
                                    id: 'BtnOk_Open_FileDialog',
                                    text: "OK",
                                    click: function () {
                                        // Open file
                                        var name: string = $('#openFileList').data("filename");
                                        if (name) {
                                            var source = $("#OpenFileSourceSelect").val();
                                            var type: string = '*';
                                            /*if (name.match(/\.json$/)) { type = "JSON"; }
                                            if (name.match(/\.xml$/)) { type = "MusicXML"; }*/
                                            app.LoadUsing(name, source, type);
                                            $(this).dialog("close");
                                        }
                                    }
                                },
                                {
                                    id: 'BtnCancel_Open_FileDialog',
                                    text: "Cancel",
                                    click: function () { $(this).dialog("close"); }
                                }
                            ],
                            okFunction: function () { },
                            cancelFunction: function () { },
                            initFunction: function () {
                                var ids = app.GetFileManagerIds();
                                var $this = $(this);
                                var $source = $("#OpenFileSourceSelect");
                                $source.empty();
                                for (var i = 0; i < ids.length; i++) {
                                    $('<option>').text(ids[i]).appendTo($source);
                                }
                                var updateFileList = function (source: string) {
                                    app.GetFileList(source, function (data: string[]) {
                                        $('#openFileList').empty();
                                        $.each(data, function (i, e) {
                                            if (e) {
                                                $('#openFileList').append(
                                                    $('<li>')
                                                        .attr("value", e)
                                                        .append(
                                                        $("<a>").text(e)
                                                            .attr("href", "#")
                                                            .click(function () {
                                                                var name = $(this).text();                                                                
                                                                $("#openFileList li").removeClass('selected');
                                                                $(this).parent().addClass('selected');
                                                                $('#openFileList').data("filename", name);
                                                            })
                                                            .dblclick(function () { $('#BtnOk_Open_FileDialog').trigger('click'); })
                                                        ));
                                            }
                                        });
                                    });
                                }
                                $source.change(function () {
                                    var item = $(this).val();
                                    updateFileList(item);
                                });
                                updateFileList($source.val());
                                
                                return this;
                            },
                            width: 350,
                            height: 500
                        }
                    }
                ]};
            }
        }


        export class SaveAsFileMenuPlugin extends MenuPlugin {
            GetMenuObj(app: Application.Application): any {
                // ****************** Save file ******************* //
                return {
                    Id: "FileMenu",
                    Caption: "File",
                    Menu: [{

                        Id: "SaveAsMenu",
                        Caption: "Save as...",
                        Dialog: {
                            Title: "Save file",
                            Controls: [
                                {
                                    tag: "<select>",
                                    id: "SaveFileSourceSelect",
                                    options: {
                                        0: "Local",
                                        1: "Server"
                                    }
                                },
                                {
                                    tag: "<ul>",
                                    id: "saveFileList",
                                },
                                {
                                    tag: "<select>",
                                    id: "saveFileFormats",
                                },
                                {
                                    tag: "<input>",
                                    id: "saveFileEdit",
                                }
                            ],
                            buttonSettings: [
                                {
                                    id: 'BtnOk_SaveAsDialog',
                                    text: "OK",
                                    click: function () {
                                        // Save file
                                        var format = $('#saveFileFormats').val();
                                        var name: string = $('#saveFileEdit').val();
                                        name = name.replace(/[^a-zA-Z0-9_\.]/, '');
                                        try {
                                            name = app.SetExtension(name, format);
                                            $('#saveFileEdit').val(name);
                                        }
                                        catch (Exception) {
                                            alert("Illegal name");
                                            name = "";
                                        }
                                        if (name) {
                                            // tjek om findes
                                            if ($("#saveFileList li[value='" + name + "']").length) {
                                                if (!window.confirm("File exists; overwrite?")) { return; }
                                            }
                                            var source = $("#SaveFileSourceSelect").val();                                            
                                            app.SaveUsing(name, source, format);
                                            $(this).dialog("close");
                                        }
                                    }
                                },
                                {
                                    id: 'BtnCancel_SaveAsDialog',
                                    text: "Cancel",
                                    click: function () { $(this).dialog("close"); }
                                }
                            ],
                            okFunction: function () { },
                            cancelFunction: function () { },
                            open: function () {
                                var updateFileList = function (source: string) {
                                    app.GetFileList(source, function (data: string[]) {
                                        $('#saveFileList').empty();
                                        $.each(data, function (i, e) {
                                            if (e) {
                                                $('#saveFileList').append(
                                                    $('<li>')
                                                        .attr("value", e)
                                                        .append(
                                                        $("<a>").text(e)
                                                            .attr("href", "#")
                                                            .click(function () {
                                                                var name = $(this).text();
                                                                $("#saveFileList li").removeClass('selected');
                                                                $(this).parent().addClass('selected');
                                                                $('#saveFileEdit').val(name);
                                                            })
                                                            .dblclick(function () { $('#BtnOk_SaveAsDialog').trigger('click'); })
                                                        ));
                                            }
                                        });
                                    });
                                }
                                var $source = $("#SaveFileSourceSelect");
                                $source.change(function () {
                                    var item = $(this).val();
                                    updateFileList(item);
                                });
                                updateFileList($source.val());
                            },
                            initFunction: function () {
                                var ids = app.GetFileManagerIds();
                                var $this = $(this);
                                var $source = $("#SaveFileSourceSelect");
                                $source.empty();
                                var $saveFileFormats = $('#saveFileFormats');
                                $saveFileFormats.empty();
                                $.each(app.GetFileSaveTypes(), function (i: number, e: string) {
                                        $('<option>')
                                            .attr('value', e)
                                            .text(e)
                                            .appendTo($saveFileFormats);
                                    });                                

                                for (var i = 0; i < ids.length; i++) {
                                    $('<option>').text(ids[i]).appendTo($source);
                                }

                                return this;
                            },
                            width: 350,
                            height: 500
                        }
                    }
                    ]
                };
            }
        }


        export class QuickMenuPlugin extends MenuPlugin {
            constructor(private id: string, private menuCaption: string, private parentId: string, private parentCaption: string, private menuAction: () => void) {
                super();
            }

            GetMenuObj(app: Application.Application): any {
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
            constructor(app: Application.Application) {
                super("VoiceMenu", "Voice", "", "", function () {
                    new Dialogs.VoiceDialog('menu', app).Show(<Model.IVoice>app.Status.currentVoice);
                });
            }
        }

        export class NewScorePlugin extends QuickMenuPlugin {
            constructor(app: Application.Application) {
                super("NewMenu", "New", "FileMenu", "File", function () {
                    app.ExecuteCommand(new Model.ClearScoreCommand({}));
                });
            }
        }

    }
}