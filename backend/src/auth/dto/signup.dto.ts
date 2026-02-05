import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'Password must contain one special character and one number',
  })
  password: string;
}
