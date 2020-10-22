import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'removewhitespaces'
})
export class RemovewhitespacesPipe implements PipeTransform {
  transform(value: any): any {
    if (value === undefined)
      return 'undefined';
    //return value.replace(/\s/g, "-");
    return value.replace(/[\W_]/g, '-');
  }
}
