

import {

  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,

} from 'class-validator';

@ValidatorConstraint ({ name: 'ExclusiveCodeOrCodeId', async: false })

export class ExclusiveCodeOrCodeIdConstraint implements ValidatorConstraintInterface {

  validate (_: any, args: ValidationArguments): boolean {

    const { codeId, code } = args.object as any;
    return (!!codeId || !!code) && !(codeId && code);

  }

  defaultMessage (_: ValidationArguments): string {

    return 'Debe especificar codeId o code, pero no ambos';

  }

}

export function ExclusiveCodeOrCodeId (validationOptions?: ValidationOptions) {

  return function (constructor: Function) {

    registerDecorator ({

      name: 'ExclusiveCodeOrCodeId',
      target: constructor,
      propertyName: undefined!, 
      options: validationOptions,
      validator: ExclusiveCodeOrCodeIdConstraint,

    });

  };

}
