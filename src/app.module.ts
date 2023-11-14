import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { DATABASE_URL, DATABASE_NAME } from './config/constants';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    EventsModule,
    MongooseModule.forRoot(`${DATABASE_URL}/${DATABASE_NAME}`),
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
