import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { IVarList, ISectionsDef, ISectionDef } from '../datamodel/model';

@Component({
  selector: 'app-section-voice-list',
  templateUrl: './section-voice-list.component.html',
  styleUrls: ['./section-voice-list.component.css']
})
export class SectionVoiceListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input() model: ISectionsDef;

  selectedVar: IVarList;

  selectSection(section){
    if (section){
      this.selectedVar = this.model[section].voices;
    }
    else {
      this.selectedVar = undefined;
    }
    console.log(this.selectedVar);
  }

  selectRef($event){
    this.selectedRef.emit($event);
  }

  @Output() selectedRef = new EventEmitter<any>();

}
