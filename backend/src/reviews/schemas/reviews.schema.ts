import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number; // 1–5 stars

  @Prop({ required: true })
  comment: string;

  @Prop({ type: Types.ObjectId, ref: 'Order', required: false })
  orderId?: Types.ObjectId; // optional link to order

  @Prop({
    default: 'pending',
    enum: ['pending', 'approved', 'rejected'],
  })
  status: string; // moderation system
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
