module JApps.UI {

    enum ActionType { execute, check, radio }

    interface Action {
        caption: string;
        helpText?: string;
        icon?: string;
        action: () => void;
        enabled?: () => boolean;
        visible?: () => boolean;
        type: ActionType;
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

    interface ActionMenuItemDef {
        action: string;
    }

    interface ParentMenuItemDef {
        action?: string;
        subItems: MenuItemDef[];
        caption: string;
    }

    type MenuItemDef = ActionMenuItemDef | ParentMenuItemDef;

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

        private createMenuButton(item: ParentMenuItemDef): JQuery {
            var $menuSpan = $("<span>");
            var $menuButton = $('<button class="ui-widget-header ui-corner-all ui-button ui-widget">').text(item.caption).appendTo($menuSpan);
            var $menuList = $('<ul>').appendTo($menuSpan).menu().hide();
            $menuButton.on("click", function() {
                $menuList.show().position({
                    my: "left top",
                    at: "left bottom",
                    of: this
                });
                $(document).one("click", function () {
                    $menuList.hide();
                });
                return false;
            });
            for (let i = 0; i < item.subItems.length; i++) {
                var itemDef = item.subItems[i];
                var $item = $('<li class="ui-menu-item" >').appendTo($menuList);
                var subCaption = itemDef.action;
                var action: Action = null;
                if (this._actions[subCaption]) {
                    action = this._actions[subCaption];
                    subCaption = action.caption;
                }
                var $link = $('<a class="ui-menu-item-wrapper" role="menuitem" tabindex="-1">').text(subCaption).appendTo($item);
                if (action) {
                    (function (action: Action, $link: JQuery) {
                        $link.click(function () { var command = action.action(); /* todo: app.ExecuteCommand(command); */ return false; });
                    })(action, $link)
                };
            }
            return $menuSpan;
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
                let item = menuDef.items[i];
                let actionName = item.action;
                let caption = "¤" + actionName + "¤";
                var type: ActionType;
                if (this._actions[actionName]) {
                    var action = this._actions[actionName]
                    caption = action.caption;
                    type = action.type;
                }
                if ((<ParentMenuItemDef>item).subItems) {
                    $element.append(this.createMenuButton(<ParentMenuItemDef>item));
                }
                else {
                    if (type === ActionType.radio) {
                        let $radioLabel = $("<label>").text(caption).attr("for", "x-" + caption);
                        let $radioInput = $("<input>").attr({ type: "radio", name: caption, id: "x-" + caption });
                        $element.append($radioLabel);
                        $element.append($radioInput);
                    }
                }
            }
            $element.controlgroup();
        }

    }
    class JQUIToolbarManager extends ToolbarManager {
    }
    class JQCommandLineManager extends CommandLineManager {
    }

    var jMusicActions: ActionCollection = {
        FileLoad: { caption: "Load", action: () => { }, type: ActionType.execute },
        FileSaveAs: { caption: "SaveAs", action: () => { alert("save"); }, type: ActionType.execute },
        FileNew: { caption: "New", action: () => { return new jMusicScore.Model.ClearScoreCommand({}); }, type: ActionType.execute },
        Voice: { caption: "Voice", action: () => { }, type: ActionType.execute },
        ExportSVG: { caption: "SVG", action: () => { }, type: ActionType.execute },
        ExportJSON: { caption: "JSON", action: () => { }, type: ActionType.execute },
        ExportLilypond: { caption: "Lilypond", action: () => { }, type: ActionType.execute },
        ExportMusicXml: { caption: "MusicXml", action: () => { }, type: ActionType.execute },
        Staves: { caption: "Staves", action: () => { }, type: ActionType.execute },
        TestLoadSaved: { caption: "LoadSaved", action: () => { }, type: ActionType.execute },
        TestSaveSaved: { caption: "SaveSaved", action: () => { }, type: ActionType.execute },
    };
    var jMusicMenuDef: MenuDef = {
        items: [
            {
                caption: "File",
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
                caption: "Export",
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
                caption: "Test",
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