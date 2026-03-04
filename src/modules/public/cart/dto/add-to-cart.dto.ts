import { IsInt, Min } from 'class-validator';

export class AddToCartDto {
  @IsInt()
  @Min(1)
  productId!: number;  // Add ! here

  @IsInt()
  @Min(1)
  quantity: number = 1;  // This has default value so it's fine
}