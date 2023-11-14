import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('chat') // 'messages'
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post()
  async create(@Body() createMessageDto: CreateMessageDto) {
    this.messagesService.create(createMessageDto);
  }

  @UseGuards(AuthGuard)
  @Get('history')
  findAll() {
    return this.messagesService.findAll();
  }
}
