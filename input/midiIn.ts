module jMusicScore {
    export module Editors {
        declare var $: any;
        export class MidiInputPlugin implements Application.IPlugIn {

            private midiChannel: string;

            public SetMidiChannel(val: string) {
                if (this.midiChannel !== val) {
                }
                this.midiChannel = val;
            }

            public Init(app: Application.Application) {
                var active_element: Element;

                function connectMidiIn() {
                    //alert("connect midi");
                }

                function disconnectMidiIn() {

                }

                function onFocusIE() {
                    this.active_element = document.activeElement;
                    connectMidiIn();
                }
                function onBlurIE() {
                    if (this.active_element != document.activeElement) { active_element = document.activeElement; return; }
                    disconnectMidiIn();
                }
                setTimeout(
                    () => {
                        try {
                            $.midiIn("open", 0, 0);
                            app.AddPlugin(new MidiMenuPlugin());
                        }
                        catch (err) {
                            // Jazz Midi In not supported
                            $('#MidiInStuff').hide();
                            return;
                        }

                        $(document).on("midiNoteOn", function (e: Event) {
                            app.ProcessEvent("midinoteon", e);
                            /*$('#tast' + e.noteInt).addClass('down');
                            $('#Chord')
                                .text(JSON.stringify($.midiIn('keys_pressed')));*/
                        });
                        $(document).on("midiNoteOff", function (e: Event) {
                            app.ProcessEvent("midinoteoff", e);
                            /*$('#tast' + e.noteInt).removeClass('down');
                            $('#Chord')
                                .text(JSON.stringify($.midiIn('keys_pressed')));*/
                        });
                        $(document).on("midiControl", function (e: Event) {
                            app.ProcessEvent("midicontrol", e);
                            /*$('#msg')
                                .append("Control    " + e.ctlNo + " " + e.ctlValue + "<br>")
                                .scrollTop($('#msg').prop('scrollHeight'));*/
                        });
                        $(document).on("midiChordReleased", function (e: Event) {
                            app.ProcessEvent("midichordreleased", e);
                            /*$('#Chord1')
                                .text(JSON.stringify(e.chord));*/
                        });

                        if (navigator.appName == 'Microsoft Internet Explorer') { document.onfocusin = onFocusIE; document.onfocusout = onBlurIE; }
                        else { window.onfocus = connectMidiIn; window.onblur = disconnectMidiIn; }
                    }
                    , 100); // Safari initializes new window from the "new window" button faster than old plugin disconnects.


            }


            public GetId(): string { return 'MidiInputPlugin'; }
        }


        // ****************** STAFF ******************* //
        /*export*/ class MidiMenuPlugin extends Menus.MenuPlugin {
            GetMenuObj(app: Application.Application): any {
                // ****************** staves ******************* //
                return {
                    Id: "MidiMenu",
                    Caption: "MIDI Setup",
                    Dialog: {
                        Title: "MIDI Setup",
                        Controls: [
                            {
                                tag: "<select>",
                                id: "midiIn",
                            }
                        ],
                        buttonSettings: [
                            {
                                id: 'BtnOK_MidiDialog',
                                text: "OK",
                                click: function () {
                                    // Vælg Midi-kanal
                                    var midiChannel = $('#midiIn :selected').attr('value');

                                    try {
                                        if (midiChannel) {
                                            $.midiIn("open", 0, midiChannel);
                                        } else {
                                            $.midiIn('close');
                                        }
                                    }
                                    catch (err) {
                                        alert("error1: " + err.message);
                                    }

                                    $(this).dialog("close");
                                }
                            },
                            {
                                id: 'BtnCancel_MidiDialog',
                                text: "Cancel",
                                click: function () { $(this).dialog("close"); }
                            }
                        ],
                        okFunction: function () { },
                        cancelFunction: function () { },
                        initFunction: function () {
                            var score = app.score;

                            $('#midiIn').empty().append('<option value = "" > Not connected </option >');

                            try {
                                var list = $.midiIn('list');
                                for (var i in list) {
                                    var $option = $('<option>').text(list[i]).attr('value', list[i]);
                                    if (list[i] === $.midiIn("current_in")) {
                                        $option.attr('selected', 'selected');
                                    }
                                    $('#midiIn').append($option);
                                }
                            }
                            catch (err) {
                                alert("error4");
                            }

                            return this;
                        },
                        width: 750,
                        height: 500
                    }
                };
            }
        }

    }
}