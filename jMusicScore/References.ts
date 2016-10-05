/// <reference path="node_modules/japps/application.d.ts" />
/// <reference path="node_modules/japps/jApps.ui.d.ts" />
/// <reference path="node_modules/japps/keyboard.d.ts" />
/// <reference path="node_modules/japps/jApps.BrowserFileSystem.d.ts" />
declare namespace JQueryUI {
    interface ButtonOptions {
        icon?: string;
        iconPosition?: string;
        showLabel?: boolean;
    }

    interface Button extends Widget, ButtonOptions {
    }

    interface CheckboxRadioOptions {
    }
}
interface JQuery {
    checkboxradio(options: JQueryUI.CheckboxRadioOptions): JQuery;
    controlgroup(): JQuery;
}