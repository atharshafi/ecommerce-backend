import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsNumber, Min, IsOptional, IsString, IsEmail } from 'class-validator';

export class OrderItemDto {
  @IsNumber()
  productId: number = 0;

  @IsNumber()
  @Min(1)
  quantity: number = 1;

  @IsNumber()
  @Min(0)
  price: number = 0;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[] = [];

  @IsNumber()
  @Min(0)
  totalAmount: number = 0;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}