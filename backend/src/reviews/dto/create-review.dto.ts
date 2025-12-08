import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsMongoId,
} from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsOptional()
  @IsMongoId({ each: true })
  orderId?: string;
}
