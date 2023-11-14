import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from '../messages/schemas/message.schema';
import { EventsGateway } from './events.gateway';
import { MessagesService } from 'src/messages/messages.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  providers: [MessagesService, EventsGateway],
})
export class EventsModule {}
