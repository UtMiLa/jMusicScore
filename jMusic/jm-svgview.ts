import {MusicSpacing} from "./jm-spacing";
import {emmentalerNotes} from "./fonts/emmentaler";
import {fontCodePoints} from "./fonts/font-codepoints";
import { MeterDrawer, KeyDrawer, PrefixVisitor, RedrawVisitor, IGraphicsEngine, ISensorGraphicsEngine } from "./jm-views";
import { Validators } from './jm-refiners';
import {IKeyDefCreator, IKeyDefinition, IMemento, IMeterDefCreator, IMeterDefinition, IVisitorIterator,
    AbsoluteTime, ClefDefinition, ClefType, HorizPosition, KeyDefinitionFactory, LongDecorationType, 
    MeterDefinitionFactory, NoteDecorationKind, NoteType, OffsetMeterDefinition, Pitch, PitchClass, 
    Rational, RegularKeyDefinition, RegularMeterDefinition, StaffContext, StemDirectionType, TimeSpan, TupletDef} from './jm-base'
import { IMusicElement,  IMeterSpacingInfo, IMeter, ScoreElement, 
    IVisitor, IVoice, IVoiceNote, IStaff, IScore, ILongDecorationElement, ISpacingInfo, 
    IClefSpacingInfo, Point, INotehead, INote, INoteHeadSpacingInfo, INoteSpacingInfo,
    INoteDecorationElement, INoteDecorationSpacingInfo, IVoiceSpacingInfo, IKeySpacingInfo,
    IStaffSpacingInfo, IScoreSpacingInfo, ITextSyllableElement, ITextSyllableSpacingInfo, IBar, IBarSpacingInfo,
    IBeam, IBeamSpacingInfo, IStaffExpression, IStaffExpressionSpacingInfo, IClef, IKey, 
    NoteDecorationElement, TextSyllableElement, 
    NoteLongDecorationElement, ITimedEvent, Music, GlobalContext } from "./jm-model";    
import { IFeedbackClient } from './jap-application';
import { IWriterPlugIn, IReaderPlugIn } from './jap-application';
import {  IScoreApplication, ScoreStatusManager, IScorePlugin, IScoreDesigner } from './jm-application';
import { DomCheckSensorsVisitor, ExpressionRenderer } from './jm-views';
//IFeedbackClient  SpacingDesigner ExpressionRenderer JQuery MusicSpacing.absolutePos IStatusManager
// Views.Dom...
var $: any;

/// Music 

class SvgMetrics { // todo: yt
    // NoteOutput
    static pitchYFactor = MusicSpacing.Metrics.pitchYFactor;
    
    // StaffOutput
    static staffHelperYOffset = MusicSpacing.Metrics.staffHelperYOffset;
    
    // KeyOutput
    static keyXPerAcc = MusicSpacing.Metrics.keyXPerAcc;

    // ClefOutput
    static clefXOffset = MusicSpacing.Metrics.clefXOffset;//-10;
    
    // MeterOutput
    static meterXOffset = MusicSpacing.Metrics.meterXOffset;//-10;
    static meterY0 = MusicSpacing.Metrics.meterY0;
    static meterX = MusicSpacing.Metrics.meterX;
    static meterY1 = MusicSpacing.Metrics.meterY1;

}


/***************************************** Notes ****************************************************/


interface INoteDef {
    dotWidth: number;
    postfix: string;
    timeVal: number;
    stemLengthMin: number;
    baseNote: string;
    baseRest: string;
    editNote: string;
    noteHead: string;
    noteHeadRev: string;
    noteStem: string;
    noteStemRev: string;
    beamCount?: number;
    flagSuffix?: string;
    rest?: boolean;
}
//todo: still some spacing
class SvgClefOutput {
    public static refId(def: ClefDefinition, change: boolean): string {//todo: væk
        if (change) {
            switch (def.clefCode) {
                case ClefType.ClefG: {
                    if (def.transposition === -7) { return "tenor-clef"; }
                    else return "e_clefs.G_change";
                }
                case ClefType.ClefC: return "e_clefs.C_change";
                case ClefType.ClefF: return "e_clefs.F_change";
                case ClefType.ClefNone: return "";
                case ClefType.ClefPercussion: return "e_clefs.percussion_change";
                case ClefType.ClefTab: return "e_clefs.tab_change";
            }
        }
        else {
            switch (def.clefCode) {
                case ClefType.ClefG: {
                    if (def.transposition === -7) { return "tenor-clef"; }
                    else return "e_clefs.G";
                }
                case ClefType.ClefC: return "e_clefs.C";
                case ClefType.ClefF: return "e_clefs.F";
                case ClefType.ClefNone: return "";
                case ClefType.ClefPercussion: return "e_clefs.percussion";
                case ClefType.ClefTab: return "e_clefs.tab";
            }
        }
    }/**/

}

        
class SvgSizeDesigner implements IScoreDesigner {
    constructor(private svgHelper: SvgHelper) {
    }

    validate(app: IScoreApplication) {
/*                var height = SVGMetrics.staffYStep * app.score.staffElements.length + SVGMetrics.staffYOffset;
        var pixelHeight = this.svgHelper.unitSvgToHtml(height);
        app.container.find('.clientArea').height(pixelHeight);
        var $svg = $(this.svgHelper.svg);
        var $bg = $(this.svgHelper.music.firstChild);
        (<SVGRectElement>this.svgHelper.music.firstChild).setAttribute('height', "" + height);
        $svg.height(height);
        */
    }
}

