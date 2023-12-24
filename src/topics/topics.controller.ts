import { Controller, Get, UseGuards } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @UseGuards(AuthGuard)
  @Get('today')
  findTodaysTopic() {
    return this.topicsService.findTodaysTopic();
  }
}
