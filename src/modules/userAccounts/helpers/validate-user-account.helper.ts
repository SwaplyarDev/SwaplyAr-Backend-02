import { BadRequestException } from '@nestjs/common';

export function validateUserAccount(userAccValues: any) {
  if (
    !userAccValues.first_name ||
    !userAccValues.last_name ||
    !userAccValues.identification ||
    !userAccValues.currency ||
    !userAccValues.account_name ||
    userAccValues.account_type === undefined ||
    userAccValues.account_type === null
  ) {
    throw new BadRequestException('Missing required fields.');
  }
}