export class DomFeedbackClient implements IFeedbackClient {
    constructor(private sensorEngine: ISensorGraphicsEngine, private globalContext: GlobalContext) { }
    changed(status: ScoreStatusManager, key: string, val: any) {
        if (key === "currentNote" || key === "currentPitch") {
            if (status.currentNote) {
                var note = status.currentNote;
                var staffLine = 0;
                if (status.currentPitch) {
                    var staffContext = note.parent.parent.getStaffContext(note.absTime);
                    staffLine = staffContext.clef.pitchToStaffLine(status.currentPitch);
                }
                this.sensorEngine.showInsertionPoint(note.id, note.getHorizPosition().beforeAfter * 9, staffLine * SvgMetrics.pitchYFactor);
            }
            else if (!status.currentVoice) {
                this.sensorEngine.hideInsertionPoint();
            }
        } // todo: note?
        else if (key === "currentNote") {
            var note = <IVoiceNote>val;
            if (note) {
                this.showNoteCursor(note.id, note.parent, note.getHorizPosition(), new Pitch(0, ''));
            }
            else {
                this.hideNoteCursor();
            }
        }
        else if (key === "insertPoint") {
            if (status.currentVoice) {
                var hPos = <HorizPosition>val;
                var events = status.currentVoice.getEvents(this.globalContext, hPos.absTime, hPos.absTime.add(new TimeSpan(1,1024))); // todo: grimt!
                if (events.length) {
                    var id = events[0].id;
                    this.sensorEngine.showInsertionPoint(id, hPos.beforeAfter * 9, staffLine * SvgMetrics.pitchYFactor);
                }
            }
        }
        else if (key === 'currentVoice') {
            $("#EditLayer .Voice").css('display', 'none');
            if (val)
                $("#ed_" + val.id).css('display', 'block');
        }
        else if (key === "currentNotehead") {
        }
        else if (key === "mouseOverElement") {
            if (status.mouseOverElement)
                this.mouseOverElement(status.mouseOverElement, true);
        }
        else if (key === "mouseOutElement") {
            if (val)
                this.mouseOverElement(val, false);
        }
    }

    public mouseOverStyle: string = "color:#f00;fill:#960;fill-opacity:0.5;stroke:none";

    showNoteCursor(noteId: string, voice: IVoice, horizPos: HorizPosition, pitch: Pitch) {
        this.sensorEngine.showCursor(noteId);
        var events = voice.getEvents(this.globalContext);
        for (var i = 0; i < events.length; i++) {
            var ev = events[i];
            if (ev.getHorizPosition().eq(horizPos)) {
                var staffContext = voice.parent.getStaffContext(horizPos.absTime);
                var staffLine = staffContext.clef.pitchToStaffLine(pitch);
                this.sensorEngine.moveCursor(ev.id, horizPos.beforeAfter * 9, staffLine * SvgMetrics.pitchYFactor); // todo: spacing
            }
        }
    }
    hideNoteCursor() {
        this.sensorEngine.hideCursor();
    }
    mouseOverElement(elm: IMusicElement, over: boolean) {
        $('#' + elm.id).attr("style", over ? this.mouseOverStyle : "");
        if (elm.getElementName() === "Bar") {
            $('#' + elm.id + ' path').attr("style", over ? "stroke:#4444ff" : "stroke:#444444");
            //var bar = <IBar>elm;
        }
        else if (elm.getElementName() === "Note") {
            var note = <INote>elm;
            note.withHeads(this.globalContext, (head: INotehead, i: number) => {
                var p = head.pitch.toMidi();
                if (over) {
                    $('#tast' + p).addClass('hover');
                }
                else {
                    $('#tast' + p).removeClass('hover');
                }
            });
        }
    }


}
/*
export class SvgViewer implements IScorePlugin {
    constructor(private $svg: JQuery, public container: JQuery) {
    }

    private svgHelper: SvgHelper;

    public init(app: IScoreApplication) {
        //var $svg = app.container.find('.svgArea');
        if (!this.$svg.length) {
            var $clientArea = this.container.find('.clientArea');
            if (!$clientArea.length) {
                $clientArea = $('<div>').attr('class', 'clientArea').appendTo(this.container);
            }
            this.$svg = $('<div>').attr('class', 'svgArea').appendTo($clientArea);
        }
        this.$svg.height(300);

        var svg = <SVGSVGElement>document.createElementNS(SvgHelper.xmlns, "svg");
        svg.setAttributeNS(null, "version", "1.1");
        svg.setAttributeNS(null, "width", "900");
        svg.setAttributeNS(null, "height", "300");
        svg.setAttributeNS(null, "id", "Layer_1");
        this.$svg[0].appendChild(svg);

        this.svgHelper = new SvgHelper(document, svg);

        app.addDesigner(new MusicSpacing.SpacingDesigner());
        app.addDesigner(new ExpressionRenderer());
        app.addDesigner(new TimelineDesigner(this.svgHelper));
        //app.AddDesigner(new BeamDesigner(this.context, this.svgHelper));
        var editors = false;
        if (editors) {
            //app.AddDesigner(new SVGSensorsValidator(this.svgHelper));
            app.addDesigner(new SvgSizeDesigner(this.svgHelper));
        }
        app.addWriter(new SvgWriter(this.svgHelper));

        app.FeedbackManager.registerClient(new DomFeedbackClient(this.svgHelper.EditGraphicsHelper));
    }

    public getId(): string {
        return "Output";
    }

}
*/
/********************************* PRIVATE CLASSES ******************************************/

