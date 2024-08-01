import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'viewed',
})
export class ViewedPipe implements PipeTransform {
  transform(value: any) {
    if(value === 'true') {
      return 'Văzut';
    } else {
      return 'Nevăzut';
    }
  }
}
