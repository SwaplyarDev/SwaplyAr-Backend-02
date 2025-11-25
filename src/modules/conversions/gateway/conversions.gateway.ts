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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ConversionsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger('ConversionsGateway');

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
  handlePing(@ConnectedSocket() client: Socket, @MessageBody() data: any): void {
    this.logger.log(`Ping recibido (conversions): ${JSON.stringify(data)}`);
    client.emit('pong-conversions', {
      msg: 'pong desde conversions gateway',
      received: data,
    });
  }

  sendConversionUpdate(update: any) {
    this.server.emit('conversion-update', update);
    this.logger.log(`Se emitió conversion-update: ${JSON.stringify(update)}`);
  }
}
