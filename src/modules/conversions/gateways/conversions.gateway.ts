

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ConversionsService } from '../services/conversions.service';
import { ConversionTotalRequestDto } from '../dto/conversions-total-request.dto';
import { CommissionsService } from '../commissions/services/commissions.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ConversionsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger = new Logger('ConversionsGateway');

  constructor(
    private readonly conversionsService: ConversionsService,
    private readonly commissionsService: CommissionsService,
  ) {}

  afterInit() {
    this.logger.log('WebSocket Gateway para Conversions inicializado');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('ping-conversions')
  handlePing(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    this.logger.log(`Ping recibido (conversions): ${JSON.stringify(data)}`);
    client.emit('pong-conversions', {
      msg: 'pong desde conversions gateway',
      received: data,
    });
  }

  @SubscribeMessage('calculateTotal')
  async handleCalculateTotal(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: ConversionTotalRequestDto,
  ): Promise<void> {
    try {
      this.logger.log(`Cálculo solicitado: ${JSON.stringify(dto)}`);

      const isToArs = dto.to === 'ARS' && (dto.from === 'USD' || dto.from === 'EUR');
      const isFromArs = dto.from === 'ARS' && ['USD', 'EUR', 'BRL'].includes(dto.to);

      let conversion;

      if (isToArs) {
        conversion = await this.conversionsService.convertArs({
          amount: dto.amount,
          from: dto.from,
          to: dto.to,
        });
      } else if (isFromArs) {
        conversion = await this.conversionsService.convertArsIndirect({
          amount: dto.amount,
          from: dto.from,
          to: dto.to,
        });
      } else {
        conversion = await this.conversionsService.convert({
          amount: dto.amount,
          from: dto.from,
          to: dto.to,
        });
      }

      const commissionResult = await this.commissionsService.calculateCommissionWithCurrencyCheck(
        conversion.convertedAmount,
        dto.fromPlatform,
        dto.toPlatform,
        dto.from,
        dto.to,
      );

      if (!commissionResult.valid) {
        throw new Error(
          `No se encontró comisión válida para ${dto.fromPlatform} → ${dto.toPlatform} (${dto.from} → ${dto.to}).`,
        );
      }

      const commission = commissionResult.data!;
      const totalReceived = commission.finalAmount;

      this.server.emit('rate-update', {
        from: dto.from,
        to: dto.to,
        rate: conversion.rateUsed,
        updatedAt: new Date().toISOString(),
      });

      this.server.emit('commission-update', {
        fromPlatform: dto.fromPlatform,
        toPlatform: dto.toPlatform,
        commissionRate: commission.commissionRate,
        updatedAt: new Date().toISOString(),
      });

      client.emit('calculationResult', {
        ...conversion,
        commission,
        totalReceived,
        fromPlatform: dto.fromPlatform,
        toPlatform: dto.toPlatform,
        message: 'Conversión y comisión calculadas correctamente (actualizaciones emitidas).',
      });

      this.logger.log(
        `Conversión completada correctamente y actualizaciones emitidas (cliente: ${client.id})`,
      );
    } catch (error) {
      this.logger.error(`Error en cálculo: ${error.message}`);
      client.emit('calculationError', { message: error.message });
    }
  }

  sendConversionUpdate(update: any) {
    this.server.emit('conversion-update', update);
    this.logger.log(`Se emitió conversion-update: ${JSON.stringify(update)}`);
  }
}

















