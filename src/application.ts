/// <reference path="jMusicScore.ts"/>
module jMusicScore {

    export module Application {

        /** Every external plugin to application must implement this interface */
        export interface IPlugIn<DocumentType extends IAppDoc, StatusManager extends IStatusManager, ContainerType> {
            Init(app: AbstractApplication<DocumentType, StatusManager, ContainerType>): void;
            GetId(): string;
        }

        /** Interface for file readers (in varying formats) */
        export interface IReaderPlugIn<DocumentType extends IAppDoc, StatusManager extends IStatusManager, ContainerType> extends IPlugIn<DocumentType, StatusManager, ContainerType> {
            //Init(app: AbstractApplication): void;
            Supports(type: string): boolean;
            GetExtension(type: string): string;
            Load(data: any): void;
            GetId(): string;
            GetFormats(): string[];
        }

        /** Interface for file writers */
        export interface IWriterPlugIn<DocumentType extends IAppDoc, StatusManager extends IStatusManager, ContainerType> extends IPlugIn<DocumentType, StatusManager, ContainerType> {
            //Init(app: AbstractApplication): void;
            Supports(type: string): boolean;
            GetExtension(type: string): string;
            Save(): string;
            GetId(): string;
            GetFormats(): string[];
        }

        /** Interface for commands. Every user action that changes data in the model must use Command objects. */
        export interface ICommand<DocumentType extends IAppDoc, StatusManager extends IStatusManager, ContainerType> {
            Execute(app: AbstractApplication<DocumentType, StatusManager, ContainerType>): void;
            Undo?(app: AbstractApplication<DocumentType, StatusManager, ContainerType>): void;
        }

        /** Interface for objects that check and refines the model after every change (like beam calculation) */
        export interface IValidator<DocumentType extends IAppDoc, StatusManager extends IStatusManager, ContainerType> {
            Validate(app: AbstractApplication<DocumentType, StatusManager, ContainerType>): void;
        }

        /** Interface for objects that check and refines the user interface after every model change (like spacing and drawing) */
        export interface IDesigner<DocumentType extends IAppDoc, StatusManager extends IStatusManager, ContainerType> {
            Validate(app: AbstractApplication<DocumentType, StatusManager, ContainerType>): void;
        }

        /** Interface for pluggable event processors that can handle events */
        export interface IEventProcessor<DocumentType extends IAppDoc, StatusManager extends IStatusManager, ContainerType> {
            Init(app: AbstractApplication<DocumentType, StatusManager, ContainerType>): void;
            Exit(app: AbstractApplication<DocumentType, StatusManager, ContainerType>): void;

            midinoteoff? (app: AbstractApplication<DocumentType, StatusManager, ContainerType>, event: IMessage): boolean;
            keypressed? (app: AbstractApplication<DocumentType, StatusManager, ContainerType>, event: IMessage): boolean;
            keyup? (app: AbstractApplication<DocumentType, StatusManager, ContainerType>, event: IMessage): boolean;
            keydown? (app: AbstractApplication<DocumentType, StatusManager, ContainerType>, event: IMessage): boolean;
        }

        /** Interface for file managers that can load and save files in various file systems (remote or local) */
        export interface IFileManager<DocumentType extends IAppDoc, StatusManager extends IStatusManager, ContainerType> {
            Init(app: AbstractApplication<DocumentType, StatusManager, ContainerType>): void;
            Exit(app: AbstractApplication<DocumentType, StatusManager, ContainerType>): void;

            getFileList(handler: (data: string[]) => void): void;
            loadFile(name: string, handler: (data: string, name: string) => void): void;
            saveFile(name: string, data: string, handler: (res: string) => void): void;
            GetId(): string;
        }

        export interface IDesktopArea { }

        /** Manages the various components (toolbars, client areas etc) on the desktop */
        export interface IDesktopManager {
            addArea(area: IDesktopArea, placement: string): void;
            removeArea(area: IDesktopArea): void;
        }

