import {Application} from './application';


    export module IO {

        /** REST remote file manager */
        export class ServerFileManager<TDocumentType extends Application.IAppDoc, TStatusManager extends Application.IStatusManager> implements Application.IFileManager<TDocumentType, TStatusManager> {
            constructor(private ajaxUrl: string, private id: string) {
                // new ServerFileManager ("Handler.ashx")
            }

            init(app: Application.AbstractApplication<TDocumentType, TStatusManager>): void { }

            exit(app: Application.AbstractApplication<TDocumentType, TStatusManager>): void { }

            getId(): string { return this.id; }

            public getFileList(handler: (data: string[]) => void) {
                $.ajax(this.ajaxUrl, {
                    success: function (data: string) {
                        var files = data.split('\n');
                        handler(files);
                    },
                    cache: false
                });
            }

            public loadFile(name: string, handler: (data: string, name: string) => void) {
                $.ajax(this.ajaxUrl, {
                    success: function (data: string) {
                        handler(data, name);
                    },
                    data: { 'Name': name },
                    cache: false
                });
            }

            public saveFile(name: string, data: string, handler: (res: string) => void) {
                $.ajax(this.ajaxUrl, {
                    success: function (res: string) {
                        handler(res);
                    },
                    type: 'POST',
                    data: { 'Name': name, 'Data': data }
                });
            }
        }

        /** Local storage file manager using the browser's local storage*/
        export class LocalStorageFileManager<TDocumentType extends Application.IAppDoc, TStatusManager extends Application.IStatusManager> implements Application.IFileManager<TDocumentType, TStatusManager> {
            constructor(private id: string) {
            }

            init(app: Application.AbstractApplication<TDocumentType, TStatusManager>): void { }

            exit(app: Application.AbstractApplication<TDocumentType, TStatusManager>): void { }

            getId(): string { return this.id; }

            public getFileList(handler: (data: string[]) => void) {
                var a: string = 'file:' + this.id + ':';
                var res: string[] = [];
                for (var key in localStorage) {
                    if (key.substr(0, a.length) === a) {
                        res.push(key.substr(a.length));
                    }
                }
                handler(res);
            }

            public loadFile(name: string, handler: (data: string, name: string) => void) {
                handler(localStorage['file:' + this.id + ':' + name], name);
            }

            public saveFile(name: string, data: string, handler: (res: string) => void) {
                localStorage['file:' + this.id + ':' + name] = data;
            }
        }
    }
