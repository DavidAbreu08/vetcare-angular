import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function nifValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const nif = control.value;

    if (!nif) return null; // Permite campo vazio

    if (!/^\d{9}$/.test(nif)) {
      return { invalidNIF: 'O NIF deve ter exatamente 9 dígitos numéricos' };
    }

    const validPrefixes = [1, 2, 3, 5, 6, 7, 8, 9];
    const firstDigit = parseInt(nif[0], 10);

    if (!validPrefixes.includes(firstDigit)) {
      return { invalidNIF: 'O NIF tem um prefixo inválido' };
    }

    // Cálculo do dígito de controlo
    let total = 0;
    for (let i = 0; i < 8; i++) {
      total += parseInt(nif[i], 10) * (9 - i);
    }

    const checkDigit = 11 - (total % 11);
    const validCheckDigit = checkDigit >= 10 ? 0 : checkDigit;

    if (validCheckDigit !== parseInt(nif[8], 10)) {
      return { invalidNIF: 'O NIF é inválido' };
    }

    return null;
  };
}