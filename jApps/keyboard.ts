import {Application} from './application';


    export module Editors {
        export class KeybordInputPlugin<TDocumentType extends Application.IAppDoc, TStatusManager extends Application.IStatusManager> implements Application.IPlugIn<TDocumentType, TStatusManager> {
            public init(app: Application.AbstractApplication<TDocumentType, TStatusManager>) {
                document.addEventListener("keydown", function (event: JQueryEventObject) {
                    //if (document.activeElement && document.activeElement !== document.body && document.activeElement.tagName !== 'svg') return; // todo: svg element also gets focus

                    var theKeyCode = event.keyCode || event.which;
                    var keyDefs = <any>$.ui.keyCode;
                    for (var key in keyDefs) {
                        if (theKeyCode == keyDefs[key]) {
                            if (event.altKey) key = 'ALT-' + key;
                            if (event.shiftKey) key = 'SHIFT-' + key;
                            if (event.ctrlKey) key = 'CTRL-' + key;

                            //return this.keyPressed(app, key.toUpperCase());
                            if (!app.processEvent("keymessage", { key: key })) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                            break;
                        }
                    }
                    //return true;
                });
                document.addEventListener("keyup", function (e: JQueryEventObject) {
                    //if (document.activeElement && document.activeElement !== document.body && document.activeElement.tagName !== 'svg') return; // todo: svg element also gets focus
                    if (e.ctrlKey || e.altKey) {
                        var key = e.key;
                        if (e.ctrlKey || e.altKey) {
                            if (e.altKey) key = 'ALT-' + key;
                            if (e.shiftKey) key = 'SHIFT-' + key;
                            if (e.ctrlKey) key = 'CTRL-' + key;
                        }
                        if (!app.processEvent("keymessage", { key: key })) {
                            e.preventDefault();
                            e.stopPropagation();
                            return;
                        }

                        /*if (!app.ProcessEvent("keypress", e)) {
                            e.preventDefault();
                            e.stopPropagation();
                            return;
                        }*/
                    }
                    if (!app.processEvent("keyup", e)) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });
                document.addEventListener("keypress", function (e: JQueryEventObject) {
                    //if (document.activeElement && document.activeElement !== document.body && document.activeElement.tagName !== 'svg') return; // todo: svg element also gets focus
                    /*if (!app.ProcessEvent("keypress", e)) {
                        e.preventDefault();
                        e.stopPropagation();
                    }*/
                    var key = <string>e.key;
                    /*if (event.ctrlKey || event.altKey) {
                        if (event.altKey) key = 'ALT-' + key;
                        if (event.shiftKey) key = 'SHIFT-' + key;
                        if (event.ctrlKey) key = 'CTRL-' + key;
                    }*/
                    if (!app.processEvent("keymessage", { key: key })) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });
            }

            /*
            
            {
                            key: e.key,
                            keyCode: e.keyCode,
                            which: e.which,
                            altKey: e.altKey,
                            shiftKey: e.shiftKey,
                            ctrlKey: e.ctrlKey
                        }
            */

            public getId(): string { return 'KeybordInputPlugin'; }
        }

    }