class SvgGraphicsEngine implements IGraphicsEngine, ISensorGraphicsEngine {
    constructor(svg: any) {
        this._svg = svg;
        this._currentGroup = svg;
    }

    public calcCoordinates(event: MouseEvent): Point {
        var p = this._svg.ownerSVGElement.createSVGPoint();
        p.x = event.clientX;
        p.y = event.clientY;

        var m = (<SVGRectElement>event.currentTarget).getScreenCTM();
        p = p.matrixTransform(m.inverse());

        p.y = Math.round((p.y + 1) / SvgMetrics.pitchYFactor) * SvgMetrics.pitchYFactor;

        return p;
    }

    private groupStack: Element[] = [];
    private _currentGroup: Element;
    get currentGroup(): Element { return this._currentGroup; }
    set currentGroup(v: Element) { this._currentGroup = v; }

    private _svg: any;
    get svg(): any { return this._svg; }

    private transformElement(elm: Element, x: number, y: number, scale: number) {
        elm.setAttributeNS(null, "transform", 'translate (' + x + ',' + y + '), scale(' + scale + ',' + scale + ')');
    }
    public setSize(width: number, height: number) {
        /*var pixelHeight = this.unitSvgToHtml(height);
        $('.clientArea').height(pixelHeight);*/
        var $svg = $(this.svg);
        $svg.closest('svg').attr({ 'height': height, 'width': width });

        var $bg = $(this.svg.firstChild);
        // (<SVGRectElement>this.svg.firstChild).setAttribute('height', "" + height);
        $svg.height(height);
    }

    // ISensorEngine members
    private cursorElement: SVGUseElement;
    private insertionElement: SVGGElement;
    public moveCursor(id: string, x: number, y: number) {
        $('#ed_' + id).prepend(this.cursorElement);
        $(this.cursorElement).attr({ transform: "translate (" + x + ", " + y + ")" });
    }
    public showCursor(noteId: string) {
        if (!this.cursorElement) {
            this.cursorElement = this.createMusicObject(noteId, noteId, 0, 0, 1);
        }
        this.cursorElement.style.opacity = '1.0';
    }
    public hideCursor() {
        if (this.cursorElement) {
            this.cursorElement.style.opacity = '0.0';
        }
    }
    public showInsertionPoint(id: string, x: number, y: number) {
        if (!this.insertionElement) {
            this.insertionElement = <SVGGElement>document.createElementNS(SvgHelper.xmlns, "g");
            var horiz = document.createElementNS(SvgHelper.xmlns, "path");
            horiz.setAttributeNS(null, "class", 'horiz');
            horiz.setAttributeNS(null, "d", 'm -6,0 l 12,0');
            horiz.setAttributeNS(null, "style", "stroke:#a44");
            var vert = document.createElementNS(SvgHelper.xmlns, "path");
            vert.setAttributeNS(null, "d", 'm 0,-6 l 0,36');
            vert.setAttributeNS(null, "style", "stroke:#a44");
            this.insertionElement.appendChild(horiz);
            this.insertionElement.appendChild(vert);
        }
        $('#ed_' + id).prepend(this.insertionElement);
        this.insertionElement.setAttribute('transform', "translate (" + x + ",0)");
        (<SVGPathElement>this.insertionElement.getElementsByTagName('path')[0]).setAttribute('transform', "translate (0, " + y + ")");
        this.insertionElement.setAttribute('display', "inline");
    }
    public hideInsertionPoint() {
        $(this.insertionElement).attr({ display: "none" });
    }

