import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Topic } from './schemas/topic.schema';

@Injectable()
export class TopicsService {
  constructor(@InjectModel(Topic.name) private topicModel: Model<Topic>) {}

  async findAll(): Promise<Topic[]> {
    return this.topicModel.find().exec();
  }

  async findTodaysTopic(): Promise<Topic> {
    const topics = await this.topicModel.find().exec();
    const today = new Date().getDay();
    return { topic: topics[today].topic };
  }
}
