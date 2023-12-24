import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from '../messages/dto/create-message.dto';
import { MessagesService } from '../messages/messages.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  constructor(private messagesService: MessagesService) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('chat')
  handleChatEvent(@MessageBody() message: CreateMessageDto): void {
    this.messagesService.create(message);
    this.server.emit('chat', message);
  }

  @SubscribeMessage('typing')
  handleTypingEvent(
    @MessageBody() message: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ): void {
    this.server.emit('typing', message);
    client.broadcast.emit('typing', message);
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`${new Date()} - New connection ${client.id}`);
  }
}