        class HTMLDesktopManager implements IDesktopManager { // todo: move away from this module
            constructor(private rootElement: Element) { }
            private _areas: IDesktopArea[] = [];
            addArea(area: IDesktopArea, placement: string) {
                // Add div to rootElement
                // Set new position for clientarea
            }
            removeArea(area: IDesktopArea) { }
        }

        /** UI elements that can display feedback to user input must implement this interface and register into the feedback manager */
        export interface IFeedbackClient {
            changed(status: IStatusManager, key: string, val: any): void;
        }

        /** Feedback manager - receives status changes from Status manager and dispatches them to clients. An AbstractApplication has one Feedback manager. Should possibly be merged with StatusManager. */
        export interface IFeedbackManager {
            changed(status: IStatusManager, key: string, val: any): void;
            registerClient(client: IFeedbackClient): void;
            removeClient(client: IFeedbackClient): void;
        }

        /** Status manager registers input status (pressed keys, selected buttons etc) and informs Feedback manager about changes. An AbstractApplication has one Status manager. */
        export interface IStatusManager {
            setFeedbackManager(f: IFeedbackManager): void;
        }

        class FeedbackManager implements IFeedbackManager {
            constructor() {
            }
            private _clients: IFeedbackClient[] = [];
            public changed(status: IStatusManager, key: string, val: any) {
                for (var i = 0; i < this._clients.length; i++) {
                    this._clients[i].changed(status, key, val);
                }
            }
            public registerClient(client: IFeedbackClient) {
                this._clients.push(client);
            }
            public removeClient(client: IFeedbackClient) {
                var n = this._clients.indexOf(client);
                if (n >= 0) {
                    this._clients.splice(n, 1);
                }
            }
        }

        export interface IMessage {
            key?: string;
        }

        export interface IEventReceiver {
            ProcessEvent(name: string, message: IMessage): boolean;
        }

        export interface IAppDoc {
            clear(): void;
        }

        /** AbstractApplication object manages all data and I/O in the application. Multiple applications per page should be possible, although not probable. */
        export class AbstractApplication<DocumentType extends IAppDoc, StatusManager extends IStatusManager, ContainerType> {
            constructor(public container: ContainerType, score: DocumentType, status: StatusManager) {
                this.document = score;
                this.status = status;
                this.status.setFeedbackManager(this.feedbackManager);
            }

            public document: DocumentType;
            private plugins: IPlugIn<DocumentType, StatusManager, ContainerType>[] = [];
            private readers: IReaderPlugIn<DocumentType, StatusManager, ContainerType>[] = [];
            private writers: IWriterPlugIn<DocumentType, StatusManager, ContainerType>[] = [];
            private fileManagers: IFileManager<DocumentType, StatusManager, ContainerType>[] = [];
            private validators: IValidator<DocumentType, StatusManager, ContainerType>[] = [];
            private designers: IDesigner<DocumentType, StatusManager, ContainerType>[] = [];
            private editors: IDesigner<DocumentType, StatusManager, ContainerType>[] = [];
            private feedbackManager: IFeedbackManager = new FeedbackManager();
            private status: StatusManager;

            public get Status(): StatusManager {
                return this.status;
            }
            public get FeedbackManager(): IFeedbackManager { return this.feedbackManager; }

            public AddPlugin(plugin: IPlugIn<DocumentType, StatusManager, ContainerType>) {
                this.plugins.push(plugin);
                plugin.Init(this);
            }

            public AddReader(reader: IReaderPlugIn<DocumentType, StatusManager, ContainerType>) {
                this.readers.push(reader);
                reader.Init(this);
            }

            public AddWriter(writer: IWriterPlugIn<DocumentType, StatusManager, ContainerType>) {
                this.writers.push(writer);
                writer.Init(this);
            }

