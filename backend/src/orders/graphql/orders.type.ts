import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrderType {
  @Field(() => ID)
  _id: string;

  @Field()
  customerName: string;

  @Field(() => [String])
  orderItem: string[];

  @Field({ nullable: true })
  weightCategory?: string;

  @Field({ nullable: true })
  service?: string;

  @Field({ nullable: true })
  pickup?: string;

  @Field({ nullable: true })
  dropoff?: string;

  @Field({ nullable: true })
  paymentMethod?: string;

  @Field({ nullable: true })
  specialItems?: string;

  @Field({ nullable: true })
  orderStatus?: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
