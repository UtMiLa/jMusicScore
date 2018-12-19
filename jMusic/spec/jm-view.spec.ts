import { IScore } from '../model/jm-model-interfaces';    
import { ScoreElement } from "../model/jm-model";  
import { GlobalContext, NullEventVisitor, MusicContainer } from "../model/jm-model-base";
import { VariableRef, GhostsValidator } from '../jm-ghost-elements';

import { LilyPondConverter } from '../jm-lilypond';
import { MusicSpacing } from '../jm-spacing';
import { AbsoluteTime, RegularKeyDefinition, RegularMeterDefinition } from '../jm-music-basics';




var globalContext = new GlobalContext();

function loadFromLily(input: string, noStaves: number, noVoices: number){
    let parser = new LilyPondConverter(globalContext);
    let parsedObject = parser.read(input);
      
    expect(parsedObject.staffElements.length).toEqual(noStaves);
    expect(parsedObject.staffElements[0].voiceElements.length).toEqual(noVoices);
    return parsedObject;
}


describe("NullVisitor", function () {
    //var score: IScore;
    //var app: IScoreApplication;
    var document: IScore;

    beforeEach(function () {
        VariableRef.register();
        document = new ScoreElement(null, globalContext);
    });

    it("should visit every element once", function () {
        expect(document.staffElements.length).toEqual(0);
    });
});

describe("ContextVisitor", function () {
    var document: IScore;

    beforeEach(function () {
        VariableRef.register();
        document = new ScoreElement(null, globalContext);
    });

    it("should visit every element once with context", function () {
        expect(document.staffElements.length).toEqual(0);
    });
});

describe("NullEventVisitor", function () {
    var document: IScore;
    var visitor: NullEventVisitor;

    beforeEach(function () {
        VariableRef.register();

        let hutlifut = loadFromLily("{d4 e4}", 1, 1);

        globalContext.addVariable('hutlifut', hutlifut.staffElements[0].voiceElements[0].getSequence(''));

        visitor = new NullEventVisitor(globalContext);
        spyOn(visitor, "visitNoteInfo");

    });

    function testEvents(testItem: {input: string; res:any }){
        document = loadFromLily(testItem.input, 1, 1);

        let events = document.staffElements[0].voiceElements[0].getEvents(globalContext);
        expect(events.length).toEqual(testItem.res.length);
        for (let i = 0; i < events.length; i++){
            events[i].visitAllEvents(visitor);
            //console.log(events[i].source.debug());
            //console.log((<INoteInfo>events[i]).absTime.toString());
        }
        expect(visitor.visitNoteInfo).toHaveBeenCalledTimes(testItem.res.length);
        // todo: test notelen
        for (let i = 0; i < testItem.res.length; i++){
            const call = (<any>visitor.visitNoteInfo).calls.argsFor(i);
            expect(call).toBeDefined();
            expect(call[0]).toBeDefined();
            expect(call[0].relTime.toString()).toEqual(testItem.res[i].abs);
            expect(call[0].heads[0].pitch.debug()).toEqual(testItem.res[i].pitch);
        }
    }


    const testSet = [
        {
            input: "{ c4 d {e f} g }",
            res: [
                { abs: '0/1', pitch: "c" },
                { abs: '1/4', pitch: "d" },
                { abs: '1/2', pitch: "e" },
                { abs: '3/4', pitch: "f" },
                { abs: '1/1', pitch: "g" },
            ]
        },
        {
            input: "{ c4 \\hutlifut f4 }",
            res: [
                { abs: '0/1', pitch: "c" },
                { abs: '1/4', pitch: "d" },
                { abs: '1/2', pitch: "e" },
                { abs: '3/4', pitch: "f" },
            ]
        },
        {
            input: "{ c4 \\transpose c e { d4 e4 } f4 }",
            res: [
                { abs: '0/1', pitch: "c" },
                { abs: '1/4', pitch: "f" },
                { abs: '1/2', pitch: "g" },
                { abs: '3/4', pitch: "f" },
            ]
        },
    ];

    it("should visit events", function () {
        testEvents(testSet[0]);
    });

    it("should visit referenced events", function () {
        testEvents(testSet[1]);
    });

    it("should visit transformed events", function () {
        testEvents(testSet[2]);
    });



    describe("Spacing", function () {
        var score: ScoreElement;
        beforeEach(function(){
            score = <ScoreElement>loadFromLily("{d4 e4}", 1, 1);
        });
        /*xit("should space notes", function () {
            expect(score.staffElements[0].clefElements.length).toEqual(1);
            expect(score.getSpecialElements("Meter").length).toEqual(1);
            let clefElm = score.staffElements[0].clefElements[0];
        });*/
        it("should space meters", function () {
            score.setMeter(new RegularMeterDefinition(4, 4), AbsoluteTime.startTime);

            let ghostVal = new GhostsValidator(globalContext);
            ghostVal.refine(score);

            expect(score.getSpecialElements("Meter").length).toEqual(1);
            let meterElm = (<MusicContainer><any>score.staffElements[0]).getSpecialElements("Meter")[0];
            expect(meterElm).toBeDefined("staff.meter ikke defined");
            let spacer = new MusicSpacing.SpacingDesigner(globalContext);
            spacer.design(score);
            let meterSpacer = globalContext.getSpacingInfo(meterElm);
            expect(meterSpacer).toBeDefined("meterspacer ikke defined");
            expect(meterSpacer.width).toEqual(24);
        });
        it("should space clefs", function () {
            expect(score.staffElements[0].clefElements.length).toEqual(1);
            let clefElm = score.staffElements[0].clefElements[0];
            let spacer = new MusicSpacing.SpacingDesigner(globalContext);
            spacer.design(score);
            let clefSpacer = globalContext.getSpacingInfo(clefElm);
            expect(clefSpacer).toBeDefined();
            expect(clefSpacer.width).toEqual(18);
        });
        it("should space keys", function () {
            score.setKey(new RegularKeyDefinition('x', 2), AbsoluteTime.startTime, globalContext);
            expect((<any>score.staffElements[0]).getSpecialElements("Key").length).toEqual(1);
            let keyElm = (<any>score.staffElements[0]).getSpecialElements("Key")[0];
            let spacer = new MusicSpacing.SpacingDesigner(globalContext);
            spacer.design(score);
            let keySpacer = globalContext.getSpacingInfo(keyElm);
            expect(keySpacer).toBeDefined();
            expect(keySpacer.width).toEqual(12);
        });
    });
});

