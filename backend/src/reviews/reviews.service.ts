import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/reviews.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Order, OrderDocument } from '../orders/schemas/orders.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    const review = await this.reviewModel.create(createReviewDto);

    // step 2: fetch the order and attach the review
    const order = await this.orderModel.findById(createReviewDto.orderId);

    if (order) {
      order.reviews.push(review._id);
      await order.save();
    }

    return review;
  }

  async findAll() {
    return this.reviewModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const review = await this.reviewModel.findById(id);
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    const updated = await this.reviewModel.findByIdAndUpdate(
      id,
      updateReviewDto,
      {
        new: true,
      },
    );
    if (!updated) throw new NotFoundException('Review not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.reviewModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Review not found');
    return deleted;
  }
}
