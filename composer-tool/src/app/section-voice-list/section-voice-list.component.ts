import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { IModel, IVarList, ISectionsDef, ISectionDef } from '../datamodel/model';

@Component({
  selector: 'app-section-voice-list',
  templateUrl: './section-voice-list.component.html',
  styleUrls: ['./section-voice-list.component.css']
})
export class SectionVoiceListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input() model: IModel;

  selectedVar: IVarList;

  selectSection(section){
    if (section){
      this.selectedVar = this.model.sections[section].voices;
    }
    else {
      this.selectedVar = undefined;
    }
    console.log(this.selectedVar);
  }

  selectRef($event){
    this.selectedRef.emit($event);
  }

  createMissing(){
    var changed = false;
    console.log("createMissing");
    var data: IModel = this.model;
    console.log(data.voices.sections);
    console.log(data.voices.voices);
    for(var j = 0; j < data.voices.sections.length; j++) {
        var section = data.voices.sections[j];
        if (!data.sections[section]){
            data.sections[section] = {voices: {}};
            console.log(section);
            changed = true;
        }
        var theSection = data.sections[section];
        for(var i = 0; i < data.voices.voices.length; i++) {
            var voice = data.voices.voices[i];
            if (!theSection.voices[voice + section]){
                theSection.voices[voice + section] = "{ }";
                console.log(voice + section);
                changed = true;
            }
        }
    }
    if (changed) console.log(JSON.stringify(data));

  }

  @Output() selectedRef = new EventEmitter<any>();

}
