import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class UpdateReceiverFieldsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { bank_name, sender_method_value, document_value } = req.body;
    if (!bank_name && !sender_method_value && !document_value) {
      throw new BadRequestException('Debes enviar al menos uno de los campos: bank_name, sender_method_value o document_value');
    }
    next();
  }
} 