    // IGraphicsEngine members
    public createMusicObject(id: string, item: string, x: number, y: number, scale: number): any {
        var curr = this.currentGroup.getElementsByTagNameNS(SvgHelper.xmlns, "path");
        if (id)
        for (var i = 0; i < curr.length; i++) {
            if (curr[i].attributes.getNamedItem("id") && curr[i].attributes.getNamedItem("id").value === id) {
                var elm = <Element>curr[i];
                elm.setAttributeNS(null, "d", emmentalerNotes[item]);
                this.transformElement(elm, x, y, scale);
                return elm;
            }
        }
        var p = document.createElementNS(SvgHelper.xmlns, "path");
        this.transformElement(p, x, y, scale);                        
        p.setAttributeNS(null, 'id', id);
        p.setAttributeNS(null, 'd', emmentalerNotes[item]);
        this.currentGroup.appendChild(p);
        return p;
    }
    public createRectObject(id: any, x: number, y: number, w: number, h: number, className: string): any {
        // todo: find eksisterende rect
        var rect = document.createElementNS(SvgHelper.xmlns, "rect");
        rect.setAttributeNS(null, "x", "" + x);
        rect.setAttributeNS(null, "width", "" + w);
        rect.setAttributeNS(null, "y", "" + y);
        rect.setAttributeNS(null, "height", "" + h);
        rect.setAttributeNS(null, "id", id);
        rect.setAttributeNS(null, "class", className);
        //rect.setAttributeNS(null, "style", "fill:#0f0;fill-opacity:0.9;stroke:none");
        rect.setAttributeNS(null, "style", "fill:#000;fill-opacity:0;stroke:none");
        this.currentGroup.appendChild(rect);
        return rect;
    }
    public createPathObject(path: string, x: number, y: number, scale: number, stroke: string, fill: string, id: string = null): any {
        if (id) {
            var exist = document.getElementById(id);
            if (exist) {
                if (path !== exist.attributes.getNamedItem("data-path").value) {
                    exist.setAttributeNS(null, "d", path);
                    exist.setAttributeNS(null, "data-path", path);
                }
                return exist;
            }
        }
        var curr = this.currentGroup.getElementsByTagNameNS(SvgHelper.xmlns, "path");
        for (var i = 0; i < curr.length; i++) {
            if (curr[i].attributes.getNamedItem("data-path")) {
                var p1 = curr[i].attributes.getNamedItem("data-path").value;
                if (p1 === path) {
                    return curr[i];
                }
            }
        }
        var p = document.createElementNS(SvgHelper.xmlns, "path");
        if (id) p.setAttributeNS(null, "id", id);
        p.setAttributeNS(null, "d", path);
        if (!stroke) stroke = 'none';
        if (!fill) fill = 'none';
        p.setAttributeNS(null, "style", "stroke:" + stroke + "; fill: " + fill);
        p.setAttributeNS(null, "data-path", path);
        this.currentGroup.appendChild(p);
        return p;
    }
    public drawText(id: string, text: string, x: number, y: number, justify: string): any {
        // todo: find existing
        var textElem = <SVGTextElement>document.createElementNS(SvgHelper.xmlns, "text");
        textElem.appendChild(document.createTextNode(text));
        this.currentGroup.appendChild(textElem);
        textElem.setAttributeNS(null, "x", '' + x);
        textElem.setAttributeNS(null, "y", '' + y);
        //    this.svg.text(x, y, text);
        if (justify !== "left") {
            var bBox = textElem.getBBox();
            var xW = bBox.width;
            var yH = bBox.height;
            if (justify === "center") {
                textElem.setAttributeNS(null, "x", "" + (-xW / 2));
                //textElem.setAttributeNS(null, "y", "" + textSpacing.offset.y);
            }
            else if (justify === "right") {
                textElem.setAttributeNS(null, "x", "" + (-xW));
            }
        }
        return textElem;
    }

    //private documentFragment: DocumentFragment;
    public beginDraw() {
        if (true) {
            $(this.svg).empty(); // todo: slet slettede objekter
            // todo: beams gentegnes
            // todo: note stems & flags
            // todo: meters
            // todo: bars genoprettes
            /*this.documentFragment = document.createDocumentFragment();
            this.currentGroup = <any>this.documentFragment;
            this.groupStack = [<any>this.documentFragment];*/
            this.currentGroup = this.svg;
            this.groupStack = [this.svg];
        }
        /*else {
            this.currentGroup = this.svg;
            this.groupStack = [this.svg];
        }*/
    }
    public endDraw() {
        if (true) {
            //this.svg.appendChild(this.documentFragment);
            this.groupStack = [];
        }
        /*else {
            this.groupStack = [];
        }*/
    }

    public beginGroup(id: string, x: number, y: number, scale: number, className: string): any {
        /*var curr = $(this.currentGroup).find('#' + id);
        if (curr.length) {
            this.currentGroup = curr[0];
            this.TransformElement(this.currentGroup, x, y, scale);
        }
        else*/ {
            var newGrp = document.createElementNS(SvgHelper.xmlns, "g");
            this.transformElement(newGrp, x, y, scale);
            newGrp.setAttributeNS(null, "id", id);
            newGrp.setAttributeNS(null, "class", className);
            this.currentGroup.appendChild(newGrp);
            this.currentGroup = newGrp;
        }
        this.groupStack.push(this.currentGroup);
        return this.currentGroup;
    }
    public endGroup(group: any) {
        this.groupStack.pop();
        this.currentGroup = this.groupStack[this.groupStack.length - 1];
    }
}

class SvgUseGraphicsEngine extends SvgGraphicsEngine {
    constructor(svg: any, private hiddenGroup: SVGElement) { super(svg); }

