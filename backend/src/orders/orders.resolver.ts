import { Resolver, Query, Args } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { OrderType } from './graphql/orders.type';

@Resolver(() => OrderType)
export class OrdersResolver {
  constructor(private ordersService: OrdersService) {}

  @Query(() => [OrderType])
  async orders() {
    return this.ordersService.findAll();
  }

  @Query(() => OrderType)
  async order(@Args('id') id: string) {
    return this.ordersService.findOne(id);
  }
}
