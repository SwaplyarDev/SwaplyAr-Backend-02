import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TransactionStatusFieldsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const status = req.params.status;
    const body = req.body;
    switch (status) {
      case 'review_payment':
        if (!body.review) {
          throw new BadRequestException(
            'Se requiere código de transferencia para el estado review_payment',
          );
        }
        break;
      case 'discrepancy':
        if (!body.descripcion) {
          throw new BadRequestException(
            'Se requiere descripción de la discrepancia',
          );
        }
        break;
      case 'canceled':
        if (!body.descripcion) {
          throw new BadRequestException('Se requiere motivo de cancelación');
        }
        break;
      case 'modified':
        if (!body.descripcion) {
          throw new BadRequestException(
            'Se requiere descripción de la modificación',
          );
        }
        break;
      case 'refunded':
        if (!body.codigo_transferencia) {
          throw new BadRequestException(
            'Se requiere código de transferencia de reembolso',
          );
        }
        break;
      default:
        break;
    }
    next();
  }
}