    public createMusicObject(id: string, item: string, x: number, y: number, scale: number): any {


        var curr = this.currentGroup.getElementsByTagNameNS(SvgHelper.xmlns, "use");
        var useElm: Element = undefined;
        for (var i = 0; i < curr.length; i++) {
            if (curr[i].attributes.getNamedItem("id").value === id) {
                useElm = <Element>curr[i];
                break;
            }
        }
        if (!useElm) {
            useElm = document.createElementNS(SvgHelper.xmlns, "use");
            this.currentGroup.appendChild(useElm);
        }
        useElm.setAttributeNS(null, "x", "0");
        useElm.setAttributeNS(null, "y", "0");
        useElm.setAttributeNS(null, "height", "300");
        useElm.setAttributeNS(null, "width", "300");
        useElm.setAttributeNS(null, "id", id);
        useElm.setAttributeNS(null, "transform", "translate(" + x + "," + y + ") scale(" + scale + ")");

        var hrefAttr = useElm.attributes.getNamedItem("href");
        if (!hrefAttr || hrefAttr.textContent !== '#' + item) {
            useElm.setAttributeNS(SvgHelper.xmlnsXpath, "href", '#' + item);
            /*var curr = this.hiddenGroup.getElementsByTagNameNS(SVGHelper.xmlns, "path");
            var elm: Element;
            for (var i = 0; i < curr.length; i++) {
                if (curr[i].attributes["id"].value === item) {
                    elm = <Element>curr[i];
                    break;
                }
            }*/
            var elm: any = document.getElementById(item);
            if (!elm) {
                elm = document.createElementNS(SvgHelper.xmlns, "path");
                elm.setAttributeNS(null, "d", emmentalerNotes[item]);
                elm.setAttributeNS(null, "id", item);
                this.hiddenGroup.appendChild(elm);
            }

        }
    }

}


class SvgHelper {
    constructor(private svgDocument: Document, svg: SVGSVGElement) {
        this.svg = svg;

        this.hiddenLayer = <SVGGElement>document.createElementNS(SvgHelper.xmlns, "g");
        $(this.hiddenLayer).css('display', 'none').attr('id', 'hidden');
        this.svg.appendChild(this.hiddenLayer);

        this.allLayer = <SVGGElement>document.createElementNS(SvgHelper.xmlns, "g");
        $(this.allLayer).attr('id', "MusicLayer_");
        this.svg.appendChild(this.allLayer);

        this.music = <SVGGElement>document.createElementNS(SvgHelper.xmlns, "g");
        $(this.music).attr('id', "MusicLayer");
        this.editLayer = <SVGGElement>document.createElementNS(SvgHelper.xmlns, "g");
        $(this.editLayer).attr('id', "EditLayer");
        this.allLayer.appendChild(this.music);
        this.allLayer.appendChild(this.editLayer);

        var rect = document.createElementNS(SvgHelper.xmlns, "rect");
        rect.setAttributeNS(null, "x", "0");
        rect.setAttributeNS(null, "width", "800");
        rect.setAttributeNS(null, "y", "0");
        rect.setAttributeNS(null, "height", "200");
        rect.setAttributeNS(null, "class", 'musicBackground');
        rect.setAttributeNS(null, "style", "fill:#fff;fill-opacity:0.8;stroke:#ccc;cursor:pointer");
        this.music.appendChild(rect);


        this.musicGraphicsHelper = new SvgUseGraphicsEngine(this.music, this.hiddenLayer);
        this.editGraphicsHelper = new SvgGraphicsEngine(this.editLayer);
    }
    
    static xmlns = 'http://www.w3.org/2000/svg';
    static xmlnsXpath = 'http://www.w3.org/1999/xlink';
    public music: SVGGElement;
    public svg: SVGSVGElement;
    public editLayer: SVGGElement;
    public hiddenLayer: SVGGElement;
    public allLayer: SVGGElement;
    
    private musicGraphicsHelper: IGraphicsEngine;
    private editGraphicsHelper: ISensorGraphicsEngine;
    public get MusicGraphicsHelper(): IGraphicsEngine { return this.musicGraphicsHelper; }
    public get EditGraphicsHelper(): ISensorGraphicsEngine { return this.editGraphicsHelper; }

    public createRectElement(): SVGRectElement {
        return <SVGRectElement>(this.svgDocument).createElementNS(SvgHelper.xmlns, "rect");
    }

    public createGroupElement(): SVGGElement {
        return <SVGGElement>(this.svgDocument).createElementNS(SvgHelper.xmlns, "g");
    }
}



/************************* Designers ********************************/

export interface IHintArea {
    Staff: IStaff;
    checkVoiceButtons(app: IScoreApplication, staff: IStaff): void;
    release(): void;
}

