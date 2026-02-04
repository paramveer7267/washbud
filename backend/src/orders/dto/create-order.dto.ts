import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  IsMongoId,
} from 'class-validator';

export class CreateOrderDto {

  @IsString()
  @IsNotEmpty()
  weightCategory: string;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  service: string;

  @IsString()
  @IsNotEmpty()
  pickup: string;

  @IsString()
  @IsNotEmpty()
  dropoff: string;

  @IsEnum(['cash', 'card', 'upi', 'online', 'cod'])
  paymentMethod: string;

  @IsOptional()
  @IsEnum(['pending', 'processing', 'ready', 'delivered', 'cancelled'])
  orderStatus?: string;

  @IsOptional()
  @IsString()
  specialItems?: string;

  @IsOptional()
  @IsArray()
  orderItem?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  reviews?: string[];
}
