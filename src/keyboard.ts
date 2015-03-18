module jMusicScore {
    export module Editors {
        export class KeybordInputPlugin implements ScoreApplication.ScorePlugin {
            public Init(app: ScoreApplication.ScoreApplication) {
                document.addEventListener("keydown", function (e: JQueryEventObject) {
                    //if (document.activeElement && document.activeElement !== document.body && document.activeElement.tagName !== 'svg') return; // todo: svg element also gets focus
                    if (!app.ProcessEvent("keydown", e)) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });
                document.addEventListener("keyup", function (e: JQueryEventObject) {
                    //if (document.activeElement && document.activeElement !== document.body && document.activeElement.tagName !== 'svg') return; // todo: svg element also gets focus
                    if (e.ctrlKey || e.altKey) {
                        if (!app.ProcessEvent("keypress", e)) {
                            e.preventDefault();
                            e.stopPropagation();
                            return;
                        }
                    }
                    if (!app.ProcessEvent("keyup", e)) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });
                document.addEventListener("keypress", function (e: JQueryEventObject) {
                    //if (document.activeElement && document.activeElement !== document.body && document.activeElement.tagName !== 'svg') return; // todo: svg element also gets focus
                    if (!app.ProcessEvent("keypress", e)) {
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