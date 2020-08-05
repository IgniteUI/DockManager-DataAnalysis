import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterType'
})
export class FilterTypePipe implements PipeTransform {
  public transform(collection: string[], type: string): string[] {
      return collection.filter(types => types.indexOf(type) !== -1 && types.indexOf(type, type.length - 1) === -1);
    }
}
