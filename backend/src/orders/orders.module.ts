import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from './schemas/orders.schema';
import { OrdersResolver } from './orders.resolver';
import { ReviewSchema } from 'src/reviews/schemas/reviews.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: 'Review', schema: ReviewSchema }]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersResolver],
  exports: [OrdersService], // optional
})
export class OrdersModule {}
