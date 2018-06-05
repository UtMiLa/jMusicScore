import {Model} from "./jMusicScore";
import {JMusicScoreUi} from "./jMusicScore.UI";
import {MusicSpacing} from "./jMusicScore.Spacing";
import {emmentalerNotes} from "./emmentaler";
import {emmentalerCode} from "./emmentaler_code";
import {Commands} from "./commands";
import { ScoreApplication } from "./jMusicScore.Application";
import {Application} from "../JApps/application";
//import {MusicEditors} from "./jMusicScore.Editors";
import {Views} from "./jMusicScore.Views";
import {SvgView} from "./jMusicScore.SvgView";

    export module CanvasView {

        interface hash {[key: string]: any };

        class DomHelper { // bruger kun jQuery til at sætte/hente css, empty, sætte attr og  $(this.root).height(300);
            static setAttribute(elm: HTMLElement, attr: hash) {
                $(elm).attr(attr);                
            }

            static getAttribute(elm: HTMLElement, key: string): string {
                return elm.getAttribute(key);
                //return $(elm).attr(key);
            }

            static setCss(elm: HTMLElement, attr: hash) {
                $(elm).css(attr);
            }

            static getCss(elm: HTMLElement, key: string){
                //return elm.get
                return $(elm).css(key);
            }

            static empty(elm: HTMLElement){
                $(elm).empty();
            }
            
            static remove(elm: HTMLElement){
                elm.remove();
                //$(elm).remove();
            }
            
            static append(child: HTMLElement, parent: HTMLElement){
                parent.appendChild(child);
                //$(child).appendTo(parent);
            }

            static findByClass(parent: HTMLElement, className: string): HTMLElement{
                return <HTMLElement>parent.querySelector("." + className);
                /*var res = $(parent).find("." + className);
                if (res.length) return res[0];
                return null;*/
            }

            static createElement(tag: string, parent: HTMLElement, className: string, css: hash, attr: hash): HTMLElement{
                var res = document.createElement(tag);// $('<'+tag+'>').appendTo(parent);
                if (className) res.className = className;
                if (css) this.setCss(res, css);
                if (attr) this.setAttribute(res, attr);
                return res;
            }
        }
        
                export class CanvasGraphicsEngine implements Views.IGraphicsEngine {
                    constructor(private canvas: HTMLCanvasElement) {
                        this.context = canvas.getContext('2d');
                    }
                    private context: CanvasRenderingContext2D;
        
        
                    private setTranslation(x: number, y: number) {
                        this.context.translate(x, y);
                    }
                    public setSize(width: number, height: number) {
                        //$(this.canvas).attr({ height: height, width: width });
                        DomHelper.setAttribute(this.canvas, { height: height, width: width });
                    }
                    public beginDraw() {
                        this.context.setTransform(1, 0, 0, 1, 0, 0);
                        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    }
                    public endDraw() {
                    }
                    public createMusicObject(id: string, item: string, x: number, y: number, scale: number): any {
                        var useMusicFonts = true;
                        if (!useMusicFonts) {
                            this.setTranslation(x, y);
                        this.context.scale(scale, scale);
                            this.drawPath(emmentalerNotes[item], 'black', null);
                        this.context.scale(1 / scale, 1 / scale);
                            this.setTranslation(-x, -y);
                        }
                        else {
                            var char: string = emmentalerCode[item.substr(2)];
                            if (char === undefined) {
                                char = 'u';
                            }
                            var fontsize = Math.round(24 * scale);
                            this.context.font = fontsize + "px Emmentaler";
                            this.context.fillText(char, x, y);
                        }
                    }
                    private drawPath(path: string, fillStyle: string, strokeStyle: string): any {
                        function move(stack: number[], context: CanvasRenderingContext2D, current: Model.Point, relative: boolean): boolean {
                            if (stack.length < 2) return false;
                            context.moveTo(stack[0], stack[1]);
                            //$('<li>').text('moveTo(' + Math.round(stack[0]) + ', ' + Math.round(stack[1])).appendTo('#operations');
                            current.x = stack[0];
                            current.y = stack[1];
                            stack.shift();
                            stack.shift();
                            return true;
                        }
                        function line(stack: number[], context: CanvasRenderingContext2D, current: Model.Point, relative: boolean): boolean {
                            if (stack.length < 2) return false;
                            context.lineTo(stack[0], stack[1]);
                            //$('<li>').text('lineTo(' + Math.round(stack[0]) + ', ' + Math.round(stack[1])).appendTo('#operations');
                            current.x = stack[0];
                            current.y = stack[1];
                            stack.shift();
                            stack.shift();
                            return true;
                        }
                        function horiz(stack: number[], context: CanvasRenderingContext2D, current: Model.Point, relative: boolean): boolean {
                            if (stack.length < 1) return false;
                            var x = stack[0] + (relative ? current.x : 0);
                            context.lineTo(x, current.y);
                            //$('<li>').text('horiz(' + Math.round(x) + ', ' + Math.round(current.y)).appendTo('#operations');
                            current.x = x;
                            stack.shift();
                            return true;
                        }
                        function vert(stack: number[], context: CanvasRenderingContext2D, current: Model.Point, relative: boolean): boolean {
                            if (stack.length < 1) return false;
                            var y = stack[0] + (relative ? current.y : 0);
                            context.lineTo(current.x, y);
                            //$('<li>').text('vert(' + Math.round(current.x) + ', ' + Math.round(y)).appendTo('#operations');
                            current.y = y;
                            stack.shift();
                            return true;
                        }
                        function curve(stack: number[], context: CanvasRenderingContext2D, current: Model.Point, relative: boolean): boolean {
                            if (stack.length < 6) return false;
                            context.bezierCurveTo(stack[0], stack[1], stack[2], stack[3], stack[4], stack[5]);
                            /*$('<li>').text(
                                'bezierCurveTo(' + Math.round(stack[0]) + ', ' + Math.round(stack[1]) + ', ' + Math.round(stack[2]) + ', ' + Math.round(stack[3]) + ', ' + Math.round(stack[4])
                                + ', ' + Math.round(stack[5])
                                ).appendTo('#operations');*/
                            current.x = stack[4];
                            current.y = stack[5];
                            stack.shift();
                            stack.shift();
                            stack.shift();
                            stack.shift();
                            stack.shift();
                            stack.shift();
                            return true;
                        }
                        function close(stack: number[], context: CanvasRenderingContext2D, current: Model.Point, relative: boolean): boolean {
                            context.closePath();
                            return true;
                        }
        
                        var operations: { [index: string]: (stack: number[], context: CanvasRenderingContext2D, current: Model.Point, relative: boolean) => boolean } = {
                            'm': move,
                            'M': move,
                            'c': curve,
                            'C': curve,
                            'l': line,
                            'L': line,
                            'H': horiz,
                            'h': horiz,
                            'V': vert,
                            'v': vert,
                            'z': close
                        };
        
                        var tokens = path.split(' ');
                        var operation: (stack: number[], context: CanvasRenderingContext2D, current: Model.Point, relative: boolean) => boolean = move;
                        var stack: number[] = [];
                        var current = { x: 0, y: 0 };
                        var relative = false;
                        this.context.beginPath();
        
                        for (var i = 0; i < tokens.length; i++) {
                            var token: string = tokens[i];
                            var X = 0;
                            var Y = 0;
                            if (token.match(/^[mclhvMCLHV]$/)) { // todo: support cCsSqQtTaA
                                operation = operations[token];
                                stack = [];
                                relative = (token.match(/^[mclhv]$/)) ? true : false;
                            }
                            else {
                                if (token.match(/^-?\d+(\.\d+)?$/)) {
                                    // 1 number
                                    stack.push(parseFloat(token) * 1.0);
                                }
                                else if (token.match(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/)) {
                                    // 2 numbers
                                    var numbers = token.split(',');
                                    if (relative) {
                                        X = current.x + parseFloat(numbers[0]) * 1.0;
                                        Y = current.y + parseFloat(numbers[1]) * 1.0;
                                    }
                                    else {
                                        X = parseFloat(numbers[0]) * 1.0;
                                        Y = parseFloat(numbers[1]) * 1.0;
                                    }
                                    stack.push(X);
                                    stack.push(Y);
                                }
                            }
                            operation(stack, this.context, current, relative);
                        }
        
                        if (fillStyle) {
                            this.context.fillStyle = fillStyle;
                            this.context.fill();
                        }
                        if (strokeStyle) {
                            this.context.strokeStyle = strokeStyle;
                            this.context.stroke();
                        }
                    }
                    /*public UpdateMusicObject(element: any, item: string, x: number, y: number, scale: number): any {
                        this.DrawPath(jMusicScore.emmentaler_notes[item], 'black', null);
                    }*/
                    public createPathObject(path: string, x: number, y: number, scale: number, stroke: string, fill: string, id: string = null): any {
                        this.setTranslation(x, y);
                        this.context.scale(scale, scale);
                        this.drawPath(path, fill, stroke);
                        this.context.scale(1 / scale, 1 / scale);
                        this.setTranslation(-x, -y);
                    }
                    public createRectObject(id: any, x: number, y: number, w: number, h: number, className: string): any {
                        // todo: canvas rect
                        var x1 = x + 1;
                    }
                    public drawText(id: string, text: string, x: number, y: number, justify: string): any {
                        /*this.context.fillStyle = "black";*/
                        this.context.font = "16px Arial";
                        var w = this.context.measureText(text).width;
                        if (justify === "center") {
                            x -= w / 2;
                        }
                        else if (justify === "right") {
                            x -= w;
                        }
                        this.context.fillText(text, x, y);
                    }
                    public beginGroup(id: string, x: number, y: number, scale: number, className: string): any {
                        this.setTranslation(x, y);
                        this.context.scale(scale, scale);
                        return { x: x, y: y, scale: scale };
                    }
                    public endGroup(group: any) {
                        this.context.scale(1 / group.scale, 1 / group.scale);
                        this.setTranslation(-group.x, -group.y);
                    }
                }
        
        
        
                class HtmlGraphicsEngine implements Views.IGraphicsEngine, Views.ISensorGraphicsEngine {
                    constructor(private root: HTMLElement, public idPrefix: string) {
                        this.currentGroup = root;
                    }
        
                    private groupStack: HTMLElement[] = [];
                    private currentGroup: HTMLElement;
        
                    public calcCoordinates(event: MouseEvent): Model.Point {
                        var offsetY = event.offsetY;
                        var offsetX = event.offsetX;
                        if (event.offsetY === undefined) {
                            // Firefox hack
                            var elm = <HTMLDivElement>event.target;
                            var rect = elm.getBoundingClientRect();
        
                            offsetY = (event.clientY - $(elm).offset().top) * elm.offsetHeight / rect.height;
                            offsetX = (event.clientX - $(elm).offset().left) * elm.offsetHeight / rect.height;
                        }
        
                        var p = new Model.Point(offsetX, offsetY + parseInt($(event.target).css('top')));
                        return p;
                    }
                    //CreateRectObject(id: any, x: number, y: number, w: number, h: number, className: string): any;
                    // Cursor
                    moveCursor(id: string, x: number, y: number): void { }
                    showCursor(noteId: string): void { }
                    hideCursor(): void { }
                    // InsertionPoint
                    showInsertionPoint(id: string, x: number, y: number): void {
                        var insertPoint = document.getElementById("insertionPoint");
                        var parent =  document.getElementById('htmlSensor_ed_' + id);

                        if (!insertPoint){
                            insertPoint = DomHelper.createElement("div", parent, "", {
                                position: 'relative',
                                'margin-left': '-4px',
                                'margin-top': '-4px',
                                width: '5px',
                                height: '5px',
                                border: 'solid blue 1px'
                           }, {'id': 'insertionPoint'});
                        }
                        DomHelper.setCss(insertPoint, {
                            top: y,
                            left: x
                        });
                        DomHelper.append(insertPoint, parent);


                        /*var $insertPoint = $('#insertionPoint');
                        if (!$insertPoint.length) {
                            $insertPoint = $('<div>').attr('id', 'insertionPoint').css({
                                position: 'relative',
                                'margin-left': '-4px',
                                'margin-top': '-4px',
                                width: '5px',
                                height: '5px',
                                border: 'solid blue 1px'
                           });
                        }
                        $insertPoint.css({
                            top: y,
                            left: x
                        }).appendTo('#htmlSensor_ed_' + id);*/
                    }
                    hideInsertionPoint(): void {
                        //$('#insertionPoint').remove();
                        DomHelper.remove(document.getElementById("insertionPoint"));
                    }
        
                    public beginDraw() {
                        //this.scale = 1;
                        //$(this.root).empty();
                        DomHelper.empty(this.root);
                        this.currentGroup = this.root;
                        this.groupStack = [];
                    }
                    public endDraw() {
                        this.groupStack = [];
                    }
                    public setSize(width: number, height: number) {
                        //$(this.root).css({ height: height, width: width });
                        DomHelper.setCss(this.root, { height: height, width: width });
                    }
                    public createMusicObject(parent: any, item: string, x: number, y: number, scale: number): any {
                        /*var $img = $('<img>')
                            .attr('src', 'images/symbol1/' + item + '.png')
                            .css({ position: 'absolute', left: x, top: y })
                            .appendTo(this.currentGroup);
                        return $img;*/
                        return DomHelper.createElement("img", this.currentGroup, "", { position: 'absolute', left: x, top: y }, {'src': 'images/symbol1/' + item + '.png'});
                    }
                    createPathObject(path: string, x: number, y: number, scale: number, stroke: string, fill: string, id: string = null): any {
                    }
                    createRectObject(id: any, x: number, y: number, w: number, h: number, className: string): any {
                        /*var $rect = $('<div>')
                            .css({ position: 'absolute', left: x, top: y, width: w, height: h/*, border: 'solid blue thin'* / })
                            //.css({ position: 'absolute', 'margin-top': y, 'margin-left': x, left: 0, top: 0, width: w, height: h, border: 'solid blue thin' })
                            .attr('id', this.idPrefix + id)
                            .appendTo(this.currentGroup);
                        return $rect;*/
                        var rect = DomHelper.createElement("div", this.currentGroup, className, 
                            { position: 'absolute', left: x, top: y, width: w, height: h, border: 'solid blue thin' },
                            {'id': this.idPrefix + id}
                        );
                        return rect;
                    }
                    public drawText(id: string, text: string, x: number, y: number, justify: string): any { }
                    beginGroup(id: string, x: number, y: number, scale: number, className: string): any {
                        /*var $group = $('<div>').addClass(className).attr('id', this.idPrefix + id).appendTo(this.currentGroup);
                        $group.css({ position: "absolute", left: x, top: y, transform: "scale(" + scale + "," + scale + ")" });
                        this.groupStack.push($group[0]);
                        this.currentGroup = $group[0];
                        return $group;*/
                        var group = DomHelper.createElement("div", this.currentGroup, className, 
                            { position: "absolute", left: x, top: y, transform: "scale(" + scale + "," + scale + ")" },
                            {'id': this.idPrefix + id}
                        );
                        this.groupStack.push(group);
                        this.currentGroup = group;
                        return group;
                    }
                    endGroup(group: any) {
                        this.groupStack.pop();
                        this.currentGroup = this.groupStack[this.groupStack.length - 1];
                    }
                }
        
        
                class CanvasHelper /*implements SvgView.IHintAreaCreator*/ {
                    constructor(private svgDocument: Document, root: HTMLElement) {
                        this.root = root;
        
                        this.allLayer = <HTMLElement>document.createElement("div");
                        //$(this.allLayer).attr('id', "MusicLayer_");
                        DomHelper.setAttribute(this.allLayer, {'id': "MusicLayer_"});
                        this.root.appendChild(this.allLayer);
        
                        //var $canvas = $('<canvas>');
                        //$canvas.appendTo('#svgArea');
                        //$canvas.attr({ 'id': 'musicCanvas', 'width': '600px', 'height': '600px' });

                        this.music = <HTMLCanvasElement>DomHelper.createElement("canvas", document.getElementById("svgArea"), "", null, { 'id': 'musicCanvas', 'width': '600px', 'height': '600px' });
                        //.createCanvas() //<HTMLCanvasElement>$canvas[0];
                        //DomHelper.setAttribute(this.music, { 'id': 'musicCanvas', 'width': '600px', 'height': '600px' });
                        
                        this.editLayer = document.createElement("div");
        
                        this.allLayer.appendChild(this.music);
                        this.allLayer.appendChild(this.editLayer);
        
                        this._MusicGraphicsHelper = new CanvasGraphicsEngine(this.music);
                        this._EditGraphicsHelper = new HtmlGraphicsEngine(this.editLayer, 'htmlSensor_');
                    }
        
                    public music: HTMLCanvasElement;
                    public root: HTMLElement;
                    public editLayer: HTMLElement;
                    public allLayer: HTMLElement;
        
                    private _MusicGraphicsHelper: Views.IGraphicsEngine;
                    private _EditGraphicsHelper: Views.ISensorGraphicsEngine;
                    public get MusicGraphicsHelper(): Views.IGraphicsEngine { return this._MusicGraphicsHelper; }
                    public get EditGraphicsHelper(): Views.ISensorGraphicsEngine { return this._EditGraphicsHelper; }
        
                    /*public addStaffButton(y: number, staff: Model.IStaff): SVGHintArea {
                        var svgHintArea = new SVGHintArea(this.svg, staff.parent.spacingInfo.scale, y, staff);
                        return svgHintArea;
                    }*/
        
                    public createRectElement(): HTMLElement {
                        return document.createElement("div");
                    }
        
                    public createGroupElement(): HTMLElement {
                        return document.createElement("div");
                    }
                }
        
        
                class SVGEditorMetrics {
                    static xPrevFirst = -35;
                    static xNextLast = 45;
        
                    static xLeft = -3;
                    static xRight = 1;
                    static yUp = -20;
                    static yDown = 50;
        
                    static xLeftPitch = SVGEditorMetrics.xLeft;
                    static xRightPitch = SVGEditorMetrics.xRight;
                    static yUpPitch = -3;
                    static yDownPitch = 3;
        
                    static xInsertCorrection = -8;
                }
        
        
                class TimelineDesigner implements ScoreApplication.IScoreDesigner {
                    constructor(private svgHelper: CanvasHelper) {
                    }
                    private checkSensors: Views.DomCheckSensorsVisitor;
        
                    private CheckHintButtons(score: Model.IScore) {
                    }
        
                    public validate(app: ScoreApplication.IScoreApplication) {
                        var score = app.document;
                        var svgHelper = this.svgHelper;//<SVGHelper>app.GetState("svgHelper:" + this.context); // todo: Svghelper yt
        
                        var visitor = new Views.PrefixVisitor(new Views.RedrawVisitor(svgHelper.MusicGraphicsHelper), svgHelper.MusicGraphicsHelper);
                        svgHelper.MusicGraphicsHelper.setSize(score.spacingInfo.width * score.spacingInfo.scale, score.spacingInfo.height);
                        svgHelper.MusicGraphicsHelper.beginDraw();
                        score.visitAll(visitor);
                        svgHelper.MusicGraphicsHelper.endDraw();
        
                        if (!this.checkSensors) {
                            this.checkSensors = new Views.DomCheckSensorsVisitor(svgHelper.EditGraphicsHelper, app.document, app);
                            //app.FeedbackManager.registerClient(this.checkSensors);
                        }
        
                        var visitor = new Views.PrefixVisitor(this.checkSensors, svgHelper.EditGraphicsHelper, 'ed_');
                        svgHelper.EditGraphicsHelper.beginDraw();
                        score.visitAll(visitor);
                        svgHelper.EditGraphicsHelper.endDraw();
        
                    }
                }
        
        
                export class CanvasViewer implements ScoreApplication.IScorePlugin {
                    private root: HTMLElement;
                    private container: HTMLElement;
                    constructor($root: JQuery, public $container: JQuery) {
                        this.root = $root.length ? $root[0] : null;
                        this.container = $container[0];
                    }
        
                    private canvasHelper: CanvasHelper;
        
                    public init(app: ScoreApplication.IScoreApplication) {
                        //var $svg = app.container.find('.svgArea');
                        if (!this.root) {
                            //var $clientArea = this.container.find('.clientArea');
                            var clientArea = DomHelper.findByClass(this.container, 'clientArea');
                            if (!clientArea) {
                                clientArea = DomHelper.createElement("div", this.container, "clientArea", null, null);
                                //$('<div>').attr('class', 'clientArea').appendTo(this.container);
                            }
                            this.root = DomHelper.createElement("div", clientArea, "svgArea", null, null);                             
                            //this.$root = $('<div>').attr('class', 'svgArea').appendTo($clientArea);
                        }
                        $(this.root).height(300);
        
                        this.canvasHelper = new CanvasHelper(document, this.root);
        
                        app.addDesigner(new MusicSpacing.SpacingDesigner());
                        app.addDesigner(new Views.ExpressionRenderer());
                        app.addDesigner(new TimelineDesigner(this.canvasHelper));
                        //app.AddDesigner(new HintAreaDesigner(app, this.canvasHelper)); // todo: til egen plugin?
                        //app.AddDesigner(new BeamDesigner(this.context, this.svgHelper));
                        var editors = false;
                        /*if (editors) {
                            //app.AddDesigner(new SVGSensorsValidator(this.svgHelper));
                            app.AddDesigner(new SVGSizeDesigner(this.canvasHelper));
                        }
                        app.AddWriter(new CanvasWriter(this.canvasHelper));
                        */
                        app.FeedbackManager.registerClient(new SvgView.DomFeedbackClient(this.canvasHelper.EditGraphicsHelper));
                    }
        
                    public getId(): string {
                        return "Output";
                    }
        
                }
            }