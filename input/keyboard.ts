module jMusicScore {
    export module Editors {
        export class KeybordInputPlugin implements Application.IPlugIn {
            public Init(app: Application.Application) {
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

            public GetId(): string { return 'KeybordInputPlugin'; }
        }

    }
}