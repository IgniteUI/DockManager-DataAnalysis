import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: "name"
})
export class NamePipe implements PipeTransform {
  public transform(name: string): string {
      let res = "";
      const upperCaseChars = name.match(/[A-Z0-9]{1,}/g);
      for (let index = 0; index < upperCaseChars.length; index++) {
        if (!(index === upperCaseChars.length - 1)) {
          res += name.substring(name.indexOf(upperCaseChars[index]),
            name.indexOf(upperCaseChars[index + 1])) + " ";
        } else {
          res += name.substring(name.indexOf(upperCaseChars[index]));
        }
      }
      return res;
    }
}

