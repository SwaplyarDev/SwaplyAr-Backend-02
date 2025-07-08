import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class UpdateReceiverFieldsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const {
      bankName,
      sendMethodKey,
      sendMethodValue,
      documentType,
      documentValue,
      currency,
    } = req.body;
    if (
      !bankName &&
      !sendMethodKey &&
      !sendMethodValue &&
      !documentType &&
      !documentValue &&
      !currency
    ) {
      throw new BadRequestException(
        'Debes enviar al menos uno de los campos: bankName, sendMethodKey, sendMethodValue, documentType, documentValue o currency',
      );
    }
    next();
  }
}
