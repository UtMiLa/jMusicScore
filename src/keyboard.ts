module jMusicScore {
    export module Editors {
        export class KeybordInputPlugin implements ScoreApplication.ScorePlugin {
            public Init(app: ScoreApplication.ScoreApplication) {
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
                            if (!app.ProcessEvent("keymessage", { key: key })) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                        }
                    }
                    //return true;
                });
                document.addEventListener("keyup", function (e: JQueryEventObject) {
                    //if (document.activeElement && document.activeElement !== document.body && document.activeElement.tagName !== 'svg') return; // todo: svg element also gets focus
                    if (e.ctrlKey || e.altKey) {
                        var key = e.key;
                        if (event.ctrlKey || event.altKey) {
                            if (event.altKey) key = 'ALT-' + key;
                            if (event.shiftKey) key = 'SHIFT-' + key;
                            if (event.ctrlKey) key = 'CTRL-' + key;
                        }
                        if (!app.ProcessEvent("keymessage", { key: key })) {
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
                    if (!app.ProcessEvent("keyup", e)) {
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
                    if (!app.ProcessEvent("keymessage", { key: key })) {
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

            public GetId(): string { return 'KeybordInputPlugin'; }
        }

    }
}