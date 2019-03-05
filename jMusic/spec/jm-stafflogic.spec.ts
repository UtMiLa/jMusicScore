import {AbsoluteTime, ClefDefinition, ClefType, Pitch, PitchClass, 
    RegularKeyDefinition, RegularMeterDefinition, Interval, IntervalType} from '../jm-music-basics'
import { IScore, IStaff } from '../model/jm-model-interfaces';
import {  ScoreElement, MusicElementFactory } from "../model/jm-model";  
import { GlobalContext } from "../model/jm-model-base";
import  { JsonHelper } from '../jm-json';
import { VariableRef } from '../jm-ghost-elements';
import { ISequence } from '../model/jm-model-interfaces';
import { ControlElementManager } from '../jm-stafflogic';

var initScore: any = { "id": "2", "t": "Score", "def": { "metadata": {} }, "children": [{ "id": "3", "t": "Bar", "def": { "abs": { "num": 0, "den": 1 } } }, { "id": "4", "t": "Bar", "def": { "abs": { "num": 1, "den": 1 } } }, { "id": "5", "t": "Bar", "def": { "abs": { "num": 2, "den": 1 } } }, { "id": "6", "t": "Staff", "children": [{ "id": "7", "t": "Clef", "def": { "abs": { "num": 0, "den": 1 }, "clef": 1, "lin": 4, "tr": 0 } }, { "id": "8", "t": "Meter", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "num": 4, "den": 4 } } }, { "id": "9", "t": "Key", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "acci": "x", "no": 2 } } }, { "id": "10", "t": "Sequence", "def": { "stem": 1 }, "children": [{ "id": "11", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 0, "den": 1 }, "noteId": "n1_8" }, "children": [{ "id": "12", "t": "Notehead", "def": { "p": 2, "a": "" } }] }, { "id": "13", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 1, "den": 8 }, "noteId": "n1_8" }, "children": [{ "id": "14", "t": "Notehead", "def": { "p": 2, "a": "" } }] }, { "id": "15", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 1, "den": 4 }, "noteId": "n1_8" }, "children": [{ "id": "16", "t": "Notehead", "def": { "p": 4, "a": "" } }] }, { "id": "17", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 3, "den": 8 }, "noteId": "n1_8" }, "children": [{ "id": "18", "t": "Notehead", "def": { "p": 6, "a": "" } }] }, { "id": "19", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 1, "den": 2 }, "noteId": "n1_16" }, "children": [{ "id": "20", "t": "Notehead", "def": { "p": 6, "a": "" } }] }, { "id": "21", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 9, "den": 16 }, "noteId": "n1_16" }, "children": [{ "id": "22", "t": "Notehead", "def": { "p": 5, "a": "" } }] }, { "id": "23", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 5, "den": 8 }, "noteId": "n1_16" }, "children": [{ "id": "24", "t": "Notehead", "def": { "p": 4, "a": "" } }] }, { "id": "25", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 11, "den": 16 }, "noteId": "n1_16" }, "children": [{ "id": "26", "t": "Notehead", "def": { "p": 3, "a": "" } }] }, { "id": "27", "t": "Note", "def": { "time": { "num": 1, "den": 8 }, "abs": { "num": 3, "den": 4 }, "noteId": "n1_8", "dots": 1 }, "children": [{ "id": "28", "t": "Notehead", "def": { "p": 2, "a": "" } }] }, { "id": "29", "t": "Note", "def": { "time": { "num": 1, "den": 16 }, "abs": { "num": 15, "den": 16 }, "noteId": "n1_16" }, "children": [{ "id": "30", "t": "Notehead", "def": { "p": 2, "a": "" } }] }, { "id": "31", "t": "Note", "def": { "time": { "num": 1, "den": 4 }, "abs": { "num": 1, "den": 1 }, "noteId": "n1_4" }, "children": [{ "id": "32", "t": "Notehead", "def": { "p": 1, "a": "" } }] }] }, { "id": "33", "t": "Voice", "def": { "stem": 2 } }] }, { "id": "34", "t": "Staff", "children": [{ "id": "35", "t": "Clef", "def": { "abs": { "num": 0, "den": 1 }, "clef": 3, "lin": 2, "tr": 0 } }, { "id": "36", "t": "Meter", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "num": 4, "den": 4 } } }, { "id": "37", "t": "Key", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "acci": "x", "no": 2 } } }, { "id": "38", "t": "Sequence" }] }, { "id": "39", "t": "Meter", "def": { "abs": { "num": 0, "den": 1 }, "def": { "t": "Regular", "num": 4, "den": 4 } } }] };