export interface IHintAreaCreator {
    addStaffButton(y: number, staff: IStaff): IHintArea;
}
/*
class HintArea {
    constructor(private svgParent: JQuery, private scale: number, private y: number, private staff: IStaff) {
        this.buttonElement = this.createButton();
    }

    public buttonElement: Element;
    public get Staff() { return this.staff; }
    public set Staff(v: IStaff) {
        if (this.staff !== v) {
            this.staff = v;
            this.onScroll(null);
        }
    }

    private keyDefinition: IKeyDefinition;
    private clefDefinition: ClefDefinition;
    private meterDefinition: IMeterDefinition;

    private clefElement: Element;
    private meterElement: Element;
    private keyElement: Element;
    private $HelperDiv: any;
    private graphic: IGraphicsEngine;
    private voiceButtons: Element[] = [];

    public checkVoiceButtons(app: IScoreApplication, staff: IStaff) {
        while (staff.voiceElements.length < this.voiceButtons.length) {
            var voiceBtn = this.voiceButtons.pop();
            var parent = voiceBtn.parentNode;
            if (parent) parent.removeChild(voiceBtn);
        }
        var $staffBtnDiv = $(this.buttonElement);
        var voiceButtons = this.voiceButtons;
        staff.withVoices((voice: IVoice, indexVoice: number): void => {
            if (!voiceButtons[indexVoice]) {
                var $btnDiv = $('<div>')
                    .text('voice ' + indexVoice)
                    .addClass('voiceBtn')
                    .addClass('voiceBtn' + voice.id)
                    .appendTo($staffBtnDiv)
                    .click(function () {
                    app.Status.currentVoice = voice;
                });
                var voiceBtn = $btnDiv[0];
                if (voiceBtn) {
                    voiceBtn.setAttributeNS(null, "style", 'opacity: 0.5');
                    //$(voiceBtn).css('opacity', '0.5');
                    voiceButtons[indexVoice] = voiceBtn;
                }
            }
            else {
                $(voiceButtons[indexVoice])
                    .addClass('voiceBtn')
                    .addClass('voiceBtn' + voice.id)
                    .text('voice ' + indexVoice);
            }
        });
    }

    private onScroll(event: Event) {
        var newKey: IKey, newMeter: IMeter, newClef: IClef;
        var scrollLeft = 0;
        if (event) {
            var s = (<Element>event.target).scrollTop;
            $('.overlay').css('top', 80 - s);// todo: 80 parameter
            scrollLeft = (<Element>event.target).scrollLeft;
        }

        var left = -Infinity;
        this.staff.withKeys((key: IKey, i: number) => {
            var p = MusicSpacing.absolutePos(key, 0, 0);
            p.x -= scrollLeft;
            if (p.x < 150 && p.x > left) { newKey = key; left = p.x; }
        });
        left = -Infinity;
        this.staff.withClefs((clef: IClef, i: number) => {
            var p = MusicSpacing.absolutePos(clef, 0, 0);
            p.x -= scrollLeft;
            if (p.x < 150 && p.x > left) { newClef = clef; left = p.x; }
        });
        left = -Infinity;
        this.staff.withMeters((meter: IMeter, i: number) => {
            var p = MusicSpacing.absolutePos(meter, 0, 0);
            p.x -= scrollLeft;
            if (p.x < 150 && p.x > left) { newMeter = meter; left = p.x; }
        });
        if (newMeter) {
            this.setMeter(newMeter.definition);
        }
        if (newClef) {
            this.setClef(newClef.definition);
        }
        if (newKey) {
            this.setKey(newKey.definition, newClef.definition);
        }
    }

    public release() {
        $('#appContainer, #clientArea').off("scroll");
    }

    private createButton(): Element {
        var $appContainer = this.svgParent;
        $('#appContainer, #clientArea').on("scroll",(event) => { this.onScroll(event); });

        var $overlayDiv = $appContainer.find('.overlay');
        var scale = this.scale;
        var me = this;
        var $btnDiv = $('<div>')
            .text('staff')
            .addClass('staffTitleArea')
            .css({ top: this.y })
            .appendTo($overlayDiv);
        this.$HelperDiv = $('<div>')
            .addClass('helperArea')
            .appendTo($btnDiv);

        var svg = document.createElementNS(SvgHelper.xmlns, "svg");
        svg.setAttributeNS(null, "version", "1.1");
        svg.setAttributeNS(null, "width", "100");
        svg.setAttributeNS(null, "height", "65");
        this.$HelperDiv.append(svg);


        var hidden = <SVGElement>document.createElementNS(SvgHelper.xmlns, "g");
        hidden.setAttributeNS(null, "display", "none");
        svg.appendChild(hidden);
        var main = <SVGElement>document.createElementNS(SvgHelper.xmlns, "g");
        svg.appendChild(main);
        me.graphic = new SvgUseGraphicsEngine(main, hidden);

        this.onScroll(null);
        var staffContext = this.staff.getStaffContext(AbsoluteTime.startTime);
        if (staffContext.clef) this.setClef(staffContext.clef.definition);
        if (staffContext.meter) this.setMeter(staffContext.meter.definition);
        if (staffContext.key) this.setKey(staffContext.key.definition, staffContext.clef.definition);
        return $btnDiv[0];
    }

    private redraw() {
        this.graphic.beginDraw();
        var staffLines = this.graphic.beginGroup('hintstaff' + this.staff.id, 0, 0, this.scale, 'staffLineHelper');
        // staff
        for (var i = 0; i < 5; i++) {
            this.graphic.createPathObject("m 10," + (SvgMetrics.staffHelperYOffset + i * SvgMetrics.pitchYFactor * 2) + " l 80,0", 0, 0, 1, '#bbb', undefined);
        }
        //this.graphic.DrawText('teksterbne', 'Hej', 10, 10, 'left');
        // clef
        if (this.clefDefinition) {
            var clef = this.graphic.beginGroup('hintclef' + this.staff.id,(10 + SvgMetrics.clefXOffset), SvgMetrics.staffHelperYOffset + (this.clefDefinition.clefLine - 1) * 2 * SvgMetrics.pitchYFactor, 1, 'clefHelper');
            this.clefElement = this.graphic.createMusicObject('hintclefg' + this.staff.id, SvgClefOutput.refId(this.clefDefinition, false), 0, 0, 1);
            this.graphic.endGroup(clef);
        }
        // meter
        if (this.meterDefinition) {
            var keyWidth = 0;
            var index = 0;
            if (this.keyDefinition) {
                keyWidth = this.keyDefinition.enumerateKeys().length * SvgMetrics.keyXPerAcc;
            }
            var meter = this.graphic.beginGroup('hintmeter' + this.staff.id, 30 + keyWidth + SvgMetrics.clefXOffset + SvgMetrics.meterX,(SvgMetrics.staffHelperYOffset), 1, 'meterHelper');
            var fracFunc = (num: string, den: string): any => {
                var len = Math.max(num.length, den.length);
                MeterDrawer.addStringXy('hintmeter' + this.staff.id + '_' + index++, this.graphic, num, 0, SvgMetrics.staffHelperYOffset + SvgMetrics.meterY0 - SvgMetrics.pitchYFactor * 6, len);
                MeterDrawer.addStringXy('hintmeter' + this.staff.id + '_' + index++, this.graphic, den, 0, SvgMetrics.staffHelperYOffset + SvgMetrics.meterY1 - SvgMetrics.pitchYFactor * 6, len);
            };
            var fullFunc = (full: string): any => {
                var len = full.length;
                MeterDrawer.addStringXy('hintmeter' + this.staff.id + '_' + index++, this.graphic, full, 0, SvgMetrics.staffHelperYOffset + SvgMetrics.meterY0 - SvgMetrics.pitchYFactor * 6, len);
            };

            var res = this.meterDefinition.display(fracFunc, fullFunc);
            $(this.meterElement).data('meter', this.meterDefinition);
            this.graphic.endGroup(meter);
        }
        // key
        if (this.keyDefinition && this.clefDefinition) {
            var key = this.graphic.beginGroup('hintkey' + this.staff.id, 28 + SvgMetrics.clefXOffset,(SvgMetrics.staffHelperYOffset), 1, 'keyHelper');
            KeyDrawer.addKeyXy('hintkeyg' + this.staff.id, this.graphic, this.keyDefinition, this.clefDefinition, 0, 0);
            this.graphic.endGroup(key);
        }
        this.graphic.endGroup(staffLines);
        this.graphic.endDraw();
    }

    public setClef(clefDefinition: ClefDefinition) {
        if (!this.clefDefinition || !this.clefDefinition.eq(clefDefinition)) {
            this.clefDefinition = clefDefinition;
            this.redraw();
        }
    }

    public setKey(keyDefinition: IKeyDefinition, clefDefinition: ClefDefinition) {
        if (!this.keyDefinition || !this.keyDefinition.eq(keyDefinition)) {
            this.keyDefinition = keyDefinition;
            this.redraw();
        }
    }

    public setMeter(meterDefinition: IMeterDefinition) {
        if (!this.meterDefinition || !this.meterDefinition.eq(meterDefinition)) {
            this.meterDefinition = meterDefinition;
            this.redraw();
        }

    }
}

export class HintAreaPlugin implements IScorePlugin, IHintAreaCreator {
    init(app: IScoreApplication) {
        this.container = $('.appContainer');
        app.addDesigner(new HintAreaDesigner(app, this));
    }

    private container: JQuery;

    getId() {
        return "HintArea";
    }

    addStaffButton(y: number, staff: IStaff): IHintArea {
        var svgHintArea = new HintArea(this.container, staff.parent.spacingInfo.scale, y, staff);
        //var svgHintArea = new SVGHintArea($('.appContainer'), staff.parent.spacingInfo.scale, y, staff);
        return svgHintArea;
    }
}

class HintAreaDesigner implements IScoreDesigner, IFeedbackClient {
    constructor(private app: IScoreApplication, private svgHelper: IHintAreaCreator) {
        app.FeedbackManager.registerClient(this);
    }

    private staffButtons: IHintArea[] = [];

    public changed(status: IStatusManager, key: string, val: any) {
        if (key === 'currentVoice') {
            $('.voiceBtn')
                .css('opacity', '0.5');
            if (val)
                $('.voiceBtn' + val.id).css('opacity','1.0');
        }
    }

    public validate(app: IScoreApplication) {
        var score = app.document;
        while (this.staffButtons.length > score.staffElements.length) {
            var removeBtn = this.staffButtons.pop();
            removeBtn.release();
        }

        score.withStaves((staff: IStaff, index: number): void => {
            var btn: IHintArea;
            if (index >= this.staffButtons.length) {
                this.staffButtons.push(btn = this.svgHelper.addStaffButton((staff.spacingInfo.offset.y - 19) * score.spacingInfo.scale, staff));
            }
            else {
                btn = this.staffButtons[index];
                btn.Staff = staff;
            }

            btn.checkVoiceButtons(app, staff);
        });
    }
}
*/
class TimelineDesigner implements IScoreDesigner {
    constructor(private svgHelper: SvgHelper) {                
    }
    private checkSensors: DomCheckSensorsVisitor;

