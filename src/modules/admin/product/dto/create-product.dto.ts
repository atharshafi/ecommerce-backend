import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price!: number;

  @IsInt()
  stock!: number;

  @IsString()
  woodType!: string;

  @IsInt()
  categoryId!: number;
}
