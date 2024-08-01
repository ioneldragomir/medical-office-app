import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'type',
})
export class TypePipe implements PipeTransform {
  transform(value: any) {
    if(value === 'doctor') {
      return 'Medic';
    } else if (value === 'admin'){
      return 'Admin';
    } else {
      return 'Recepționist';
    }
  }
}
