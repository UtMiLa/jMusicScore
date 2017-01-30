var JApps;
(function (JApps) {
    var Application;
    (function (Application) {
        var HtmlDesktopManager = (function () {
            function HtmlDesktopManager(rootElement) {
                this.rootElement = rootElement;
                this.areas = [];
            }
            HtmlDesktopManager.prototype.addArea = function (area, placement) {
                // Add div to rootElement
                // Set new position for clientarea
            };
            HtmlDesktopManager.prototype.removeArea = function (area) { };
            return HtmlDesktopManager;
        })();
        var FeedbackManager = (function () {
            function FeedbackManager() {
                this.clients = [];
            }
            FeedbackManager.prototype.changed = function (status, key, val) {
                for (var i = 0; i < this.clients.length; i++) {
                    this.clients[i].changed(status, key, val);
                }
            };
            FeedbackManager.prototype.registerClient = function (client) {
                this.clients.push(client);
            };
            FeedbackManager.prototype.removeClient = function (client) {
                var n = this.clients.indexOf(client);
                if (n >= 0) {
                    this.clients.splice(n, 1);
                }
            };
            return FeedbackManager;
        })();
        /** Application object manages all data and I/O in the application. Multiple applications per page should be possible, although not probable. */
        var AbstractApplication = (function () {
            function AbstractApplication(score, status) {
                this.plugins = [];
                this.readers = [];
                this.writers = [];
                this.fileManagers = [];
                this.validators = [];
                this.designers = [];
                this.editors = [];
                this.feedbackManager = new FeedbackManager();
                this.undoStack = [];
                this.redoStack = [];
                this.eventProcessors = [];
                this.document = score;
                this.status = status;
                this.status.setFeedbackManager(this.feedbackManager);
            }
            Object.defineProperty(AbstractApplication.prototype, "Status", {
                get: function () {
                    return this.status;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AbstractApplication.prototype, "FeedbackManager", {
                get: function () { return this.feedbackManager; },
                enumerable: true,
                configurable: true
            });
            AbstractApplication.prototype.addPlugin = function (plugin) {
                this.plugins.push(plugin);
                plugin.init(this);
            };
            AbstractApplication.prototype.addReader = function (reader) {
                this.readers.push(reader);
                reader.init(this);
            };
            AbstractApplication.prototype.addWriter = function (writer) {
                this.writers.push(writer);
                writer.init(this);
            };
            AbstractApplication.prototype.addFileManager = function (fileManager) {
                this.fileManagers.push(fileManager);
                fileManager.init(this);
            };
            AbstractApplication.prototype.addValidator = function (validator) {
                this.validators.push(validator);
                validator.validate(this);
            };
            AbstractApplication.prototype.addDesigner = function (designer) {
                this.designers.push(designer);
                designer.validate(this);
            };
            AbstractApplication.prototype.getFileOpenTypes = function () {
                var res = [];
                for (var i = 0; i < this.readers.length; i++) {
                    res.concat(this.readers[i].getFormats());
                }
                return res;
            };
            AbstractApplication.prototype.getFileSaveTypes = function () {
                var res = [];
                for (var i = 0; i < this.writers.length; i++) {
                    res = res.concat(this.writers[i].getFormats());
                }
                return res;
            };
            AbstractApplication.prototype.getFileManagerIds = function () {
                var res = [];
                for (var i = 0; i < this.fileManagers.length; i++) {
                    res.push(this.fileManagers[i].getId());
                }
                return res;
            };
            AbstractApplication.prototype.getFileList = function (fileManager, handler) {
                for (var i = 0; i < this.fileManagers.length; i++) {
                    if (this.fileManagers[i].getId() === fileManager) {
                        this.fileManagers[i].getFileList(handler);
                    }
                }
            };
            AbstractApplication.prototype.setExtension = function (name, type) {
                for (var i = 0; i < this.writers.length; i++) {
                    if (this.writers[i].supports(type)) {
                        var writer = this.writers[i];
                        var extension = writer.getExtension(type);
                        if (name.substr(name.length - extension.length - 1) != '.' + extension) {
                            name += '.' + extension;
                        }
                        return name;
                    }
                }
                throw "Output format not supported: " + type;
            };
            AbstractApplication.prototype.saveUsing = function (name, fileManager, type) {
                for (var i = 0; i < this.fileManagers.length; i++) {
                    if (this.fileManagers[i].getId() === fileManager) {
                        this.save(name, this.fileManagers[i], type);
                        return;
                    }
                }
                throw "File manager not found: " + fileManager;
            };
            AbstractApplication.prototype.save = function (name, fileManager, type) {
                fileManager.saveFile(name, this.saveToString(type), function (res) { });
            };
            AbstractApplication.prototype.saveToString = function (type) {
                for (var i = 0; i < this.writers.length; i++) {
                    if (this.writers[i].supports(type)) {
                        var writer = this.writers[i];
                        return writer.save();
                    }
                }
                throw "Output format not supported: " + type;
            };
            AbstractApplication.prototype.loadUsing = function (name, fileManager, type) {
                for (var i = 0; i < this.fileManagers.length; i++) {
                    if (this.fileManagers[i].getId() === fileManager) {
                        this.load(name, this.fileManagers[i], type);
                        return;
                    }
                }
                throw "File manager not found: " + fileManager;
            };
            AbstractApplication.prototype.load = function (name, fileManager, type) {
                var app = this;
                this.processEvent("clickvoice", { 'data': { voice: null } });
                var me = this;
                for (var i = 0; i < this.readers.length; i++) {
                    if (this.readers[i].supports(type) || (type === '*' && name.match(this.readers[i].getExtension(type) + "$"))) {
                        var reader = this.readers[i];
                        var data = fileManager.loadFile(name, function (data, name) {
                            var score = app.document;
                            score.clear();
                            var a = reader.load(data);
                            me.undoStack = [];
                            me.redoStack = [];
                            app.fixModel();
                            app.fixDesign();
                            app.fixEditors();
                            return a;
                        });
                        return;
                    }
                }
                throw "Input format not supported: " + type;
            };
            AbstractApplication.prototype.loadFromString = function (data, type) {
                this.processEvent("clickvoice", { 'data': { voice: null } });
                for (var i = 0; i < this.readers.length; i++) {
                    if (this.readers[i].supports(type)) {
                        var score = this.document;
                        score.clear();
                        var a = this.readers[i].load(data);
                        this.undoStack = [];
                        this.redoStack = [];
                        this.fixModel();
                        this.fixDesign();
                        this.fixEditors();
                        return a;
                    }
                }
                throw "Input format not supported: " + type;
            };
            AbstractApplication.prototype.getPlugin = function (id) {
                for (var i = 0; i < this.plugins.length; i++) {
                    if (this.plugins[i].getId() === id)
                        return this.plugins[i];
                }
                return null;
            };
            AbstractApplication.prototype.executeCommand = function (command) {
                command.execute(this);
                if (command.undo) {
                    this.undoStack.push(command);
                }
                else {
                    this.undoStack = [];
                }
                this.redoStack = [];
                this.fixModel();
                this.fixDesign();
                this.fixEditors();
            };
            AbstractApplication.prototype.canUndo = function () {
                return (this.undoStack.length) > 0;
            };
            AbstractApplication.prototype.canRedo = function () {
                return this.redoStack.length > 0;
            };
            AbstractApplication.prototype.undo = function () {
                var cmd = this.undoStack.pop();
                cmd.undo(this);
                this.redoStack.push(cmd);
                this.fixModel();
                this.fixDesign();
                this.fixEditors();
            };
            AbstractApplication.prototype.redo = function () {
                var cmd = this.redoStack.pop();
                cmd.execute(this);
                this.undoStack.push(cmd);
                this.fixModel();
                this.fixDesign();
                this.fixEditors();
            };
            AbstractApplication.prototype.fixModel = function () {
                for (var i = 0; i < this.validators.length; i++) {
                    var t = Date.now();
                    this.validators[i].validate(this);
                }
            };
            AbstractApplication.prototype.fixDesign = function () {
                for (var i = 0; i < this.designers.length; i++) {
                    var t = Date.now();
                    this.designers[i].validate(this);
                }
            };
            AbstractApplication.prototype.fixEditors = function () {
                for (var i = 0; i < this.editors.length; i++) {
                    var t = Date.now();
                    this.editors[i].validate(this);
                }
            };
            AbstractApplication.prototype.registerEventProcessor = function (eventProc) {
                this.eventProcessors.push(eventProc);
                eventProc.init(this);
            };
            AbstractApplication.prototype.unregisterEventProcessor = function (eventProc) {
                var i = this.eventProcessors.indexOf(eventProc);
                if (i >= 0) {
                    this.eventProcessors.splice(i, 1);
                    eventProc.exit(this);
                }
            };
            AbstractApplication.prototype.processEvent = function (name, message) {
                for (var i = 0; i < this.eventProcessors.length; i++) {
                    var evPro = this.eventProcessors[i];
                    if (evPro[name]) {
                        if (!evPro[name](this, message))
                            return false;
                    }
                }
                return true;
            };
            return AbstractApplication;
        })();
        Application.AbstractApplication = AbstractApplication;
    })(Application = JApps.Application || (JApps.Application = {}));
})(JApps || (JApps = {}));
/*$(document).bind("touchstart touchmove", function(e) {
  //Disable scrolling by preventing default touch behaviour
  e.preventDefault();
  var orig = e.originalEvent;
  var x = orig.changedTouches[0].pageX;
  var y = orig.changedTouches[0].pageY;
  // Move a div with id "rect"
  $("#rect").css({top: y, left: x});
}); */
//$('#MusicLayer').overscroll();
//$('#MusicLayer').hammer({prevent_default: true,})
/*.bind("touchmove", function(e) {
    //Disable scrolling by preventing default touch behaviour
    e.preventDefault();
})*/
/*.on("drag", function(event) {
    //$('#events').prepend('<li>drag'+event.gesture.deltaX+ ','+ event.gesture.eventType+ '</li>');
    //application.deltaScroll(event.gesture.deltaX);
    //application.scroll(event.clientX);
    //console.log(event.gesture.startEvent.touches.length)
    event.preventDefault();
    application.scroll(event.gesture.deltaX + dragStartX);
})
.on("touch", function(event) {
    //$('#events').prepend('<li>touch</li>');
    //event.preventDefault();
    dragStartX = application.scoreOutput.getX();
})*/
/*.on("pinch", /*".nested_el", * /function(event) {
    $('#events').prepend('<li>pinch</li>');
})
.on("hold", /*".nested_el", * /function(event) {
    $('#events').prepend('<li>hold</li>');
})
.on("doubletap", /*".nested_el", * /function(event) {
    $('#events').prepend('<li>doubletap</li>');
})
.on("tap", /*".nested_el", * /function(event) {
    $('#events').prepend('<li>tap</li>');
})*/
/*.on("swipe", function(event) {
    $('#events').prepend('<li>swipe</li>');
    event.preventDefault();
})
;*/ 
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var JApps;
(function (JApps) {
    var UI;
    (function (UI) {
        (function (ActionType) {
            ActionType[ActionType["execute"] = 0] = "execute";
            ActionType[ActionType["check"] = 1] = "check";
            ActionType[ActionType["radio"] = 2] = "radio";
        })(UI.ActionType || (UI.ActionType = {}));
        var ActionType = UI.ActionType;
        var MenuManager = (function () {
            function MenuManager() {
                this._actions = {};
            }
            MenuManager.prototype.addActions = function (actions) {
                this._actions = actions;
            };
            MenuManager.prototype.setMenu = function (menuDef) {
            };
            MenuManager.prototype.updateMenuItems = function () { };
            return MenuManager;
        })();
        UI.MenuManager = MenuManager;
        var ToolbarManager = (function () {
            function ToolbarManager() {
                this._actions = {};
            }
            /*addToolbar(toolbarDef: ToolbarDef): Toolbar;
            removeToolbar(toolbar: Toolbar): void;*/
            ToolbarManager.prototype.addActions = function (actions) {
                this._actions = actions;
            };
            return ToolbarManager;
        })();
        UI.ToolbarManager = ToolbarManager;
        var CommandLineManager = (function () {
            function CommandLineManager() {
            }
            return CommandLineManager;
        })();
        UI.CommandLineManager = CommandLineManager;
        var JQUIMenuManager = (function (_super) {
            __extends(JQUIMenuManager, _super);
            function JQUIMenuManager(element) {
                _super.call(this);
                this.element = element;
            }
            JQUIMenuManager.prototype.createMenuButton = function (item) {
                var $menuSpan = $("<span>");
                var $menuButton = $('<button class="ui-widget-header ui-corner-all ui-button ui-widget">').text(item.caption).appendTo($menuSpan);
                var $menuList = $('<ul>').appendTo($menuSpan).menu().hide();
                $menuButton.on("click", function () {
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
                for (var i = 0; i < item.subItems.length; i++) {
                    var itemDef = item.subItems[i];
                    var $item = $('<li class="ui-menu-item" >').appendTo($menuList);
                    var subCaption = itemDef.action;
                    var action = null;
                    if (this._actions[subCaption]) {
                        action = this._actions[subCaption];
                        subCaption = action.caption;
                    }
                    var $link = $('<a class="ui-menu-item-wrapper" role="menuitem" tabindex="-1">').text(subCaption).appendTo($item);
                    if (action) {
                        (function (action, $link) {
                            $link.click(function () { action.action(); return false; });
                        })(action, $link);
                    }
                    ;
                }
                return $menuSpan;
            };
            JQUIMenuManager.prototype.setMenu = function (menuDef) {
                var _this = this;
                _super.prototype.setMenu.call(this, menuDef);
                var noItems = menuDef.items.length;
                var $element = $(this.element);
                $element.addClass("controlgroup");
                $element.css({
                    backgroundColor: "Black",
                    //height: 20,
                    width: "100%"
                });
                for (var i = 0; i < noItems; i++) {
                    var item = menuDef.items[i];
                    var actionName = item.action;
                    var caption = "¤" + actionName + "¤";
                    var type;
                    if (this._actions[actionName]) {
                        var action = this._actions[actionName];
                        caption = action.caption;
                        type = action.type;
                    }
                    if (item.subItems) {
                        $element.append(this.createMenuButton(item));
                    }
                    else {
                        if (type === ActionType.radio) {
                            var $radioLabel = $("<label>").text(caption).attr("for", "x-" + caption);
                            var $radioInput = $("<input>").attr({ type: "radio", name: caption, id: "x-" + caption });
                            $element.append($radioLabel);
                            $element.append($radioInput);
                        }
                        else if (type === ActionType.execute) {
                            var $btn = $('<button class="ui-widget-header ui-corner-all ui-button ui-widget">').text(caption).click(action.action);
                            $btn.data("action", action);
                            $element.append($("<span>").append($btn.button()));
                        }
                    }
                }
                $element.controlgroup();
                $element.click(function () {
                    _this.updateMenuItems();
                });
            };
            JQUIMenuManager.prototype.updateMenuItems = function () {
                var $elements = $(this.element).find('button');
                $elements.each(function (i, e) {
                    var $elm = $(e);
                    var action = $elm.data("action");
                    if (action && action.enabled) {
                        $elm.button("option", "disabled", !action.enabled());
                    }
                });
            };
            return JQUIMenuManager;
        })(MenuManager);
        UI.JQUIMenuManager = JQUIMenuManager;
        var JQUIToolbarManager = (function (_super) {
            __extends(JQUIToolbarManager, _super);
            function JQUIToolbarManager() {
                _super.apply(this, arguments);
            }
            return JQUIToolbarManager;
        })(ToolbarManager);
        UI.JQUIToolbarManager = JQUIToolbarManager;
        var JQCommandLineManager = (function (_super) {
            __extends(JQCommandLineManager, _super);
            function JQCommandLineManager() {
                _super.apply(this, arguments);
            }
            return JQCommandLineManager;
        })(CommandLineManager);
        UI.JQCommandLineManager = JQCommandLineManager;
    })(UI = JApps.UI || (JApps.UI = {}));
})(JApps || (JApps = {}));
var JApps;
(function (JApps) {
    var IO;
    (function (IO) {
        /** REST remote file manager */
        var ServerFileManager = (function () {
            function ServerFileManager(ajaxUrl, id) {
                this.ajaxUrl = ajaxUrl;
                this.id = id;
                // new ServerFileManager ("Handler.ashx")
            }
            ServerFileManager.prototype.init = function (app) { };
            ServerFileManager.prototype.exit = function (app) { };
            ServerFileManager.prototype.getId = function () { return this.id; };
            ServerFileManager.prototype.getFileList = function (handler) {
                $.ajax(this.ajaxUrl, {
                    success: function (data) {
                        var files = data.split('\n');
                        handler(files);
                    },
                    cache: false
                });
            };
            ServerFileManager.prototype.loadFile = function (name, handler) {
                $.ajax(this.ajaxUrl, {
                    success: function (data) {
                        handler(data, name);
                    },
                    data: { 'Name': name },
                    cache: false
                });
            };
            ServerFileManager.prototype.saveFile = function (name, data, handler) {
                $.ajax(this.ajaxUrl, {
                    success: function (res) {
                        handler(res);
                    },
                    type: 'POST',
                    data: { 'Name': name, 'Data': data }
                });
            };
            return ServerFileManager;
        })();
        IO.ServerFileManager = ServerFileManager;
        /** Local storage file manager using the browser's local storage*/
        var LocalStorageFileManager = (function () {
            function LocalStorageFileManager(id) {
                this.id = id;
            }
            LocalStorageFileManager.prototype.init = function (app) { };
            LocalStorageFileManager.prototype.exit = function (app) { };
            LocalStorageFileManager.prototype.getId = function () { return this.id; };
            LocalStorageFileManager.prototype.getFileList = function (handler) {
                var a = 'file:' + this.id + ':';
                var res = [];
                for (var key in localStorage) {
                    if (key.substr(0, a.length) === a) {
                        res.push(key.substr(a.length));
                    }
                }
                handler(res);
            };
            LocalStorageFileManager.prototype.loadFile = function (name, handler) {
                handler(localStorage['file:' + this.id + ':' + name], name);
            };
            LocalStorageFileManager.prototype.saveFile = function (name, data, handler) {
                localStorage['file:' + this.id + ':' + name] = data;
            };
            return LocalStorageFileManager;
        })();
        IO.LocalStorageFileManager = LocalStorageFileManager;
    })(IO = JApps.IO || (JApps.IO = {}));
})(JApps || (JApps = {}));
var JApps;
(function (JApps) {
    var Editors;
    (function (Editors) {
        var KeybordInputPlugin = (function () {
            function KeybordInputPlugin() {
            }
            KeybordInputPlugin.prototype.init = function (app) {
                document.addEventListener("keydown", function (event) {
                    //if (document.activeElement && document.activeElement !== document.body && document.activeElement.tagName !== 'svg') return; // todo: svg element also gets focus
                    var theKeyCode = event.keyCode || event.which;
                    var keyDefs = $.ui.keyCode;
                    for (var key in keyDefs) {
                        if (theKeyCode == keyDefs[key]) {
                            if (event.altKey)
                                key = 'ALT-' + key;
                            if (event.shiftKey)
                                key = 'SHIFT-' + key;
                            if (event.ctrlKey)
                                key = 'CTRL-' + key;
                            //return this.keyPressed(app, key.toUpperCase());
                            if (!app.processEvent("keymessage", { key: key })) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                            break;
                        }
                    }
                    //return true;
                });
                document.addEventListener("keyup", function (e) {
                    //if (document.activeElement && document.activeElement !== document.body && document.activeElement.tagName !== 'svg') return; // todo: svg element also gets focus
                    if (e.ctrlKey || e.altKey) {
                        var key = e.key;
                        if (e.ctrlKey || e.altKey) {
                            if (e.altKey)
                                key = 'ALT-' + key;
                            if (e.shiftKey)
                                key = 'SHIFT-' + key;
                            if (e.ctrlKey)
                                key = 'CTRL-' + key;
                        }
                        if (!app.processEvent("keymessage", { key: key })) {
                            e.preventDefault();
                            e.stopPropagation();
                            return;
                        }
                    }
                    if (!app.processEvent("keyup", e)) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });
                document.addEventListener("keypress", function (e) {
                    //if (document.activeElement && document.activeElement !== document.body && document.activeElement.tagName !== 'svg') return; // todo: svg element also gets focus
                    /*if (!app.ProcessEvent("keypress", e)) {
                        e.preventDefault();
                        e.stopPropagation();
                    }*/
                    var key = e.key;
                    /*if (event.ctrlKey || event.altKey) {
                        if (event.altKey) key = 'ALT-' + key;
                        if (event.shiftKey) key = 'SHIFT-' + key;
                        if (event.ctrlKey) key = 'CTRL-' + key;
                    }*/
                    if (!app.processEvent("keymessage", { key: key })) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });
            };
            /*
            
            {
                            key: e.key,
                            keyCode: e.keyCode,
                            which: e.which,
                            altKey: e.altKey,
                            shiftKey: e.shiftKey,
                            ctrlKey: e.ctrlKey
                        }
            */
            KeybordInputPlugin.prototype.getId = function () { return 'KeybordInputPlugin'; };
            return KeybordInputPlugin;
        })();
        Editors.KeybordInputPlugin = KeybordInputPlugin;
    })(Editors = JApps.Editors || (JApps.Editors = {}));
})(JApps || (JApps = {}));
//# sourceMappingURL=japps.js.map