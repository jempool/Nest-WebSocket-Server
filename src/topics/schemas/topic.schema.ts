import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TopicDocument = HydratedDocument<Topic>;

@Schema()
export class Topic {
  @Prop({ required: true })
  topic: string;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
