import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { IVarList } from '../datamodel/model';

@Component({
  selector: 'app-var-list',
  templateUrl: './var-list.component.html',
  styleUrls: ['./var-list.component.css']
})
export class VarListComponent implements OnInit {

  constructor() {

  }

  varlist: {key: string, value: string, selected: boolean}[];


  _varObject: IVarList;


  @Input()
  set varObject(varObject: IVarList) {
    console.log(varObject);
    this._varObject = varObject;
    this.setVarList();
  }

  get varObject(): IVarList {
    return this._varObject;
  }



  @Input()
  title = 'Variable';

  @Output() selectedRef = new EventEmitter<any>();

  addVar(newVar: HTMLInputElement) {
    const varName = newVar.value;
    if (this.varObject[varName]) {
      alert(varName + ' findes i forvejen');
      return;
    }

    this.varObject[varName] = '{}';
    this.select(null);
    this.varlist.push({key: varName, value: '{}', selected: true});

    newVar.value = '';
  }

  // @Input()
  // varType: string = "variables";

  ngOnInit() {
    // this.varObject=this.musicProvider.getVariables(this.varType);
    // this.setVarList();
  }

  select(variable) {
    // console.log(variable);
    for (let i = 0; i < this.varlist.length; i++) {
      this.varlist[i].selected = false;
    }
    if (!variable) { return; }
    variable.selected = true;
    this.selectedRef.emit({parent: this._varObject, name: variable.key });
  }

  setVarList() {
    const a = [];
    for (const key in this.varObject) {
      if (this.varObject.hasOwnProperty(key)) {
        a.push({key: key, value: this.varObject[key], selected: false});
      }
    }
    this.varlist = a;
  }
}
