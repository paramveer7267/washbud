import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  // PATCH user fields
  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        { $set: updateUserDto },
        {
          new: true,
          runValidators: true,
        },
      );

      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }

      return updatedUser;
    } catch (error: any) {
      // 🔴 LOG FULL ERROR (server-side)
      console.error('User update failed:', {
        userId,
        updateUserDto,
        name: error?.name,
        code: error?.code,
        keyPattern: error?.keyPattern,
        keyValue: error?.keyValue,
        message: error?.message,
      });

      // 🔥 Handle duplicate key error nicely
      if (error?.code === 11000) {
        const field = Object.keys(error.keyPattern || {})[0];

        throw new BadRequestException(`${field} already exists.`);
      }

      throw error;
    }
  }

  // DELETE user
  async delete(userId: string): Promise<{ message: string }> {
    const deletedUser = await this.userModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }

    return { message: 'User deleted successfully' };
  }
}
