import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  // Generate JWT token and set cookie
  private generateTokenAndSetCookie(userId: string, res: Response): string {
    const token = this.jwtService.sign({ userId }, { expiresIn: '15d' });
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: isProduction,
    });

    return token;
  }

  // Signup
  async signup(
    username: string,
    email: string,
    password: string,
    res: Response,
  ) {
    // ✅ Keep only business logic validation
    const existingUser = await this.userModel.findOne({
      $or: [{ username }, { email: email.toLowerCase() }],
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    const user = new this.userModel({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // ✅ Generate token and set cookie
    const token = this.generateTokenAndSetCookie(user._id.toString(), res);

    await user.save();

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  }

  // Login
  async login(emailorusername: string, password: string, res: Response) {
    // ✅ DTO already validates input presence
    const user = await this.userModel
      .findOne({
        $or: [
          { email: emailorusername.toLowerCase() },
          { username: emailorusername },
        ],
      })
      .select('+password'); // Include password for comparison

    if (!user) throw new NotFoundException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const token = this.generateTokenAndSetCookie(user._id.toString(), res);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      user: user.toObject(),
      token,
    });
  }

  // Logout
  logout(res: Response) {
    res.clearCookie('jwt');
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }

  // Auth check
  authCheck(reqUser: User) {
    return {
      success: true,
      user: reqUser,
    };
  }
}
