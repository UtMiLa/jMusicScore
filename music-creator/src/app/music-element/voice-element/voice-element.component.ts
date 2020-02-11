import { Component, OnInit, Input } from '@angular/core';
import { IVoice } from '../../../../../jMusic/simple-model/jm-simple-model-interfaces';
import { ISelectionInterface, SelectionService, ElementKind } from '../selection.service';
import { SelectableElementComponent } from '../selectable-element/selectable-element.component';

@Component({
  selector: 'app-voice-element',
  templateUrl: './voice-element.component.html',
  styleUrls: ['./voice-element.component.scss']
})
export class VoiceElementComponent extends SelectableElementComponent implements OnInit {

  constructor(protected selectionService: SelectionService) {
    super(selectionService);
   }

  @Input()
  element: IVoice & ISelectionInterface;

  getKind(): ElementKind {
    return ElementKind.Note;
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
