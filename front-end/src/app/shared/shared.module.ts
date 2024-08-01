import { NgModule } from '@angular/core';

import { DropdownDirective } from './directives/dropdown.directive';
import { SpecialtyPipe } from './pipes/specialty.pipe';
import { TypePipe } from './pipes/type.pipe';
import { ViewedPipe } from './pipes/viewed.pipe';

@NgModule({
  declarations: [DropdownDirective, SpecialtyPipe, ViewedPipe, TypePipe],
  imports: [],
  exports: [DropdownDirective, SpecialtyPipe, ViewedPipe, TypePipe],
})
export class SharedModule {}