    private checkHintButtons(score: IScore) {
    }

    public validate(app: IScoreApplication) {
        var score = app.document;
        var svgHelper = this.svgHelper;//<SVGHelper>app.GetState("svgHelper:" + this.context); // todo: Svghelper yt

        var visitor = new PrefixVisitor(score.globalContext, new RedrawVisitor(score.globalContext, svgHelper.MusicGraphicsHelper), svgHelper.MusicGraphicsHelper);
        var scoreSpacingInfo = score.globalContext.getSpacingInfo(score);
        svgHelper.MusicGraphicsHelper.setSize(scoreSpacingInfo.width * scoreSpacingInfo.scale, scoreSpacingInfo.height);
        svgHelper.MusicGraphicsHelper.beginDraw();
        score.visitAll(visitor);
        svgHelper.MusicGraphicsHelper.endDraw();

        if (!this.checkSensors) {
            this.checkSensors = new DomCheckSensorsVisitor(score.globalContext, svgHelper.EditGraphicsHelper, app.document, app);
            //app.FeedbackManager.registerClient(this.checkSensors);
        }

        var visitor = new PrefixVisitor(score.globalContext, this.checkSensors, svgHelper.EditGraphicsHelper, 'ed_');
        svgHelper.EditGraphicsHelper.beginDraw();
        score.visitAll(visitor);
        svgHelper.EditGraphicsHelper.endDraw();

    }
}
/*
class BeamDesigner implements ScoreApplication.ScoreDesigner {
    constructor(private context: string, private svgHelper: SVGHelper) {
        //this.noteOutputHelper = new NoteOutputHelper(this.context, svgHelper);
    }

    //private noteOutputHelper: NoteOutputHelper;

    public Validate(app: ScoreApplication.ScoreApplication) {
        for (var iStaff = 0; iStaff < app.score.staffElements.length; iStaff++) {
            var staff = app.score.staffElements[iStaff];
            for (var iVoice = 0; iVoice < staff.voiceElements.length; iVoice++) {
                var voice = staff.voiceElements[iVoice];
                this.ValidateVoice(voice);
                this.ValidateStems(voice);
            }
        }
    }

    private ValidateVoice(voice: VoiceElement) {
        for (var iNote = 0; iNote < voice.getChildren().length; iNote++) {
            var note: NoteElement = voice.getChild(iNote);
            /*var bs = note.getBeamspan();
            if (bs.length && bs[0] > 0) {
                // spacing for group
            }
            note.sendEvent({ type: MusicEventType.eventType.updateAll, sender: note });* /
            //var noteOutput = <SvgView.SVGNoteOutput>note.getOutputsByContext(this.context)[0];
            for (var i = 0; i < note.Beams.length; i++) {
                var beam = note.Beams[i];
                if (beam) {
                    //var beamOutput: SvgView.SVGBeamOutput;
                    /*if (beam.getOutputsByContext(this.context).length === 0) {
                        beamOutput = new SvgView.SVGBeamOutput(beam, noteOutput, beam.index);
                    }
                    else beamOutput = <SvgView.SVGBeamOutput>beam.getOutputsByContext(this.context)[0];
                    beamOutput.updateAll();* /
                }
            }

        }
    }

    private ValidateStems(voice: VoiceElement) {

    }
}*/

