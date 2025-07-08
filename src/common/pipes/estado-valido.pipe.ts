import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class EstadoValidoPipe implements PipeTransform {
  readonly estadosValidos = [
    'pending',
    'review_payment',
    'approved',
    'rejected',
    'refund_in_transit',
    'in_transit',
    'discrepancy',
    'canceled',
    'modified',
    'refunded',
    'completed',
  ];

  transform(value: any) {
    if (!this.estadosValidos.includes(value)) {
      throw new BadRequestException(`Estado no válido: ${value}`);
    }
    return value;
  }
}
