module JMusicScore {

    export module Application {

        /** REST remote file manager */
        export class ServerFileManager<DocumentType extends Application.IAppDoc, StatusManager extends Application.IStatusManager, ContainerType> implements IFileManager<DocumentType, StatusManager, ContainerType> {
            constructor(private ajaxUrl: string, private id: string) {
                // new ServerFileManager ("Handler.ashx")
            }

            Init(app: Application<DocumentType, StatusManager, ContainerType>): void { }

            Exit(app: Application<DocumentType, StatusManager, ContainerType>): void { }

            GetId(): string { return this.id; }

            public getFileList(handler: (data: string[]) => void) {
                $.ajax(this.ajaxUrl, {
                    success: function (data) {
                        var files = data.split('\n');
                        handler(files);
                    },
                    cache: false
                });
            }

            public loadFile(name: string, handler: (data: string, name: string) => void) {
                $.ajax(this.ajaxUrl, {
                    success: function (data) {
                        handler(data, name);
                    },
                    data: { 'Name': name },
                    cache: false
                });
            }

            public saveFile(name: string, data: string, handler: (res: string) => void) {
                $.ajax(this.ajaxUrl, {
                    success: function (res) {
                        handler(res);
                    },
                    type: 'POST',
                    data: { 'Name': name, 'Data': data }
                });
            }
        }

        /** Local storage file manager using the browser's local storage*/
        export class LocalStorageFileManager<DocumentType extends Application.IAppDoc, StatusManager extends Application.IStatusManager, ContainerType> implements IFileManager<DocumentType, StatusManager, ContainerType> {
            constructor(private id: string) {
            }

            Init(app: Application<DocumentType, StatusManager, ContainerType>): void { }

            Exit(app: Application<DocumentType, StatusManager, ContainerType>): void { }

            GetId(): string { return this.id; }

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
}