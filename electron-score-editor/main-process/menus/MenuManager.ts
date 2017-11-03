
module MenuManager{
    const JAppsMM = JApps.UI.MenuManager;//require("../../jApps/JApps");

    //alert(JSON.stringify(JAppsMM));
    //import ParentMenuItemDef from "../../jApps/jApps";
/*
    export class MenuManager extends JAppsMM {

        constructor(private element: string){
            super();
        }

        private createMenuButton(item: JApps.UI.ParentMenuItemDef): JQuery {
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
                var action: JApps.UI.Action = null;
                if (this._actions[subCaption]) {
                    action = this._actions[subCaption];
                    subCaption = action.caption;
                }
                var $link = $('<a class="ui-menu-item-wrapper" role="menuitem" tabindex="-1">').text(subCaption).appendTo($item);
                if (action) {
                    (function (action: JApps.UI.Action, $link: JQuery) {
                        $link.click(function () { action.action(); return false; });
                    })(action, $link)
                };
            }
            return $menuSpan;
        }

        setMenu(menuDef: JApps.UI.MenuDef): void {
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
                var type: JApps.UI.ActionType;
                if (this._actions[actionName]) {
                    var action = this._actions[actionName]
                    caption = action.caption;
                    type = action.type;
                }
                if ((<JApps.UI.ParentMenuItemDef>item).subItems) {
                    $element.append(this.createMenuButton(<JApps.UI.ParentMenuItemDef>item));
                }
                else {
                    if (type === JApps.UI.ActionType.radio) {
                        let $radioLabel = $("<label>").text(caption).attr("for", "x-" + caption);
                        let $radioInput = $("<input>").attr({ type: "radio", name: caption, id: "x-" + caption });
                        $element.append($radioLabel);
                        $element.append($radioInput);
                    }
                    else if (type === JApps.UI.ActionType.execute) {
                        var $btn = $('<button class="ui-widget-header ui-corner-all ui-button ui-widget">').text(caption).click(action.action);
                        $btn.data("action", action);
                        $element.append($("<span>").append($btn.button()));
                        /*if ((action && action.enabled && !action.enabled()) || !action) {
                            $btn.button("option", "disabled", true);
                        }* /
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

    }*/
}