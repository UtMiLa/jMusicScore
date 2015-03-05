module jMusicScore {

    export module Application {

        /** Every external plugin to application must implement this interface */
        export interface IPlugIn<DocumentType extends IAppDoc, ContainerType> {
            Init(app: Application<DocumentType, ContainerType>): void;
            GetId(): string;
        }

        /** Interface for file readers (in varying formats) */
        export interface IReaderPlugIn<DocumentType extends IAppDoc, ContainerType> extends IPlugIn<DocumentType, ContainerType> {
            //Init(app: Application): void;
            Supports(type: string): boolean;
            GetExtension(type: string): string;
            Load(data: any): void;
            GetId(): string;
            GetFormats(): string[];
        }

        /** Interface for file writers */
        export interface IWriterPlugIn<DocumentType extends IAppDoc, ContainerType> extends IPlugIn<DocumentType, ContainerType> {
            //Init(app: Application): void;
            Supports(type: string): boolean;
            GetExtension(type: string): string;
            Save(): string;
            GetId(): string;
            GetFormats(): string[];
        }

        /** Interface for commands. Every user action that changes data in the model must use Command objects. */
        export interface ICommand<DocumentType extends IAppDoc, ContainerType> {
            Execute(app: Application<DocumentType, ContainerType>): void;
        }

        /** Interface for objects that check and refines the model after every change (like beam calculation) */
        export interface IValidator<DocumentType extends IAppDoc, ContainerType> {
            Validate(app: Application<DocumentType, ContainerType>): void;
        }

        /** Interface for objects that check and refines the user interface after every model change (like spacing and drawing) */
        export interface IDesigner<DocumentType extends IAppDoc, ContainerType> {
            Validate(app: Application<DocumentType, ContainerType>): void;
        }

        /** Interface for pluggable event processors that can handle events */
        export interface IEventProcessor<DocumentType extends IAppDoc, ContainerType> {
            Init(app: Application<DocumentType, ContainerType>): void;
            Exit(app: Application<DocumentType, ContainerType>): void;

            /*midinoteoff? (app: Application, event: Event): boolean;
            keypressed? (app: Application, event: Event): boolean;
            keyup? (app: Application, event: Event): boolean;
            keydown? (app: Application, event: Event): boolean;*/
        }

        /** Interface for file managers that can load and save files in various file systems (remote or local) */
        export interface IFileManager<DocumentType extends IAppDoc, ContainerType> {
            Init(app: Application<DocumentType, ContainerType>): void;
            Exit(app: Application<DocumentType, ContainerType>): void;

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

        /** Feedback manager - receives status changes from Status manager and dispatches them to clients. An Application has one Feedback manager. Should possibly be merged with StatusManager. */
        export interface IFeedbackManager {
            changed(status: IStatusManager, key: string, val: any): void;
            registerClient(client: IFeedbackClient): void;
            removeClient(client: IFeedbackClient): void;
        }

        /** Status manager registers input status (pressed keys, selected buttons etc) and informs Feedback manager about changes. An Application has one Status manager. */
        export interface IStatusManager {
            currentNote: Model.INote;
            currentNotehead: Model.INotehead;
            currentVoice: Model.IVoice;
            currentStaff: Model.IStaff;
            currentPitch: Model.Pitch;
            currentTuplet: Model.TupletDef;
            insertPoint: Model.HorizPosition;
            mouseOverElement: Model.IMusicElement;
            rest: boolean;
            dots: number;
            grace: boolean;
            pressNoteKey(pitch: Model.Pitch): void;
            releaseNoteKey(pitch: Model.Pitch): void;
            notesPressed: Model.Pitch[];
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

        class StatusManager implements IStatusManager {
            constructor(private feedbackManager: IFeedbackManager) { }

            private _currentPitch: Model.Pitch;
            private _currentNote: Model.INote;
            private _currentNotehead: Model.INotehead;
            private _currentVoice: Model.IVoice;
            private _currentStaff: Model.IStaff;
            private _insertPoint: Model.HorizPosition;
            private _selectionStart: Model.AbsoluteTime; // todo: property
            private _selectionEnd: Model.AbsoluteTime; // todo: property
            private _selectionStartStaff: Model.IStaff; // todo: property
            private _selectionEndStaff: Model.IStaff; // todo: property
            private _rest: boolean = false;
            private _dots: number = 0;
            private _grace: boolean = false;
            private _currentTuplet: Model.TupletDef;
            private _mouseOverElement: Model.IMusicElement;

            private changed(key: string, val: any) {
                if (this.feedbackManager) {
                    this.feedbackManager.changed(this, key, val);
                }
            }

            public get currentPitch(): Model.Pitch { return this._currentPitch; }
            public set currentPitch(v: Model.Pitch) {
                if (this._currentPitch !== v) {
                    this._currentPitch = v;
                    this.changed("currentPitch", v);
                    if (v && this.currentNote && this.currentNote.matchesPitch(v, true)) {
                        this.currentNote.withHeads((head: Model.INotehead) => {
                            if (head.pitch.pitch === v.pitch) {
                                this.currentNotehead = head;
                                return;
                            }
                        });                        
                    }
                    else this.currentNotehead = undefined;
                }
            }
            public get currentNote(): Model.INote { return this._currentNote; }
            public set currentNote(v: Model.INote) {
                if (this._currentNote !== v) {
                    this._currentNote = v;
                    if (v) {
                        this.currentVoice = v.parent;
                    }
                    this.changed("currentNote", v);
                    if (v && this.currentPitch && v.matchesPitch(this.currentPitch, true)) {
                        v.withHeads((head: Model.INotehead) => {
                            if (head.pitch.pitch === this.currentPitch.pitch) {
                                this.currentNotehead = head;
                                return;
                            }
                        });
                    }
                    else this.currentNotehead = undefined;
                }
            }
            public get currentNotehead(): Model.INotehead { return this._currentNotehead; }
            public set currentNotehead(v: Model.INotehead) {
                if (this._currentNotehead !== v) {
                    this._currentNotehead = v;
                    this.changed("currentNotehead", v);
                }
            }
            public get currentVoice(): Model.IVoice { return this._currentVoice; }
            public set currentVoice(v: Model.IVoice) {
                if (this._currentVoice !== v) {
                    this._currentVoice = v;
                    this.changed("currentVoice", v);
                }
            }
            public get currentStaff(): Model.IStaff { return this._currentStaff; }
            public set currentStaff(v: Model.IStaff) {
                if (this._currentStaff !== v) {
                    this._currentStaff = v;
                    this.changed("currentStaff", v);
                }
            }
            public get currentTuplet(): Model.TupletDef { return this._currentTuplet; }
            public set currentTuplet(v: Model.TupletDef) { 
                if (!this._currentTuplet || !v || !this._currentTuplet.Eq(v)) {
                    this._currentTuplet = v;
                    this.changed("currentTuplet", v);
                }
            }
            public get insertPoint(): Model.HorizPosition { return this._insertPoint; }
            public set insertPoint(v: Model.HorizPosition) {
                if (this._insertPoint !== v) {
                    this._insertPoint = v;
                    this.changed("insertPoint", v);
                }
            }

            public get mouseOverElement(): Model.IMusicElement {
                return this._mouseOverElement;
            }
            public set mouseOverElement(v: Model.IMusicElement) {
                if (this._mouseOverElement !== v) {
                    if (this._mouseOverElement) this.changed("mouseOutElement", this._mouseOverElement);
                    this._mouseOverElement = v;
                    if (v) this.changed("mouseOverElement", v);
                }
            }

            public get rest(): boolean { return this._rest; }
            public set rest(v: boolean) {
                if (this._rest!== v) {
                    this._rest = v;
                    this.changed("rest", v);
                }
            }
            public get dots(): number { return this._dots; }
            public set dots(v: number) {
                if (this._dots !== v) {
                    this._dots = v;
                    this.changed("dots", v);
                }
            }
            public get grace(): boolean { return this._grace; }
            public set grace(v: boolean) {
                if (this._grace !== v) {
                    this._grace = v;
                    this.changed("grace", v);
                }
            }
            private _notesPressed: Model.Pitch[] = [];
            private _noteValSelected: Model.TimeSpan;

            public get notesPressed(): Model.Pitch[] { return this._notesPressed; }
            public pressNoteKey(pitch: Model.Pitch) {
                this._notesPressed.push(pitch);
                this.changed("pressKey", pitch);
            }
            public releaseNoteKey(pitch: Model.Pitch) {
                for (var i = 0; i < this._notesPressed.length; i++) {
                    if (this._notesPressed[i].equals(pitch)) {
                        this._notesPressed.splice(i, 1);
                        this.changed("releaseKey", pitch);
                    }
                }
            }
        }

        export interface IAppDoc {
            clear(): void;
        }

        // todo: score -> document
        // todo: map -> ?
        // todo: Status -> abstract
        /** Application object manages all data and I/O in the application. Multiple applications per page should be possible, although not probable. */
        export class Application<DocumentType extends IAppDoc, ContainerType> {
            constructor(public container: ContainerType, score: DocumentType) {
                this.score = score;
                //this.map = new Model.MeasureMap(this.score);
            }

            public score: DocumentType;
            //public map: Model.MeasureMap;
            private plugins: IPlugIn<DocumentType, ContainerType>[] = [];
            private readers: IReaderPlugIn<DocumentType, ContainerType>[] = [];
            private writers: IWriterPlugIn<DocumentType, ContainerType>[] = [];
            private fileManagers: IFileManager<DocumentType, ContainerType>[] = [];
            private validators: IValidator<DocumentType, ContainerType>[] = [];
            private designers: IDesigner<DocumentType, ContainerType>[] = [];
            private editors: IDesigner<DocumentType, ContainerType>[] = [];
            private feedbackManager: IFeedbackManager = new FeedbackManager();
            private status: IStatusManager = new StatusManager(this.feedbackManager);

            public get Status(): IStatusManager {
                return this.status;
            }
            public get FeedbackManager(): IFeedbackManager { return this.feedbackManager; }

            public AddPlugin(plugin: IPlugIn<DocumentType, ContainerType>) {
                this.plugins.push(plugin);
                plugin.Init(this);
            }

            public AddReader(reader: IReaderPlugIn<DocumentType, ContainerType>) {
                this.readers.push(reader);
                reader.Init(this);
            }

            public AddWriter(writer: IWriterPlugIn<DocumentType, ContainerType>) {
                this.writers.push(writer);
                writer.Init(this);
            }

            public AddFileManager(fileManager: IFileManager<DocumentType, ContainerType>) {
                this.fileManagers.push(fileManager);
                fileManager.Init(this);
            }

            public AddValidator(validator: IValidator<DocumentType, ContainerType>) {
                this.validators.push(validator);
                validator.Validate(this);
            }

            public AddDesigner(designer: IDesigner<DocumentType, ContainerType>) {
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

            public Save(name: string, fileManager: IFileManager<DocumentType, ContainerType>, type: string) {
                /*for (var i = 0; i < this.writers.length; i++) {
                    if (this.writers[i].Supports(type)) {
                        var writer = this.writers[i];
                        var extension = writer.GetExtension(type);
                        if (name.substr(name.length - extension.length - 1) != '.' + extension) {
                            name += '.' + extension;
                        }
                        fileManager.saveFile(name, writer.Save(), function (res: string) { });
                    }
                }
                throw "Output format not supported: " + type;*/
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

            public Load(name: string, fileManager: IFileManager<DocumentType, ContainerType>, type: string) {
                var app = this;
                this.ProcessEvent("clickvoice", <any>{ 'data': { voice: null } });
                for (var i = 0; i < this.readers.length; i++) {
                    if (this.readers[i].Supports(type) || (type === '*' && name.match(this.readers[i].GetExtension(type) + "$"))) {
                        var reader = this.readers[i];
                        var data = fileManager.loadFile(name, function (data: string, name: string) {
                            var score = app.score;
                            score.clear();

                            var a = reader.Load(data);
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
                this.ProcessEvent("clickvoice", <any>{ 'data': { voice: null } });
                for (var i = 0; i < this.readers.length; i++) {
                    if (this.readers[i].Supports(type)) {
                        var score = this.score;
                        score.clear();

                        var a = this.readers[i].Load(data);
                        this.FixModel();
                        this.FixDesign();
                        this.FixEditors();
                        return a;
                    }
                }
                throw "Input format not supported: " + type;
            }

            public GetPlugin(id: string): IPlugIn<DocumentType, ContainerType> {
                for (var i = 0; i < this.plugins.length; i++) {
                    if (this.plugins[i].GetId() === id) return this.plugins[i];
                }
                return null;
            }

            public ExecuteCommand(command: ICommand<DocumentType, ContainerType>) {
                command.Execute(this);
                //this.ExecuteEventQueue();
                this.FixModel();
                this.FixDesign();
                this.FixEditors();
            }

            private FixModel() {
                for (var i = 0; i < this.validators.length; i++) {
                    var t = Date.now();
                    this.validators[i].Validate(this);
                    console.log((Date.now()-t) + " " + i);
                }
            }

            private FixDesign() {
                for (var i = 0; i < this.designers.length; i++) {
                    var t = Date.now();
                    this.designers[i].Validate(this);
                    console.log((Date.now() - t) + " " + i);
                }
            }

            private FixEditors() {
                for (var i = 0; i < this.editors.length; i++) {
                    var t = Date.now();
                    this.editors[i].Validate(this);
                    console.log((Date.now() - t) + " " + i);
                }
            }

            private eventProcessors: IEventProcessor<DocumentType, ContainerType>[] = [];

            public RegisterEventProcessor(eventProc: IEventProcessor<DocumentType, ContainerType>) {
                this.eventProcessors.push(eventProc);
                eventProc.Init(this);
            }

            public UnregisterEventProcessor(eventProc: IEventProcessor<DocumentType, ContainerType>) {
                var i = this.eventProcessors.indexOf(eventProc);
                if (i >= 0) {
                    this.eventProcessors.splice(i, 1);
                    eventProc.Exit(this);
                }
            }

            public ProcessEvent(name: string, event: Event): boolean {
                for (var i = 0; i < this.eventProcessors.length; i++) {
                    var evPro: any = this.eventProcessors[i];
                    if (evPro[name]) {
                        if (!evPro[name](this, event)) return false;
                    }
                }
                return true;
            }


        }

        /** Debug event processor: writes event info in #msg */
        /*export class DummyEventProcessor implements IEventProcessor {
            public keydown(app: Application, event: Event): boolean {
                $('#msg').text((<KeyboardEvent>event).char);
                return false;
            }

            public Init(app: ScoreApplication.ScoreApplication) {
            }
            public Exit(app: ScoreApplication.ScoreApplication) {
            }
        }*/
    }
    export module ScoreApplication {
        export type ScoreApplication = Application.Application<Model.IScore, JQuery>;
        export type ScorePlugin = Application.IPlugIn<Model.IScore, JQuery>;
        export type ScoreEventProcessor = Application.IEventProcessor<Model.IScore, JQuery>;
        export type ScoreDesigner = Application.IDesigner<Model.IScore, JQuery>;
    }
}