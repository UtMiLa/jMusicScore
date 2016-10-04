declare module JMusicScore {
    module IO {
        class ServerFileManager<TDocumentType extends Application.IAppDoc, TStatusManager extends Application.IStatusManager, TContainerType> implements Application.IFileManager<TDocumentType, TStatusManager, TContainerType> {
            private ajaxUrl;
            private id;
            constructor(ajaxUrl: string, id: string);
            init(app: Application.AbstractApplication<TDocumentType, TStatusManager, TContainerType>): void;
            exit(app: Application.AbstractApplication<TDocumentType, TStatusManager, TContainerType>): void;
            getId(): string;
            getFileList(handler: (data: string[]) => void): void;
            loadFile(name: string, handler: (data: string, name: string) => void): void;
            saveFile(name: string, data: string, handler: (res: string) => void): void;
        }
        class LocalStorageFileManager<TDocumentType extends Application.IAppDoc, TStatusManager extends Application.IStatusManager, TContainerType> implements Application.IFileManager<TDocumentType, TStatusManager, TContainerType> {
            private id;
            constructor(id: string);
            init(app: Application.AbstractApplication<TDocumentType, TStatusManager, TContainerType>): void;
            exit(app: Application.AbstractApplication<TDocumentType, TStatusManager, TContainerType>): void;
            getId(): string;
            getFileList(handler: (data: string[]) => void): void;
            loadFile(name: string, handler: (data: string, name: string) => void): void;
            saveFile(name: string, data: string, handler: (res: string) => void): void;
        }
    }
}
