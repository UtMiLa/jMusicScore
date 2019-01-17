import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ScoreStatusManager } from '../../../../jMusic/jm-application';
import { Pitch } from '../../../../jMusic/jm-music-basics';

@Component({
  selector: 'app-piano-ctl',
  templateUrl: './piano-ctl.component.html',
  styleUrls: ['./piano-ctl.component.scss']
})
export class PianoCtlComponent implements OnInit {

  constructor() { }

  items = [];
  tgWidth = 40;

  ngOnInit() {
    const tgSpacing = this.tgWidth * 7 / 12;
      for (let i = 21; i < 109; i++) {
        const det = ((i + 7) * 7) % 12;
        const className = 'bw' + det;
        const left = (det < 7) ? (i - 21 - det / 7) * tgSpacing : (i - 21 - (det - 8) / 7) * tgSpacing;
        const bw = det >= 7 ? 'bw-black' : 'bw-white';

      this.items.push({det, className, left: left + 'px', bw, i});
    }
  }


  @Input() status: ScoreStatusManager;
  @Output() eventEmitterClick = new EventEmitter();

  upDown(item){
    const up = !this.status.notesPressed.some((value) => {return item.i == value.toMidi();} );
    return up ? "up" : "down";
  }
  eventEmitClick(event, i:number) {
    this.status.pressNoteKey(new Pitch(i, ""));
    this.eventEmitterClick.emit(event);
  }

  notePressed(i: number) {/*
  .on('mousedown touchstart', function (event: JQueryEventObject) {
    var $obj = $(this);
    $obj.data('timer', 1);
    $obj.data('downX', $obj.position().left);

    var origEvent: any = event.originalEvent;
    if (origEvent.targetTouches && origEvent.targetTouches.length === 1) {
        var touch = origEvent.targetTouches[0];
        $obj.data('downX', $obj.position().left + touch.clientX);
    }
    var p = $(this).attr('id').replace('tast', '');

    setTimeout(function (p: string) {
        var timer = $obj.data('timer');
        if (timer) {
            //var ev = new Event("midinoteon");
            //(<any>ev).noteInt = parseInt(p);
            app.processEvent("midinoteon", { noteInt: parseInt(p) });
        }
    }, 50, p);
    origEvent.preventDefault();
  })
     */
    this.status.pressNoteKey(Pitch.createFromMidi(i));
  }
  noteReleased(i: number) {
    /*
  .on('mouseup touchend', function (ev: JQueryEventObject) {
    var p = $(this).attr('id').replace('tast', '');
    //ev.type = "midinoteoff";
    //(<any>ev).noteInt = parseInt(p);
    app.processEvent("midinoteoff", { noteInt: parseInt(p) });
    event.preventDefault();
  })
    */
    this.status.releaseNoteKey(Pitch.createFromMidi(i));
  }
/*
public changed(status: Application.IStatusManager, key: string, val: any) {
    if (key === "pressKey") {
        $('#tast' + (<Model.Pitch>val).toMidi()).addClass('down');
        //$('.staffTitleArea:first').text('#tast' + (<Model.Pitch>val).toMidi());
    }
    else if (key === "releaseKey") {
        $('#tast' + (<Model.Pitch>val).toMidi()).removeClass('down');
        //$('.staffTitleArea:last').text('#tast' + (<Model.Pitch>val).toMidi());
    }
}
*/
}
