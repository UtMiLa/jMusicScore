import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MusicProviderService } from '../music-provider.service';
import { IModel } from '../datamodel/model';
/*import { ExampleEnum } from '../data/enum';
import { formatDate } from '../service/utils';*/

@Component({
  selector: 'app-page-sections',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page-sections.component.html',
  styleUrls: ['./page-sections.component.css']
})
export class PageSectionsComponent implements OnInit {

  constructor(private musicProvider: MusicProviderService) { }

  model: IModel;

  ngOnInit() {
    this.model = this.musicProvider.constRes;
  }

  testChangeDetectorRun() {
    console.log(`${ new Date() } > AComponent.ts - Change detection just run!`);

    return '';
  }
}
