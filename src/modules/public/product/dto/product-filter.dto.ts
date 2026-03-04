import { IsOptional, IsInt, Min, Max, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductFilterDto {
  @IsOptional()
  @Type(() => Number)  // This converts string to number
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)  // This converts string to number
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)  // This converts string to number
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @IsString()
  woodType?: string;

  @IsOptional()
  @Type(() => Number)  // This converts string to number
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)  // This converts string to number
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsString()
  sortBy?: 'price' | 'createdAt' | 'name' = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}