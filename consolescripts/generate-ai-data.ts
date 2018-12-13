import { Pitch, Interval } from '../jMusic/jm-base';




for (let i = -14; i < 35; i++){
    for (let accI = -2; accI <= 2; accI++) {
        let pitch1 = new Pitch(i, Pitch.intToStr(accI));
        for (let j = -14; j < 35; j++){
            for (let accJ = -2; accJ <= 2; accJ++) {
                let pitch2 = new Pitch(j, Pitch.intToStr(accJ));
                let interval = Interval.fromPitches(pitch1, pitch2);
                console.log(pitch1.debug(), pitch2.debug(), interval.toString());
            }
        }
    }
}