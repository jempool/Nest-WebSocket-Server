import { Controller, Get, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('chat') // 'messages'
export class MessagesController {
  constructor(private messagesService: MessagesService) {}
  @UseGuards(AuthGuard)
  @Get('history')
  findAll() {
    return this.messagesService.findAll();
  }
}
