import { INote, IScore, IProject, GraceType } from "../simple-model/jm-simple-model-interfaces";
import { Alteration, ClefDefinition, ClefType, AbsoluteTime, StemDirectionType, TimeSpan, TupletDef, Pitch } from "../jm-music-basics";



var note1: INote = {
    noteGlyph: TimeSpan.quarterNote,
    timeVal: TimeSpan.quarterNote,
    noteheads: [{
        pitch: new Pitch(1, ""),
        /*tie: false,
        tieForced: false,
        forceAccidental: false,
        showAccidental: false,*/
    }],
    /*decorations: [],
    longDecorations: [],
    syllables: [],
    tupletDef: undefined,
    dots: 0,
    rest: false,
    graceType: GraceType.none,
    beams: [],
    stemDirection: StemDirectionType.StemDown */
}



var note2: INote = {
    noteGlyph: TimeSpan.quarterNote,
    timeVal: TimeSpan.quarterNote,
    noteheads: [{
        pitch: new Pitch(1, ""),
        /*tie: false,
        tieForced: false,
        forceAccidental: false,
        showAccidental: false,*/
    }],
    /*decorations: [],
    longDecorations: [],
    syllables: [],
    tupletDef: undefined,
    dots: 0,
    rest: false,
    graceType: GraceType.none,
    beams: [],
    stemDirection: StemDirectionType.StemDown */
}



var testProject: IProject = {
    score: {
        sections: [{
            /*bars: [],
                //= loadFromLily("{ \\time 4/4 g'4 a' b' f' c'' d'' e'' f'' }", 1, 1)
            keyChanges: [],
            meterChanges: [],*/
            staves: [{
                /*keyChanges: [],
                meterChanges: [],*/
                /*clefChanges: [],
                staffExpressions: [],
                title: "",*/
                voices: [{
                    sequences: [{
                        absTime: AbsoluteTime.startTime,
                        events: [
                            note1,
                            note2
                        ]
                    }
                    ],
                    //stemDirection: StemDirectionType.StemFree
                }]
            }],
            title: ""
        }],
        /*author: "John",
        composer: "John",
        subTitle: "",
        metadata: {},
        "title": "The project"*/
    },
    variables: {},
    /*title: "",
    subTitle: "",
    author: "",
    composer: "",
    metadata: {}*/
}


describe("Measures", function () {

    it("should create a correct measure map", function() {
        let project = testProject;
         
    });
});
