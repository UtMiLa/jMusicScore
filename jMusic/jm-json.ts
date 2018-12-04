
import {IKeyDefCreator, IKeyDefinition, IMemento, IMeterDefCreator, IMeterDefinition, IVisitorIterator,
    AbsoluteTime, ClefDefinition, ClefType, HorizPosition, KeyDefinitionFactory, LongDecorationType, 
    MeterDefinitionFactory, NoteDecorationKind, NoteType, OffsetMeterDefinition, Pitch, PitchClass, 
    Rational, RegularKeyDefinition, RegularMeterDefinition, StaffContext, StemDirectionType, TimeSpan, TupletDef} from './jm-base'
import { IVoice, IScore, IStaff, IKey, IClef, IVoiceNote, INote, INotehead } from './model/jm-model-interfaces';
import { Music, MusicElementFactory } from "./model/jm-model";    
import { NoteDecorationElement, TextSyllableElement, NoteLongDecorationElement } from "./model/jm-model-notes";   
import { IFileConverter } from './jm-interfaces';
import { IWriterPlugIn, IReaderPlugIn } from './jap-application';
import {  IScoreApplication, ScoreStatusManager, IScorePlugin } from './jm-application';



    export class JsonHelper {
        read(data: any): IScore{
            if (typeof (data) === "string") {
                data = JSON.parse(data);
            }
            /*var score = new ScoreElement(null);
            while (score.staffElements.length)
                score.removeChild(score.staffElements[0], score.staffElements);*/
            
            return <IScore>MusicElementFactory.recreateElement(null, data); // memento format

        }

        write(score: IScore): string{
            var seen: any[] = [];
            var text = JSON.stringify(score.getMemento());
            return text;
        }
    }

    /*class JsonReader implements IReaderPlugIn<ScoreElement, ScoreStatusManager> {
        init(app: IScoreApplication) {
            this.app = app;
        }

        private app: IScoreApplication;

        getFormats(): string[] {
            return [
                "JSON"
            ]
        }

        getId(): string {
            return "JSONReader";
        }

        public supports(type: string): boolean {
            return type === "JSON";
        }

        getExtension(type: string): string {
            return "json";
        }

        public load(data: any) {
            if (typeof (data) === "string") {
                data = JSON.parse(data);
            }
            var score = this.app.document;
            while (score.staffElements.length)
                score.removeChild(score.staffElements[0], score.staffElements);
            
            this.app.document = <IScore>MusicElementFactory.recreateElement(null, data); // memento format                
        }
    }*/


    /*export class JsonPlugin implements IScorePlugin {
        constructor() {
        }

        public init(app: IScoreApplication) {
            app.addReader(new JsonReader());
            app.addWriter(new JsonWriter())
        }

        getId() {
            return "JsonPlugin";
        }
    }*/

    /*class JsonWriter implements IWriterPlugIn<ScoreElement, ScoreStatusManager> {
        private app: IScoreApplication;

        init(app: IScoreApplication) { this.app = app; }

        getId(): string {
            return "JSONReader";
        }


        getFormats(): string[] {
            return [
                "JSON"
            ]
        }

        public supports(type: string): boolean {
            return type === "JSON";
        }

        getExtension(type: string): string {
            return "json";
        }

        public save() {
            var seen: any[] = [];
            var text = JSON.stringify(this.app.document.getMemento());
            return text;
        }
    }*/
    
