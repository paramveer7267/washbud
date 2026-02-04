import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, index: true, unique: true })
  orderId: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  weightCategory: string; // e.g., light(0-7kg) / medium(8-14kg) / heavy(15-25kg+)

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  service: string; // iron / dry-clean / premium-detergent / main wash-and-dry

  @Prop({ required: true })
  pickup: string;

  @Prop({ required: true })
  dropoff: string;

  @Prop({
    required: true,
    enum: ['cash', 'card', 'upi', 'online', 'cod'],
  })
  paymentMethod: string;

  @Prop({
    default: 'pending',
    enum: ['pending', 'processing', 'ready', 'delivered', 'cancelled'],
  })
  orderStatus: string;

  @Prop()
  specialItems?: string;

  @Prop({ type: Array, default: [] })
  orderItem: string[]; // can be replaced with embedded schema if needed

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Review' }], default: [] })
  reviews: Types.ObjectId[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
