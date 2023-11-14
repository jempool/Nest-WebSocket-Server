import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateMessageDto } from '../dto/create-message.dto';
import { MessagesService } from './messages.service';

@Controller('chat') // 'messages'
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post()
  async create(@Body() createMessageDto: CreateMessageDto) {
    this.messagesService.create(createMessageDto);
  }

  @Get('history')
  findAll() {
    return this.messagesService.findAll();
  }
}
