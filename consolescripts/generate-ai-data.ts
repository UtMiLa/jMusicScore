import { Pitch, Interval } from '../jMusic/jm-base';


/*

for (let i = -14; i < 5; i++){
    for (let accI = -2; accI <= 2; accI++) {
        let pitch1 = new Pitch(i, Pitch.intToStr(accI));
        for (let j = -14; j < 5; j++){
            for (let accJ = -2; accJ <= 2; accJ++) {
                let pitch2 = new Pitch(j, Pitch.intToStr(accJ));
                let interval = Interval.fromPitches(pitch1, pitch2);
                console.log(pitch1.pitch, Pitch.strToInt(pitch1.alteration), pitch2.pitch, Pitch.strToInt(pitch2.alteration), interval.length, interval.alteration, interval.semitones());
            }
        }
    }
}

*/

function getRandVal(values: number[], weights: number[]){
    let sumWeight = 0;
    for (let i = 0; i < weights.length; i++) sumWeight += weights[i];
    let randie = Math.random() * sumWeight;
    for (let i = 0; i < weights.length; i++) {
        randie -= weights[i];
        if ( randie <= 0) return values[i];
    }
    return values[values.length - 1];
}

for (let i = 0; i < 10000; i++){
    let acc1 = getRandVal([-2, 2, -1, 1, 0], [0.05, 0.05, 0.3, 0.3, 0.3]);
    let acc2 = getRandVal([-2, 2, -1, 1, 0], [0.05, 0.05, 0.3, 0.3, 0.3]);
    let p1 = Math.round(49*Math.random() - 14);
    let p2 = Math.round(49*Math.random() - 14);
    let pitch1 = new Pitch(p1, Pitch.intToStr(acc1));
    let pitch2 = new Pitch(p2, Pitch.intToStr(acc2));
    let interval = Interval.fromPitches(pitch1, pitch2);
    let semitones = interval.semitones();
    let inverted = (semitones < 0) ? -1 : 1;
    if (semitones < 0) interval = interval.inverted();
    console.log(pitch1.pitch, Pitch.strToInt(pitch1.alteration), pitch2.pitch, Pitch.strToInt(pitch2.alteration), interval.length, interval.alteration, semitones, inverted);
}