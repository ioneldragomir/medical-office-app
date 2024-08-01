import { Pipe, PipeTransform } from '@angular/core';
import { specialties } from 'src/app/core/constants/specialties';

@Pipe({
  name: 'specialty',
})
export class SpecialtyPipe implements PipeTransform {
  transform(value: any) {
    let convertedSpecialty = value;

    specialties.forEach( s => {
      if(value === s.code) {
        convertedSpecialty = s.name;
      }
    })
    
    return convertedSpecialty;
  }
}
