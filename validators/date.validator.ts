import { AbstractControl } from '@angular/forms';

export class DateValidator {
  static validate(control: AbstractControl): { [key: string]: any } {
    if (this.customDateValidate(control.value)) {
      return null as any;
    }
    return { date: true };
  }

  static customDateValidate(date: any): boolean {

    if (date && typeof date === 'string') {
      let match = date.match(
        /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|(([1][26]|[2468][048]|[3579][26])00))))$/
      );
      if (!match) {
        return false;
      } else if (match && match[0] !== date) {
        return false;
      }
    }
    return true;
  }
}
