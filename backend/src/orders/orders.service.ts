import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { nanoid } from 'nanoid';

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

  // --------------------
  // CREATE ORDER
  // --------------------
  async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    
    const orderId: string = `WB-${String(nanoid(6)).toUpperCase()}`;

    const newOrder = new this.orderModel({
      ...createOrderDto,
      user: userId,
      orderId,
    });

    return await newOrder.save();
  }

  // --------------------
  // GET ALL ORDERS
  // --------------------
  async findAll(): Promise<Order[]> {
    return this.orderModel
      .find()
      .populate('user')
      .populate('reviews')
      .sort({ createdAt: -1 })
      .exec();
  }

  // --------------------
  // GET USER ORDERS
  // --------------------
  async findByUser(userId: string): Promise<Order[]> {
    return this.orderModel
      .find({ user: userId })
      .populate('reviews')
      .sort({ createdAt: -1 })
      .exec();
  }

  // --------------------
  // GET SINGLE ORDER
  // --------------------
  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate('user')
      .populate('reviews')
      .exec();

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  // --------------------
  // UPDATE ORDER
  // --------------------
  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();

    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return updatedOrder;
  }

  // --------------------
  // DELETE ORDER
  // --------------------
  async remove(id: string): Promise<{ message: string }> {
    const order = await this.orderModel.findById(id).exec();

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    await this.reviewModel.deleteMany({ orderId: id }).exec();
    await this.orderModel.findByIdAndDelete(id).exec();

    return {
      message: `Order ${id} and all related reviews removed successfully`,
    };
  }
}
