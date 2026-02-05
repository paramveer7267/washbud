import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  Get,
  UseGuards,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from '../user/schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupDto: SignupDto, @Res() res: Response) {
    const { username, email, password, name } = signupDto;
    return this.authService.signup(username, email, password, name, res);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { emailorusername, password } = loginDto;
    return this.authService.login(emailorusername, password, res);
  }

  @Post('logout')
  logout(@Res() res: Response) {
    return this.authService.logout(res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('authCheck')
  authCheck(@Req() req: Request) {
    return this.authService.authCheck(req.user as User);
  }
}
