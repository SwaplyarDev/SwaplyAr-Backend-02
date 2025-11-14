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
export class CommissionsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger = new Logger('CommissionsGateway');

  afterInit() {
    this.logger.log('WebSocket Gateway para Commissions inicializado');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('ping-commissions')
  handlePing(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    this.logger.log(`Ping recibido (commissions): ${JSON.stringify(data)}`);
    client.emit('pong-commissions', {
      msg: 'pong desde commissions gateway',
      received: data,
    });
  }

  sendCommissionUpdate(update: any) {
    this.server.emit('commission-update', update);
    this.logger.log(`Se emitió commission-update: ${JSON.stringify(update)}`);
  }
}




