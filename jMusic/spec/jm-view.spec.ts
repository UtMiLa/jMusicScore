import { IScore } from '../model/jm-model-interfaces';    
import { ScoreElement } from "../model/jm-model";  
import { GlobalContext, NullEventVisitor } from "../model/jm-model-base";
import { VariableRef } from '../jm-ghost-elements';

import { LilyPondConverter } from '../jm-lilypond';




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
        spyOn(visitor, "visitNote");

    });

    function testEvents(testItem: {input: string; res:any }){
        document = loadFromLily(testItem.input, 1, 1);

        let events = document.staffElements[0].voiceElements[0].getEvents(globalContext);
        expect(events.length).toEqual(testItem.res.length);
        for (let i = 0; i < events.length; i++){
            events[i].visit(visitor);
            //console.log(events[i].source.debug());
            //console.log((<INoteInfo>events[i]).absTime.toString());
        }
        expect(visitor.visitNote).toHaveBeenCalledTimes(testItem.res.length);
        // todo: test abstime, pitch, notelen
        for (let i = 0; i < testItem.res.length; i++){
            const call = (<any>visitor.visitNote).calls.argsFor(i);
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
});

