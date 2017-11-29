export module UI {

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


}