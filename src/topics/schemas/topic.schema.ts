import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TopicDocument = HydratedDocument<Topic>;

@Schema()
export class Topic {
  @Prop({ required: true })
  topic: string;
  @Prop({ required: true })
  forDate: Date;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
