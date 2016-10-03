module JApps.UI {

    export enum ActionType { execute, check, radio }

    export interface Action {
        caption: string;
        helpText?: string;
        icon?: string;
        action: () => void;
        enabled?: () => boolean;
        visible?: () => boolean;
        type: ActionType;
    }
    
    export interface RadioGroup {

    }

    export interface ActionCollection {
        [name: string]: Action;
    }

    export interface ToolbarDef {
    }

    export interface ToolGroupDef {
    }

    export interface ActionMenuItemDef {
        action: string;
    }

    export interface ParentMenuItemDef {
        action?: string;
        subItems: MenuItemDef[];
        caption: string;
    }

    export type MenuItemDef = ActionMenuItemDef | ParentMenuItemDef;

    export interface MenuDef {
        items: MenuItemDef[];
    }

    export interface Toolbar {
    }

    export interface ActionManager {
    }

    export class MenuManager implements ActionManager {
        constructor() { }
        _actions: ActionCollection = {};

        addActions(actions: ActionCollection) {
            this._actions = actions;
        }

        setMenu(menuDef: MenuDef): void {
        }

        updateMenuItems(): void { }
    }
    export class ToolbarManager implements ActionManager {
        _actions: ActionCollection = {};
        /*addToolbar(toolbarDef: ToolbarDef): Toolbar;
        removeToolbar(toolbar: Toolbar): void;*/
        addActions(actions: ActionCollection) {
            this._actions = actions;
        }

    }
    export class CommandLineManager implements ActionManager {
    }


    export class JQUIMenuManager extends MenuManager {
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
                        $link.click(function () { action.action(); return false; });
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
                    else if (type === ActionType.execute) {
                        var $btn = $('<button class="ui-widget-header ui-corner-all ui-button ui-widget">').text(caption).click(action.action);
                        $btn.data("action", action);
                        $element.append($("<span>").append($btn.button()));
                        /*if ((action && action.enabled && !action.enabled()) || !action) {
                            $btn.button("option", "disabled", true);
                        }*/
                    }
                }
            }
            $element.controlgroup();
            $element.click(() => {
                this.updateMenuItems();
            });
        }

        updateMenuItems() {
            var $elements = $(this.element).find('button');
            $elements.each(function (i, e) {
                let $elm = $(e);
                let action = $elm.data("action");
                if (action && action.enabled) {
                        $elm.button("option", "disabled", !action.enabled());
                }
            });
        }
    }
    export class JQUIToolbarManager extends ToolbarManager {
    }
    export class JQCommandLineManager extends CommandLineManager {
    }


}