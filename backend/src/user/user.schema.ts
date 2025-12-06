import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ unique: true })
  contactNumber: string;

  @Prop()
  address: string;

  declare _id: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
