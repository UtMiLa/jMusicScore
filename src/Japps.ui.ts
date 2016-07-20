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

    interface ToolbarDef {
    }

    interface ToolGroupDef {
    }

    interface MenuDef {
    }

    interface Toolbar {
    }

    interface ActionProcessor {
        setMenu(menuDef: MenuDef): void;
        addToolbar(toolbarDef: ToolbarDef): Toolbar;
        removeToolbar(toolbar: Toolbar): void;

    }

}