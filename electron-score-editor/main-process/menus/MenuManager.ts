
import {UI} from "../../../jApps/Japps.ui";

import{Application} from "../../../jApps/application";
import{Editors as JAppsEditors} from "../../../jApps/Browser/keyboard";
import{Configuration} from "../../../jApps/Configuration";
import{IO} from "../../../jApps/Browser/jApps.BrowserFileSystem";
import{JAppsBrowser} from "../../../jApps/Browser/jApps.Browser";
//import {MusicEditors} from "../../../jMusicScore/jMusicScore.Editors";
import {CanvasView} from "../../../jMusicScore/jMusicScore.CanvasView";
import {SvgView} from "../../../jMusicScore/jMusicScore.SvgView";
import {ScoreApplication} from "../../../jMusicScore/jMusicScore.Application";
import {Model} from "../../../jMusicScore/jMusicScore";
import {JMusicScoreUi} from "../../../jMusicScore/jMusicScore.UI";
import {Commands} from "../../../jMusicScore/commands";
import {Players} from "../../../jMusicScore/midiEditor";
import {Editors as MidiEditors} from "../../../jMusicScore/midiIn";
import {FinaleUi} from "../../../jMusicScore/FinaleEmulator";

import {MusicXml} from "../../../jMusicScore/jMusicScore.MusicXml";
import {Lilypond} from "../../../jMusicScore/jMusicScore.Lilypond";
import {Json} from "../../../jMusicScore/jsonReader";
import {Validators} from "../../../jMusicScore/validators";
import {GhostElements} from "../../../jMusicScore/ghostElements";


const electron = require('electron');
//const BrowserWindow = electron.BrowserWindow
const Menu = electron.remote.Menu;
const app = electron.remote.app;


export module MenuManager{

    //alert(JSON.stringify(JAppsMM));
    //import ParentMenuItemDef from "../../jApps/jApps";

    export class MenuManager extends UI.MenuManager {

        constructor(private element: string){
            super();
        }

        /*private createMenuButton(item: UI.ParentMenuItemDef): JQuery {
            var $menuSpan = $("<span>");
            var $menuButton = $('<button class="ui-widget-header ui-corner-all ui-button ui-widget">').text(item.caption + "---").appendTo($menuSpan);
            var $menuList = $('<ul style="color:red">').appendTo($menuSpan).menu().hide();
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
                var action: UI.Action = null;
                if (this._actions[subCaption]) {
                    action = this._actions[subCaption];
                    subCaption = action.caption;
                }
                var $link = $('<a class="ui-menu-item-wrapper" role="menuitem" tabindex="-1">').text(subCaption).appendTo($item);
                if (action) {
                    (function (action: UI.Action, $link: JQuery) {
                        $link.click(function () { action.action(); return false; });
                    })(action, $link)
                };
            }
            return $menuSpan;
        }*/

        
        isParentItem(menuDef: any): menuDef is UI.ParentMenuItemDef {
            return menuDef.subItems != undefined;
        }


        createMenu(menu: UI.MenuItemDef): any{
            let actionName = menu.action;
            let caption = "¤" + actionName + "¤";
            if (this.isParentItem(menu)) {//if ((<UI.ParentMenuItemDef>menu).caption) {
                caption = (<UI.ParentMenuItemDef>menu).caption;
            }
            var type: UI.ActionType;
            var action: UI.Action = null;
            if (this._actions[actionName]) {
                action = this._actions[actionName]
                caption = action.caption;
                type = action.type;
            }
            var obj: any = {
                label:caption,
                submenu: <any[]>[]
            };

            if (action){
                obj.click = function (item: any, focusedWindow: any) {
                    action.action();
                };
            }
            if (this.isParentItem(menu)) {
                for (var i = 0; i < menu.subItems.length; i++){
                    let subItem = menu.subItems[i];
                    //let subItemToAdd= { label: subitem.action };
                    obj.submenu.push(this.createMenu(subItem));
                }
            }
            else {
                obj.submenu = undefined;
            }
            return obj;
        }

        setMenu(menuDef: UI.MenuDef): void {
            //console.log("setMenu");
            //console.log(menuDef);
            super.setMenu(menuDef);

            let template = [];
            for(var i = 0; i < menuDef.items.length; i++){
                template.push(this.createMenu(menuDef.items[i]));
            }
              
            const menu = Menu.buildFromTemplate(template)
            Menu.setApplicationMenu(menu)
            


            /*var noItems = menuDef.items.length;
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
                var type: UI.ActionType;
                if (this._actions[actionName]) {
                    var action = this._actions[actionName]
                    caption = action.caption;
                    type = action.type;
                }
                if ((<UI.ParentMenuItemDef>item).subItems) {
                    $element.append(this.createMenuButton(<UI.ParentMenuItemDef>item));
                }
                else {
                    if (type === UI.ActionType.radio) {
                        let $radioLabel = $("<label>").text(caption).attr("for", "x-" + caption);
                        let $radioInput = $("<input>").attr({ type: "radio", name: caption, id: "x-" + caption });
                        $element.append($radioLabel);
                        $element.append($radioInput);
                    }
                    else if (type === UI.ActionType.execute) {
                        var $btn = $('<button class="ui-widget-header ui-corner-all ui-button ui-widget">').text(caption).click(action.action);
                        $btn.data("action", action);
                        $element.append($("<span>").append($btn.button()));
//                        /*if ((action && action.enabled && !action.enabled()) || !action) {
//                            $btn.button("option", "disabled", true);
//                        }
                    }
                }
            }
            $element.controlgroup();
            $element.click(() => {
                this.updateMenuItems();
            });*/
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
}