/// <reference path="../node_modules/@types/node/index.d.ts" />

import {Application} from '../../japps/application';

import fs = require("fs");


export module NodeFs {

    /** Local file system file manager */
    export class FsFileManager<TDocumentType extends Application.IAppDoc, TStatusManager extends Application.IStatusManager> implements Application.IFileManager<TDocumentType, TStatusManager> {
        constructor(private id: string) {
        }

        init(app: Application.AbstractApplication<TDocumentType, TStatusManager>): void { }

        exit(app: Application.AbstractApplication<TDocumentType, TStatusManager>): void { }

        getId(): string { return this.id; }

        public getFileList(handler: (data: string[]) => void) {
            fs.readdir("C:\\udv", {}, (err, files: string[]) => {
                handler(files);
            });
        }

        public loadFile(name: string, handler: (data: string, name: string) => void) {
            fs.readFile("C:\\udv\\" + name, (err, data: Buffer) => {
                handler(data.toString(), name);
            });
        }

        public saveFile(name: string, data: string, handler: (res: string) => void) {
            fs.writeFile("C:\\udv\\" + name, data, (err) => {
                if (err) throw err;
                handler("saved");
                console.log('The file has been saved!');
                });
        }
    }
}