/***************************************************** Sensors ************************************************************/

class SvgEditorMetrics {
    static xPrevFirst = -35;
    static xNextLast = 45;

    static xLeft = -3;
    static xRight = 1;
    static yUp = -20;
    static yDown = 50;

    static xLeftPitch = SvgEditorMetrics.xLeft;
    static xRightPitch = SvgEditorMetrics.xRight;
    static yUpPitch = -3;
    static yDownPitch = 3;

    static xInsertCorrection = -8;
}

/*
Todo: 
set current note/head after inserting/editing
dialogs (note, head, voice, staff)       
*/
/*
class SvgWriter implements IWriterPlugIn<ScoreElement, ScoreStatusManager> {
    constructor(private svgHelper: SvgHelper) { }

    init(app: IScoreApplication) {
        this.app = app;
    }

    private app: IScoreApplication;

    getId(): string {
        return "SVGWriter";
    }

    getFormats(): string[] {
        return [
            "SVG"
        ]
    }

    public supports(type: string): boolean {
        return type === "SVG";
    }

    getExtension(type: string): string {
        return "svg";
    }

    public save() {
        var $svg = $(this.svgHelper.svg.parentNode);
        var xml = $svg.html();
        return xml;
    }
}
*/
export class SvgEditorManager {
    public static activateVoiceSensors(voice: IVoice, context: string, activate: boolean) {
        //todo: ActivateVoiceSensors
        /*var displayData = <SVGVoiceDisplayData>voice.getDisplayData(context);
        var dispGroupRef = <SensorDisplayData>voice.getDisplayData("Edit:" + context);
        if (activate) {
            displayData.ref.setAttributeNS(null, "style", 'opacity: 1');
            displayData.quickBtn.setAttributeNS(null, "style", 'opacity: 1');
            dispGroupRef.ref.setAttributeNS(null, "style", 'display: svg-g');
        }
        else {
            displayData.ref.setAttributeNS(null, "style", 'opacity: 0.7');
            displayData.quickBtn.setAttributeNS(null, "style", 'opacity: 0.7');
            dispGroupRef.ref.setAttributeNS(null, "style", 'display: none');
        }*/
    }

    public static activateAllVoiceSensors(score: IScore, context: string, activate: boolean) {
        score.withVoices((voice: IVoice, index: number) => {
            SvgEditorManager.activateVoiceSensors(voice, context, activate);
        });
    }

    /*todo: 
        activate beforenote, afternote, clef, bar
        deactivate everything else

        
    */
}




