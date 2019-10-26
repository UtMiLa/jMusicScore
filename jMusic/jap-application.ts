
        /** Every external plugin to application must implement this interface */
        export interface IPlugIn<TDocumentType extends IAppDoc, TStatusManager extends IStatusManager> {
            init(app: AbstractApplication<TDocumentType, TStatusManager>): void;
            getId(): string;
        }

        /*export interface IPlugInClass<TDocumentType extends IAppDoc, TStatusManager extends IStatusManager> {
            new (): IPlugIn<TDocumentType, TStatusManager>;
        }*/

        export interface IBuilder<Type> {
            (): Type;
        }

        /** Interface for file readers (in varying formats) */
        export interface IReaderPlugIn<TDocumentType extends IAppDoc, TStatusManager extends IStatusManager> extends IPlugIn<TDocumentType, TStatusManager> {
            //Init(app: Application): void;
            supports(type: string): boolean;
            getExtension(type: string): string;
            load(data: any): void;
            getId(): string;
            getFormats(): string[];
        }

        /** Interface for file writers */
        export interface IWriterPlugIn<TDocumentType extends IAppDoc, TStatusManager extends IStatusManager> extends IPlugIn<TDocumentType, TStatusManager> {
            //Init(app: Application): void;
            supports(type: string): boolean;
            getExtension(type: string): string;
            save(): string;
            getId(): string;
            getFormats(): string[];
        }

        /** Interface for commands. Every user action that changes data in the model must use Command objects. */
        export interface ICommand<TDocumentType extends IAppDoc, TStatusManager extends IStatusManager> {
            execute(app: AbstractApplication<TDocumentType, TStatusManager>): void;
            undo?(app: AbstractApplication<TDocumentType, TStatusManager>): void;
            [param: string]: any;
        }

        /** Interface for objects that check and refines the model after every change (like beam calculation) */
        export interface IValidator<TDocumentType extends IAppDoc, TStatusManager extends IStatusManager> {
            validate(app: AbstractApplication<TDocumentType, TStatusManager>): void;
        }

        /*export interface IValidatorClass<TDocumentType extends IAppDoc, TStatusManager extends IStatusManager> {
            new (): IValidator<TDocumentType, TStatusManager>;
        }*/

        /** Interface for objects that check and refines the user interface after every model change (like spacing and drawing) */
        export interface IDesigner<TDocumentType extends IAppDoc, TStatusManager extends IStatusManager> {
            validate(app: AbstractApplication<TDocumentType, TStatusManager>): void;
        }

        /** Interface for pluggable event processors that can handle events */
        export interface IEventProcessor<TDocumentType extends IAppDoc, TStatusManager extends IStatusManager> {
            init(app: AbstractApplication<TDocumentType, TStatusManager>): void;
            exit(app: AbstractApplication<TDocumentType, TStatusManager>): void;

            midinoteoff? (app: AbstractApplication<TDocumentType, TStatusManager>, event: IMessage): boolean;
            keypressed? (app: AbstractApplication<TDocumentType, TStatusManager>, event: IMessage): boolean;
            keyup? (app: AbstractApplication<TDocumentType, TStatusManager>, event: IMessage): boolean;
            keydown? (app: AbstractApplication<TDocumentType, TStatusManager>, event: IMessage): boolean;
        }

        /** Interface for file managers that can load and save files in various file systems (remote or local) */
        export interface IFileManager<TDocumentType extends IAppDoc, TStatusManager extends IStatusManager> {
            init(app: AbstractApplication<TDocumentType, TStatusManager>): void;
            exit(app: AbstractApplication<TDocumentType, TStatusManager>): void;

            getFileList(handler: (data: string[]) => void): void;
            loadFile(name: string, handler: (data: string, name: string) => void): void;
            saveFile(name: string, data: string, handler: (res: string) => void): void;
            getId(): string;
        }

        /*export interface IFileManagerClass<TDocumentType extends IAppDoc, TStatusManager extends IStatusManager> {
            new (): IFileManager<TDocumentType, TStatusManager>;
        }*/

        export interface IDesktopArea { }

        /** Manages the various components (toolbars, client areas etc) on the desktop */
        export interface IDesktopManager {
            addArea(area: IDesktopArea, placement: string): void;
            removeArea(area: IDesktopArea): void;
        }

        class HtmlDesktopManager implements IDesktopManager { // todo: move away from this module
            constructor(private rootElement: Element) { }
            private areas: IDesktopArea[] = [];
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
            private clients: IFeedbackClient[] = [];
            public changed(status: IStatusManager, key: string, val: any) {
                for (var i = 0; i < this.clients.length; i++) {
                    this.clients[i].changed(status, key, val);
                }
            }
            public registerClient(client: IFeedbackClient) {
                this.clients.push(client);
            }
            public removeClient(client: IFeedbackClient) {
                var n = this.clients.indexOf(client);
                if (n >= 0) {
                    this.clients.splice(n, 1);
                }
            }
        }

        export interface IMessage {
            key?: string;
            [others: string]: any;
        }

        export interface IEventReceiver {
            processEvent(name: string, message: IMessage): boolean;
        }

        export interface IAppDoc {
            clear(): void;
        }

        /** Application object manages all data and I/O in the application. Multiple applications per page should be possible, although not probable. */
        export class AbstractApplication<TDocumentType extends IAppDoc, TStatusManager extends IStatusManager> {
            constructor(score: TDocumentType, status: TStatusManager) {
                this.document = score;
                this.status = status;
                this.status.setFeedbackManager(this.feedbackManager);
            }

            public document: TDocumentType;
            private plugins: IPlugIn<TDocumentType, TStatusManager>[] = [];
            /*private readers: IReaderPlugIn<TDocumentType, TStatusManager>[] = [];
            private writers: IWriterPlugIn<TDocumentType, TStatusManager>[] = [];*/
            private fileManagers: IFileManager<TDocumentType, TStatusManager>[] = [];
            private validators: IValidator<TDocumentType, TStatusManager>[] = [];
            private designers: IDesigner<TDocumentType, TStatusManager>[] = [];
            private editors: IDesigner<TDocumentType, TStatusManager>[] = [];
            private feedbackManager: IFeedbackManager = new FeedbackManager();
            private status: TStatusManager;

            public get Status(): TStatusManager {
                return this.status;
            }
            public get FeedbackManager(): IFeedbackManager { return this.feedbackManager; }

            public addPlugin(plugin: IPlugIn<TDocumentType, TStatusManager>) {
                this.plugins.push(plugin);
                plugin.init(this);
            }

            /*public addReader(reader: IReaderPlugIn<TDocumentType, TStatusManager>) {
                this.readers.push(reader);
                reader.init(this);
            }

            public addWriter(writer: IWriterPlugIn<TDocumentType, TStatusManager>) {
                this.writers.push(writer);
                writer.init(this);
            }*/

            public addFileManager(fileManager: IFileManager<TDocumentType, TStatusManager>) {
                this.fileManagers.push(fileManager);
                fileManager.init(this);
            }

            public addValidator(validator: IValidator<TDocumentType, TStatusManager>) {
                this.validators.push(validator);
                validator.validate(this);
            }

            public addDesigner(designer: IDesigner<TDocumentType, TStatusManager>) {
                this.designers.push(designer);
                designer.validate(this);
            }

            /*public getFileOpenTypes(): string[] {
                var res: string[] = [];
                for (var i = 0; i < this.readers.length; i++) {
                    res.concat(this.readers[i].getFormats());
                }
                return res;
            }

            public getFileSaveTypes(): string[]{
                var res: string[] = [];
                for (var i = 0; i < this.writers.length; i++) {
                    res = res.concat(this.writers[i].getFormats());
                }
                return res;
            }*/

            public getFileManagerIds(): string[] {
                var res: string[] = [];
                for (var i = 0; i < this.fileManagers.length; i++) {
                    res.push(this.fileManagers[i].getId());
                }
                return res;
            }

            public getFileList(fileManager:string, handler: (data: string[]) => void) {
                for (var i = 0; i < this.fileManagers.length; i++) {
                    if (this.fileManagers[i].getId() === fileManager) {
                        this.fileManagers[i].getFileList(handler);
                    }
                }
            }

            /*public setExtension(name: string, type: string) {
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
            }

            public saveUsing(name: string, fileManager: string, type: string) {
                for (var i = 0; i < this.fileManagers.length; i++) {
                    if (this.fileManagers[i].getId() === fileManager) {
                        this.save(name, this.fileManagers[i], type);
                        return;
                    }
                }
                throw "File manager not found: " + fileManager;
            }

            public save(name: string, fileManager: IFileManager<TDocumentType, TStatusManager>, type: string) {
                fileManager.saveFile(name, this.saveToString(type), function (res: string) { });
            }

            public saveToString(type: string): string {
                for (var i = 0; i < this.writers.length; i++) {
                    if (this.writers[i].supports(type)) {
                        var writer = this.writers[i];
                        return writer.save();
                    }
                }
                throw "Output format not supported: " + type;
            }

            public loadUsing(name: string, fileManager: string, type: string) {
                for (
                    var i = 0; i < this.fileManagers.length; i++) {
                    if (this.fileManagers[i].getId() === fileManager) {
                        this.load(name, this.fileManagers[i], type);
                        return;
                    }
                }
                throw "File manager not found: " + fileManager;
            }

            public load(name: string, fileManager: IFileManager<TDocumentType, TStatusManager>, type: string) {
                var app = this;
                this.processEvent("clickvoice", <any>{ 'data': <any>{ voice: null } });
                var me = this;
                for (var i = 0; i < this.readers.length; i++) {
                    if (this.readers[i].supports(type) || (type === '*' && name.match(this.readers[i].getExtension(type) + "$"))) {
                        var reader = this.readers[i];
                        var data = fileManager.loadFile(name, function (data: string, name: string) {
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
            }

            public loadFromString(data: any, type: string) {
                this.processEvent("clickvoice", <any>{ 'data': <any>{ voice: null } });
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
            }*/

            public getPlugin(id: string): IPlugIn<TDocumentType, TStatusManager> {
                for (var i = 0; i < this.plugins.length; i++) {
                    if (this.plugins[i].getId() === id) return this.plugins[i];
                }
                return null;
            }

            private undoStack: ICommand<TDocumentType, TStatusManager>[] = [];
            private redoStack: ICommand<TDocumentType, TStatusManager>[] = [];

            public executeCommand(command: ICommand<TDocumentType, TStatusManager>) {
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
            }

            public canUndo(): boolean {
                return (this.undoStack.length) > 0;
            }

            public canRedo(): boolean {
                return this.redoStack.length > 0;
            }

            public undo() {
                var cmd = this.undoStack.pop();
                cmd.undo(this);
                this.redoStack.push(cmd);
                
                this.fixModel();
                this.fixDesign();
                this.fixEditors();
            }

            public redo() {
                var cmd = this.redoStack.pop();
                cmd.execute(this);
                this.undoStack.push(cmd);
                
                this.fixModel();
                this.fixDesign();
                this.fixEditors();
            }

            private fixModel() {
                for (var i = 0; i < this.validators.length; i++) {
                    var t = Date.now();
                    this.validators[i].validate(this);
                    //console.log((Date.now()-t) + " " + i);
                }
            }

            private fixDesign() {
                for (var i = 0; i < this.designers.length; i++) {
                    var t = Date.now();
                    this.designers[i].validate(this);
                    //console.log((Date.now() - t) + " " + i);
                }
            }

            private fixEditors() {
                for (var i = 0; i < this.editors.length; i++) {
                    var t = Date.now();
                    this.editors[i].validate(this);
                    //console.log((Date.now() - t) + " " + i);
                }
            }

            private eventProcessors: IEventProcessor<TDocumentType, TStatusManager>[] = [];

            public registerEventProcessor(eventProc: IEventProcessor<TDocumentType, TStatusManager>) {
                this.eventProcessors.push(eventProc);
                eventProc.init(this);
            }

            public unregisterEventProcessor(eventProc: IEventProcessor<TDocumentType, TStatusManager>) {
                var i = this.eventProcessors.indexOf(eventProc);
                if (i >= 0) {
                    this.eventProcessors.splice(i, 1);
                    eventProc.exit(this);
                }
            }

            public processEvent(name: string, message: IMessage): boolean {
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
