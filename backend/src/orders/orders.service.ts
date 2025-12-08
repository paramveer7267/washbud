import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Order, OrderDocument } from './schemas/orders.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ReviewDocument } from 'src/reviews/schemas/reviews.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel('Review') private reviewModel: Model<ReviewDocument>,
  ) {}

  // CREATE ORDER
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const newOrder = new this.orderModel(createOrderDto);
    return await newOrder.save();
  }

  // GET ALL ORDERS
  async findAll(): Promise<Order[]> {
    return await this.orderModel
      .find()
      .populate('reviews') // ⭐ POPULATE FULL REVIEW DATA
      .sort({ createdAt: -1 })
      .exec();
  }

  // GET ONE ORDER BY ID
  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate('reviews') // ⭐ POPULATE FULL REVIEW DATA
      .exec();

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  // UPDATE ORDER
  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();

    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return updatedOrder;
  }

  // DELETE ORDER
  async remove(id: string): Promise<{ message: string }> {
    // 1. Find the order first (to get review IDs)
    const order = await this.orderModel.findById(id).exec();

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // 2. Delete all reviews belonging to this order
    await this.reviewModel.deleteMany({ orderId: id }).exec();

    // 3. Delete the order itself
    await this.orderModel.findByIdAndDelete(id).exec();

    return {
      message: `Order ${id} and all related reviews removed successfully`,
    };
  }
}
