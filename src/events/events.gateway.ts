import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('chat')
  handleChatEvent(@MessageBody() data: any): void {
    this.server.emit('chat', data);
  }

  @SubscribeMessage('typing')
  handleTypingEvent(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): void {
    this.server.emit('typing', data);
    client.broadcast.emit('typing', data);
  }

  handleConnection(@ConnectedSocket() client: any) {
    console.log(`${new Date()} - New connection ${client.id}`);
  }
}
