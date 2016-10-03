declare module JMusicScore {
    module Application {
        interface IPlugIn<TDocumentType extends IAppDoc, TStatusManager extends IStatusManager, TContainerType> {
            init(app: Application.AbstractApplication<TDocumentType, TStatusManager, TContainerType>): void;
            getId(): string;
        }
        interface IReaderPlugIn<TDocumentType extends IAppDoc, TStatusManager extends IStatusManager, TContainerType> extends IPlugIn<TDocumentType, TStatusManager, TContainerType> {
            supports(type: string): boolean;
            getExtension(type: string): string;
            load(data: any): void;
            getId(): string;
            getFormats(): string[];
        }
        interface IWriterPlugIn<TDocumentType extends IAppDoc, TStatusManager extends IStatusManager, TContainerType> extends IPlugIn<TDocumentType, TStatusManager, TContainerType> {
            supports(type: string): boolean;
            getExtension(type: string): string;
            save(): string;
            getId(): string;
            getFormats(): string[];
        }
        interface ICommand<TDocumentType extends IAppDoc, TStatusManager extends IStatusManager, TContainerType> {
            execute(app: Application.AbstractApplication<TDocumentType, TStatusManager, TContainerType>): void;
            undo?(app: Application.AbstractApplication<TDocumentType, TStatusManager, TContainerType>): void;
            [param: string]: any;
        }
        interface IValidator<TDocumentType extends IAppDoc, TStatusManager extends IStatusManager, TContainerType> {
            validate(app: Application.AbstractApplication<TDocumentType, TStatusManager, TContainerType>): void;
        }
        interface IDesigner<TDocumentType extends IAppDoc, TStatusManager extends IStatusManager, TContainerType> {
            validate(app: Application.AbstractApplication<TDocumentType, TStatusManager, TContainerType>): void;
        }
        interface IEventProcessor<TDocumentType extends IAppDoc, TStatusManager extends IStatusManager, TContainerType> {
            init(app: Application.AbstractApplication<TDocumentType, TStatusManager, TContainerType>): void;
            exit(app: Application.AbstractApplication<TDocumentType, TStatusManager, TContainerType>): void;
            midinoteoff?(app: AbstractApplication<TDocumentType, TStatusManager, TContainerType>, event: IMessage): boolean;
            keypressed?(app: AbstractApplication<TDocumentType, TStatusManager, TContainerType>, event: IMessage): boolean;
            keyup?(app: AbstractApplication<TDocumentType, TStatusManager, TContainerType>, event: IMessage): boolean;
            keydown?(app: AbstractApplication<TDocumentType, TStatusManager, TContainerType>, event: IMessage): boolean;
        }
        interface IFileManager<TDocumentType extends IAppDoc, TStatusManager extends IStatusManager, TContainerType> {
            init(app: AbstractApplication<TDocumentType, TStatusManager, TContainerType>): void;
            exit(app: AbstractApplication<TDocumentType, TStatusManager, TContainerType>): void;
            getFileList(handler: (data: string[]) => void): void;
            loadFile(name: string, handler: (data: string, name: string) => void): void;
            saveFile(name: string, data: string, handler: (res: string) => void): void;
            getId(): string;
        }
        interface IDesktopArea {
        }
        interface IDesktopManager {
            addArea(area: IDesktopArea, placement: string): void;
            removeArea(area: IDesktopArea): void;
        }
        interface IFeedbackClient {
            changed(status: IStatusManager, key: string, val: any): void;
        }
        interface IFeedbackManager {
            changed(status: IStatusManager, key: string, val: any): void;
            registerClient(client: IFeedbackClient): void;
            removeClient(client: IFeedbackClient): void;
        }
        interface IStatusManager {
            setFeedbackManager(f: IFeedbackManager): void;
        }
        interface IMessage {
            key?: string;
            [others: string]: any;
        }
        interface IEventReceiver {
            processEvent(name: string, message: IMessage): boolean;
        }
        interface IAppDoc {
            clear(): void;
        }
        class AbstractApplication<TDocumentType extends IAppDoc, TStatusManager extends IStatusManager, TContainerType> {
            container: TContainerType;
            constructor(container: TContainerType, score: TDocumentType, status: TStatusManager);
            document: TDocumentType;
            private plugins;
            private readers;
            private writers;
            private fileManagers;
            private validators;
            private designers;
            private editors;
            private feedbackManager;
            private status;
            Status: TStatusManager;
            FeedbackManager: IFeedbackManager;
            addPlugin(plugin: IPlugIn<TDocumentType, TStatusManager, TContainerType>): void;
            addReader(reader: IReaderPlugIn<TDocumentType, TStatusManager, TContainerType>): void;
            addWriter(writer: IWriterPlugIn<TDocumentType, TStatusManager, TContainerType>): void;
            addFileManager(fileManager: IFileManager<TDocumentType, TStatusManager, TContainerType>): void;
            addValidator(validator: IValidator<TDocumentType, TStatusManager, TContainerType>): void;
            addDesigner(designer: IDesigner<TDocumentType, TStatusManager, TContainerType>): void;
            getFileOpenTypes(): string[];
            getFileSaveTypes(): string[];
            getFileManagerIds(): string[];
            getFileList(fileManager: string, handler: (data: string[]) => void): void;
            setExtension(name: string, type: string): string;
            saveUsing(name: string, fileManager: string, type: string): void;
            save(name: string, fileManager: IFileManager<TDocumentType, TStatusManager, TContainerType>, type: string): void;
            saveToString(type: string): string;
            loadUsing(name: string, fileManager: string, type: string): void;
            load(name: string, fileManager: IFileManager<TDocumentType, TStatusManager, TContainerType>, type: string): void;
            loadFromString(data: any, type: string): void;
            getPlugin(id: string): IPlugIn<TDocumentType, TStatusManager, TContainerType>;
            private undoStack;
            private redoStack;
            executeCommand(command: ICommand<TDocumentType, TStatusManager, TContainerType>): void;
            canUndo(): boolean;
            canRedo(): boolean;
            undo(): void;
            redo(): void;
            private fixModel();
            private fixDesign();
            private fixEditors();
            private eventProcessors;
            registerEventProcessor(eventProc: IEventProcessor<TDocumentType, TStatusManager, TContainerType>): void;
            unregisterEventProcessor(eventProc: IEventProcessor<TDocumentType, TStatusManager, TContainerType>): void;
            processEvent(name: string, message: IMessage): boolean;
        }
    }
}
