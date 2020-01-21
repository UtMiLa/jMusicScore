import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseBlockComponent } from './base-block/base-block.component';

@NgModule({
  declarations: [BaseBlockComponent],
  imports: [
    CommonModule
  ],
  exports: [BaseBlockComponent]
})
export class ElementBlocksModule { }