            public AddFileManager(fileManager: IFileManager<DocumentType, StatusManager, ContainerType>) {
                this.fileManagers.push(fileManager);
                fileManager.Init(this);
            }

            public AddValidator(validator: IValidator<DocumentType, StatusManager, ContainerType>) {
                this.validators.push(validator);
                validator.Validate(this);
            }

            public AddDesigner(designer: IDesigner<DocumentType, StatusManager, ContainerType>) {
                this.designers.push(designer);
                designer.Validate(this);
            }

            public GetFileOpenTypes(): string[] {
                var res: string[] = [];
                for (var i = 0; i < this.readers.length; i++) {
                    res.concat(this.readers[i].GetFormats());
                }
                return res;
            }

            public GetFileSaveTypes(): string[]{
                var res: string[] = [];
                for (var i = 0; i < this.writers.length; i++) {
                    res = res.concat(this.writers[i].GetFormats());
                }
                return res;
            }

            public GetFileManagerIds(): string[] {
                var res: string[] = [];
                for (var i = 0; i < this.fileManagers.length; i++) {
                    res.push(this.fileManagers[i].GetId());
                }
                return res;
            }

            public GetFileList(fileManager:string, handler: (data: string[]) => void) {
                for (var i = 0; i < this.fileManagers.length; i++) {
                    if (this.fileManagers[i].GetId() === fileManager) {
                        this.fileManagers[i].getFileList(handler);
                    }
                }
            }

            public SetExtension(name: string, type: string) {
                for (var i = 0; i < this.writers.length; i++) {
                    if (this.writers[i].Supports(type)) {
                        var writer = this.writers[i];
                        var extension = writer.GetExtension(type);
                        if (name.substr(name.length - extension.length - 1) != '.' + extension) {
                            name += '.' + extension;
                        }
                        return name;
                    }
                }
                throw "Output format not supported: " + type;
            }

            public SaveUsing(name: string, fileManager: string, type: string) {
                for (var i = 0; i < this.fileManagers.length; i++) {
                    if (this.fileManagers[i].GetId() === fileManager) {
                        this.Save(name, this.fileManagers[i], type);
                        return;
                    }
                }
                throw "File manager not found: " + fileManager;
            }

            public Save(name: string, fileManager: IFileManager<DocumentType, StatusManager, ContainerType>, type: string) {
                fileManager.saveFile(name, this.SaveToString(type), function (res: string) { });
            }

            public SaveToString(type: string): string {
                for (var i = 0; i < this.writers.length; i++) {
                    if (this.writers[i].Supports(type)) {
                        var writer = this.writers[i];
                        return writer.Save();
                    }
                }
                throw "Output format not supported: " + type;
            }

            public LoadUsing(name: string, fileManager: string, type: string) {
                for (
                    var i = 0; i < this.fileManagers.length; i++) {
                    if (this.fileManagers[i].GetId() === fileManager) {
                        this.Load(name, this.fileManagers[i], type);
                        return;
                    }
                }
                throw "File manager not found: " + fileManager;
            }

            public Load(name: string, fileManager: IFileManager<DocumentType, StatusManager, ContainerType>, type: string) {
                var app = this;
                this.ProcessEvent("clickvoice", <any>{ 'data': <any>{ voice: null } });
                for (var i = 0; i < this.readers.length; i++) {
                    if (this.readers[i].Supports(type) || (type === '*' && name.match(this.readers[i].GetExtension(type) + "$"))) {
                        var reader = this.readers[i];
                        var data = fileManager.loadFile(name, function (data: string, name: string) {
                            var score = app.document;
                            score.clear();

                            var a = reader.Load(data);
                            this._undoStack = [];
                            this._redoStack = [];
                            app.FixModel();
                            app.FixDesign();
                            app.FixEditors();
                            return a;
                        });
                        return;
                    }
                }
                throw "Input format not supported: " + type;
            }

