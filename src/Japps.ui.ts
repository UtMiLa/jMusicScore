module JApps.UI {

    interface Action {
        caption: string;
        helpText?: string;
        icon?: string;
        action: () => void;
        enabled?: () => boolean;
        visible?: () => boolean;
    }

    interface CheckAction {
    }

    interface RadioGroup {

    }

    interface ActionCollection {
        [name: string]: Action;
    }

    interface ToolbarDef {
    }

    interface ToolGroupDef {
    }

    interface MenuItemDef {
        action?: string;
        subItems?: MenuItemDef[];
    }

    interface MenuDef {
        items: MenuItemDef[];
    }

    interface Toolbar {
    }

    interface ActionManager {
    }

    class MenuManager implements ActionManager {
        constructor() { }
        _actions: ActionCollection = {};

        addActions(actions: ActionCollection) {
            this._actions = actions;
        }

        setMenu(menuDef: MenuDef): void {
        }
    }
    class ToolbarManager implements ActionManager {
        _actions: ActionCollection = {};
        /*addToolbar(toolbarDef: ToolbarDef): Toolbar;
        removeToolbar(toolbar: Toolbar): void;*/
        addActions(actions: ActionCollection) {
            this._actions = actions;
        }

    }
    class CommandLineManager implements ActionManager {
    }


    class JQUIMenuManager extends MenuManager {
        constructor(private element: string) {
            super();
        }

        setMenu(menuDef: MenuDef): void {
            super.setMenu(menuDef);
            var noItems = menuDef.items.length;
            var $element = $(this.element);
            $element.addClass("controlgroup");
            $element.css({
                backgroundColor: "Black",
                //height: 20,
                width: "100%"
            });

            for (let i = 0; i < noItems; i++) {
                /*let $newDiv = $("<div>").text(menuDef.items[i].action);
                $newDiv.css({
                    backgroundColor: "#efb",
                    height: 20,
                    width: "100%"
                });*/
                let item = menuDef.items[i];
                let action = item.action;
                let caption = "¤" + action + "¤";
                if (this._actions[action]) {
                    caption = this._actions[action].caption;
                }
                let $radioLabel = $("<label>").text(caption).attr("for", "x-" + caption);
                let $radioInput = $("<input>").attr({ type:"radio", name:caption, id:"x-"+caption });
                $element.append($radioLabel);
                $element.append($radioInput);
            }
            $element.controlgroup();
        }

    }
    class JQUIToolbarManager extends ToolbarManager {
    }
    class JQCommandLineManager extends CommandLineManager {
    }

    var jMusicActions: ActionCollection = {
        FileLoad: { caption: "Load", action: () => {} },
        FileSaveAs: { caption: "SaveAs", action: () => {} },
        FileNew: { caption: "New", action: () => {} },
        Voice: { caption: "Voice", action: () => {} },
        ExportSVG: { caption: "SVG", action: () => {} },
        ExportJSON: { caption: "JSON", action: () => {} },
        ExportLilypond: { caption: "Lilypond", action: () => {} },
        ExportMusicXml: { caption: "MusicXml", action: () => {} },
        Staves: { caption: "Staves", action: () => {} },
        TestLoadSaved: { caption: "LoadSaved", action: () => {} },
        TestSaveSaved: { caption: "SaveSaved", action: () => {} },
    };
    var jMusicMenuDef: MenuDef = {
        items: [
            {
                action: "File",
                subItems: [
                    {
                        action: "FileLoad",
                    },
                    {
                        action: "FileSaveAs",
                    },
                    {
                        action: "FileNew",
                    }
                ]
            },
            {
                action: "Voice",
            },
            {
                action: "Export",
                subItems: [
                    {
                        action: "ExportSVG",
                    },
                    {
                        action: "ExportJSON",
                    },
                    {
                        action: "ExportLilypond",
                    },
                    {
                        action: "ExportMusicXml",
                    }
                ]
            },
            {
                action: "Staves",
            },
            {
                action: "Test",
                subItems: [
                    {
                        action: "TestLoadSaved",
                    },
                    {
                        action: "TestSaveSaved",
                    },
                ]
            },
        ],
    };

    $(function () {
        var menuman = new JQUIMenuManager('#notetools5');
        menuman.addActions(jMusicActions);
        menuman.setMenu(jMusicMenuDef);
    });
}