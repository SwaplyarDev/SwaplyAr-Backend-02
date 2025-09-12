import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function IsPhoneNumberValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPhoneNumberValid',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return true; // si el campo es opcional, permitir vacío
          if (typeof value !== 'string') return false;

          // Debe empezar con "+" para que sea internacional
          if (!value.startsWith('+')) return false;

          try {
            const phoneNumber = parsePhoneNumberFromString(value.trim());
            // Validar solo si parsea correctamente
            return !!phoneNumber && phoneNumber.isValid();
          } catch {
            return false; // cualquier error se considera inválido
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `El número "${args.value}" no es válido. Debe estar en formato internacional (+<código_pais><numero>).`;
        },
      },
    });
  };
}
