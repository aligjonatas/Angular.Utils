import { AbstractControl } from '@angular/forms';

export class LegalAgeValidator {
  static validate(control: AbstractControl): { [key: string]: any } {
    if (this.legalAgeValidate(control.value)) {
      return null as any;
    }
    return { legal_age: true };
  }

  static legalAgeValidate(age: any): boolean {
    if (age && typeof age === 'string') {
      var timeDiff = Math.abs(Date.now() - new Date(age).getTime());
      age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);

      if (age < 18) {
        return false;
      } else return true;
    }
    return true;
  }
}