describe("Staff logic", function () {
    var globalContext = new GlobalContext();
    var document: IScore;
    var controlManager: ControlElementManager;
    
    beforeEach(function () {
        VariableRef.register();
        document = new ScoreElement(null, globalContext);
    });

    describe("when a staff is added to an empty score", function () {
        var staff: IStaff;
        var absTime = new AbsoluteTime(25, 64);
        var absTimeHalf = new AbsoluteTime(25, 128);
        var absTimeHalfPlus = new AbsoluteTime(26, 128);
        var absTime1_5 = new AbsoluteTime(75, 128);

        var meterDef4_4 = new RegularMeterDefinition(4, 4);
        var meterDef5_2 = new RegularMeterDefinition(5, 2);
        var meterDef3_8 = new RegularMeterDefinition(3, 8);
        var meterDef7_16 = new RegularMeterDefinition(7, 16);


        beforeEach(function () {
            staff = document.addStaff(ClefDefinition.clefG);
            controlManager = new ControlElementManager(document, globalContext);
        });

        it("should return a getStaffContext(100) with a correct clef", function () {
            expect(staff.getStaffContext(absTime, globalContext).clef.clefCode).toEqual(ClefType.ClefG);
            staff.setClef(ClefDefinition.clefF, absTime1_5);
            expect(staff.getStaffContext(absTime, globalContext).clef.clefCode).toEqual(ClefType.ClefG);
            staff.setClef(ClefDefinition.clefF, absTimeHalf);
            expect(staff.getStaffContext(absTime, globalContext).clef.clefCode).toEqual(ClefType.ClefF);
        });

        it("should return a getStaffContext(100) with a correct key", function () {
            staff.setKey(new RegularKeyDefinition('', 0), AbsoluteTime.startTime);
            expect((staff.getStaffContext(absTime, globalContext).key).debug()).toEqual('0 ');
            staff.setKey(new RegularKeyDefinition('x', 2), absTime1_5);
            expect((staff.getStaffContext(absTime, globalContext).key).debug()).toEqual('0 ');
            staff.setKey(new RegularKeyDefinition('x', 2), absTimeHalf);
            expect((staff.getStaffContext(absTime, globalContext).key).debug()).toEqual('2 x');
        });

       /* it("should return a getStaffContext(100) with a correct meter", function () {
            document.setMeter(meterDef4_4, AbsoluteTime.startTime, globalContext);
            expect(staff.getStaffContext(absTime, globalContext).meter.debug()).toEqual('4/4');
            staff.setMeter(meterDef5_2, AbsoluteTime.startTime, globalContext);
            expect(staff.getStaffContext(absTime, globalContext).meter.debug()).toEqual('5/2');
            staff.setMeter(meterDef3_8, absTimeHalf, globalContext);
            expect(staff.getStaffContext(absTime, globalContext).meter.debug()).toEqual('3/8');
            document.setMeter(meterDef7_16, absTimeHalf, globalContext);
            expect(staff.getStaffContext(absTime, globalContext).meter.debug()).toEqual('3/8');
            document.setMeter(meterDef7_16, absTimeHalfPlus, globalContext);
            expect(staff.getStaffContext(absTime, globalContext).meter.debug()).toEqual('3/8');
            //(<any>staff).meterElements = <any>[];
            var meters = staff.getMeterElements(globalContext);
            for (var i = 0; i < meters.length; i++) staff.removeChild(meters[i].source);
            expect(staff.getStaffContext(absTime, globalContext).meter.debug()).toEqual('7/16');
        });*/

        it("should return the correct meter when score-owned meter changes are present", function () {
            document.setMeter(meterDef4_4, AbsoluteTime.startTime, globalContext);
            controlManager.invalidateRepository();
            expect(controlManager.getStaffContext(staff, absTime).meter.debug()).toEqual('4/4');
            
            document.setMeter(meterDef5_2, AbsoluteTime.startTime, globalContext);
            controlManager.invalidateRepository();
            expect(controlManager.getStaffContext(staff, absTime).meter.debug()).toEqual('5/2');
            
            document.setMeter(meterDef3_8, absTimeHalf, globalContext);
            controlManager.invalidateRepository();
            expect(controlManager.getStaffContext(staff, absTime).meter.debug()).toEqual('3/8');
            
            document.setMeter(meterDef7_16, absTimeHalf, globalContext);
            controlManager.invalidateRepository();
            expect(controlManager.getStaffContext(staff, absTime).meter.debug()).toEqual('7/16');
            
            document.setMeter(meterDef3_8, absTimeHalfPlus, globalContext);
            controlManager.invalidateRepository();
            expect(controlManager.getStaffContext(staff, absTime).meter.debug()).toEqual('3/8');
            
            /*var meters = staff.getMeterElements(globalContext);
            for (var i = 0; i < meters.length; i++) staff.removeChild(meters[i].source);
            expect(staff.getStaffContext(absTime, globalContext).meter.debug()).toEqual('7/16');*/

        });
        it("should return the correct meter when staff-owned meter changes are present", function () {            
            staff.setMeter(meterDef5_2, AbsoluteTime.startTime, globalContext);
            controlManager.invalidateRepository();
            expect(controlManager.getStaffContext(staff, absTime).meter.debug()).toEqual('5/2');
            
            staff.setMeter(meterDef3_8, absTimeHalf, globalContext);
            controlManager.invalidateRepository();
            expect(controlManager.getStaffContext(staff, absTime).meter.debug()).toEqual('3/8');
        });
        it("should return the correct meter on other staves when sequence-owned meter changes are present", function () {});
        it("should return the correct meter when sequence-owned meter changes are present", function () {});
        it("should return the correct meter when score-owned and sequence-owned meter changes are present", function () {
            /*document.setMeter(meterDef4_4, AbsoluteTime.startTime, globalContext);
            controlManager.invalidateRepository();
            expect(controlManager.getStaffContext(staff, absTime).meter.debug()).toEqual('4/4');
            
            staff.setMeter(meterDef5_2, AbsoluteTime.startTime, globalContext);
            controlManager.invalidateRepository();
            expect(controlManager.getStaffContext(staff, absTime).meter.debug()).toEqual('5/2');
            
            staff.setMeter(meterDef3_8, absTimeHalf, globalContext);
            controlManager.invalidateRepository();
            expect(controlManager.getStaffContext(staff, absTime).meter.debug()).toEqual('3/8');
            
            // todo: staff/score override?
            document.setMeter(meterDef7_16, absTimeHalf, globalContext);
            controlManager.invalidateRepository();
            expect(controlManager.getStaffContext(staff, absTime).meter.debug()).toEqual('3/8');
            
            document.setMeter(meterDef7_16, absTimeHalfPlus, globalContext);
            controlManager.invalidateRepository();
            expect(controlManager.getStaffContext(staff, absTime).meter.debug()).toEqual('3/8');
            */
        });
        it("should return the correct meter when sequence-owned meters are present on multiple staves", function () {});
        it("should return the correct meter when sequence-owned meters are present in multiple instances", function () {});
        it("should return the correct meter when no meter is present", function () {});

        it("should return the correct key when score-owned key changes are present", function () {});
        it("should return the correct key when staff-owned key changes are present", function () {});
        it("should return the correct key on other staves when sequence-owned key changes are present", function () {});
        it("should return the correct key when sequence-owned key changes are present", function () {});
        it("should return the correct key when score-owned and sequence-owned key changes are present", function () {});
        it("should return the correct key when sequence-owned keys are present on multiple staves", function () {});
        it("should return the correct key when sequence-owned keys are present in multiple instances", function () {});
        it("should return the correct key when no key is present", function () {});

        it("should return the correct clef when score-owned clef changes are present", function () {});
        it("should return the correct clef when staff-owned clef changes are present", function () {});
        it("should return the correct clef on other staves when sequence-owned clef changes are present", function () {});
        it("should return the correct clef when sequence-owned clef changes are present", function () {});
        it("should return the correct clef when score-owned and sequence-owned clef changes are present", function () {});
        it("should return the correct clef when sequence-owned clefs are present on multiple staves", function () {});
        it("should return the correct clef when sequence-owned clefs are present in multiple instances", function () {});
        it("should return the correct clef when no clef is present", function () {});
  
    });

});