            public LoadFromString(data: any, type: string) {
                this.ProcessEvent("clickvoice", <any>{ 'data': <any>{ voice: null } });
                for (var i = 0; i < this.readers.length; i++) {
                    if (this.readers[i].Supports(type)) {
                        var score = this.document;
                        score.clear();

                        var a = this.readers[i].Load(data);
                        this._undoStack = [];
                        this._redoStack = [];
                        this.FixModel();
                        this.FixDesign();
                        this.FixEditors();
                        return a;
                    }
                }
                throw "Input format not supported: " + type;
            }

            public GetPlugin(id: string): IPlugIn<DocumentType, StatusManager, ContainerType> {
                for (var i = 0; i < this.plugins.length; i++) {
                    if (this.plugins[i].GetId() === id) return this.plugins[i];
                }
                return null;
            }

            private _undoStack: ICommand<DocumentType, StatusManager, ContainerType>[] = [];
            private _redoStack: ICommand<DocumentType, StatusManager, ContainerType>[] = [];

            public ExecuteCommand(command: ICommand<DocumentType, StatusManager, ContainerType>) {
                command.Execute(this);
                if (command.Undo) {
                    this._undoStack.push(command);
                }
                else {
                    this._undoStack = [];
                }
                this._redoStack = [];
                
                this.FixModel();
                this.FixDesign();
                this.FixEditors();
            }

            public canUndo(): boolean {
                return (this._undoStack.length) > 0;
            }

            public canRedo(): boolean {
                return this._redoStack.length > 0;
            }

            public Undo() {
                var cmd = this._undoStack.pop();
                cmd.Undo(this);
                this._redoStack.push(cmd);
                
                this.FixModel();
                this.FixDesign();
                this.FixEditors();
            }

            public Redo() {
                var cmd = this._redoStack.pop();
                cmd.Execute(this);
                this._undoStack.push(cmd);
                
                this.FixModel();
                this.FixDesign();
                this.FixEditors();
            }

            private FixModel() {
                for (var i = 0; i < this.validators.length; i++) {
                    var t = Date.now();
                    this.validators[i].Validate(this);
                    //console.log((Date.now()-t) + " " + i);
                }
            }

            private FixDesign() {
                for (var i = 0; i < this.designers.length; i++) {
                    var t = Date.now();
                    this.designers[i].Validate(this);
                    //console.log((Date.now() - t) + " " + i);
                }
            }

            private FixEditors() {
                for (var i = 0; i < this.editors.length; i++) {
                    var t = Date.now();
                    this.editors[i].Validate(this);
                    //console.log((Date.now() - t) + " " + i);
                }
            }

            private eventProcessors: IEventProcessor<DocumentType, StatusManager, ContainerType>[] = [];

            public RegisterEventProcessor(eventProc: IEventProcessor<DocumentType, StatusManager, ContainerType>) {
                this.eventProcessors.push(eventProc);
                eventProc.Init(this);
            }

            public UnregisterEventProcessor(eventProc: IEventProcessor<DocumentType, StatusManager, ContainerType>) {
                var i = this.eventProcessors.indexOf(eventProc);
                if (i >= 0) {
                    this.eventProcessors.splice(i, 1);
                    eventProc.Exit(this);
                }
            }

            public ProcessEvent(name: string, message: IMessage): boolean {
                for (var i = 0; i < this.eventProcessors.length; i++) {
                    var evPro: any = this.eventProcessors[i];
                    if (evPro[name]) {
                        if (!evPro[name](this, message)) return false;
                    }
                }
                return true;
            }


        }

        /** Debug event processor: writes event info in #msg */
        /*export class DummyEventProcessor implements IEventProcessor {
            public keydown(app: AbstractApplication, event: Event): boolean {
                $('#msg').text((<KeyboardEvent>event).char);
                return false;
            }

            public Init(app: ScoreApplication.ScoreApplication) {
            }
            public Exit(app: ScoreApplication.ScoreApplication) {
            }
        }*/
    }
}