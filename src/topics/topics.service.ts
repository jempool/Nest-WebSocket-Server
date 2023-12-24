import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Topic } from './schemas/topic.schema';

@Injectable()
export class TopicsService {
  constructor(@InjectModel(Topic.name) private topicModel: Model<Topic>) {}

  async findTodaysTopic(): Promise<Topic> {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const topic = await this.topicModel
      .findOne({ forDate: { $gte: today } })
      .exec();
    return topic;
  }
}
