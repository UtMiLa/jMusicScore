declare module JApps.UI {
    enum ActionType {
        execute = 0,
        check = 1,
        radio = 2,
    }
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
        constructor();
        _actions: ActionCollection;
        addActions(actions: ActionCollection): void;
        setMenu(menuDef: MenuDef): void;
        updateMenuItems(): void;
    }
    class ToolbarManager implements ActionManager {
        _actions: ActionCollection;
        addActions(actions: ActionCollection): void;
    }
    class CommandLineManager implements ActionManager {
    }
    class JQUIMenuManager extends MenuManager {
        private element;
        constructor(element: string);
        private createMenuButton(item);
        setMenu(menuDef: MenuDef): void;
        updateMenuItems(): void;
    }
    class JQUIToolbarManager extends ToolbarManager {
    }
    class JQCommandLineManager extends CommandLineManager {
    }
}
