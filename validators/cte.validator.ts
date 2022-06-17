import { CnpjValidator } from './cnpj.validator';
import { AbstractControl, ValidatorFn } from '@angular/forms';

namespace CTeValidator {
  export interface ValidMessage {
    Valid: boolean;
    Message: string;
  }
}

export class CTeValidator {
  static validate(control: AbstractControl): ValidatorFn | { [key: string]: any } {
    let result = this.cteValido(control.value);
    if (result?.Valid) {
      return null as any;
    }
    return { accesskeyValidator: result?.Message };
  }

  static cteValido(accesskey: any): CTeValidator.ValidMessage | undefined {
    let validMessage: CTeValidator.ValidMessage = {} as CTeValidator.ValidMessage;
    validMessage.Valid = true;

    accesskey = !accesskey || accesskey.replace(/\D/g, '');
    if (!accesskey || accesskey.length !== 44) {
      validMessage.Valid = false;
      validMessage.Message = 'Chave de acesso inválida';
      return validMessage;
    }

    // se os digitos 20 e 21 não formarem 57 e nem 67 (modelos de CTE), então não é válido, retorna FALSE
    if (accesskey.substring(20, 22) != '57' && accesskey.substring(20, 22) != '67') {
      validMessage.Valid = false;
      validMessage.Message = 'Documento não é um CT-e';
      return validMessage;
    }

    let hasErrors = false;
    var codeParts: string[] = [];

    codeParts[0] = accesskey.substring(0, 2); // cUF
    codeParts[1] = accesskey.substring(2, 4); // Ano
    codeParts[2] = accesskey.substring(4, 6); // Mês
    codeParts[3] = accesskey.substring(6, 20); // CNPJ
    codeParts[4] = accesskey.substring(20, 22); // Modelo
    codeParts[5] = accesskey.substring(34, 35); // Forma Emissão
    codeParts[6] = accesskey.substring(43, 44); // DV

    // Validando Unidade Federativa
    if (!CTeValidator.ValidateUFCode(codeParts[0])) {
      codeParts[0] = '[' + codeParts[0] + ']';
      hasErrors = true;
    }

    // Validando Mês
    let month = 0;
    month = Number(codeParts[2]);
    if (month < 1 || month > 12) {
      codeParts[2] = '[' + codeParts[2] + ']';
      hasErrors = true;
    }

    // Validando CNPJ
    if (!CnpjValidator.cnpjValido(codeParts[3])) {
      codeParts[3] = '[' + codeParts[3] + ']';
      hasErrors = true;
    }

    if (hasErrors) {
      validMessage.Valid = false;
      validMessage.Message = `Chave inválida, verifique a parte incorreta: ${codeParts[0]}${codeParts[1]}${codeParts[2]}${codeParts[3]}${accesskey.substring(20, 44)}`;
      return validMessage;
    } else {
      // Validando dígito verificador
      var digit = CTeValidator.CheckDigit(accesskey.substring(0, accesskey.length - 1));
      if (digit != codeParts[6]) {
        validMessage.Valid = false;
        validMessage.Message = 'Dígito Verificador inválido';
      }
    }

    return validMessage;
  }

  static ValidateUFCode(ufCode: string): boolean {
    let ufCodes: Array<number> = [
      11, 12, 13, 14, 15, 16, 17, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31, 32,
      33, 35, 41, 42, 43, 50, 51, 52, 53,
    ];

    if (ufCodes.includes(Number(ufCode))) {
      return true;
    } else {
      return false;
    }
  }

  static CheckDigit(key: string): string {
    let fields = [2, 3, 4, 5, 6, 7, 8, 9];
    var fieldsCalc = [];
    var total = 0;

    var iFields = 0;

    for (let i = key.length - 1; i >= 0; i--)
    {
        if (iFields > 7)
            iFields = 0;

        fieldsCalc[i] = Number(key[i].toString()) * fields[iFields];
        iFields++;
    }

    for (let i = 0; i < fieldsCalc.length; i++) {
      total += fieldsCalc[i];
    }

    total = total % 11;

    if (total == 0 || total == 1) {
      return '0';
    } else {
      total = 11 - total;
      return total.toString();
    }
  }
}
