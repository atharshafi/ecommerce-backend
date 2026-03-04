export class CartItemResponse {
  id!: number;
  productId!: number;
  productName!: string;
  price!: number;
  quantity!: number;
  imageUrl?: string;
  woodType?: string;
  stock!: number;
  subtotal!: number;
}

export class CartResponseDto {
  id!: string;
  items!: CartItemResponse[];
  totalItems!: number;
  totalAmount!: number;
  createdAt!: Date;
  updatedAt!: Date;
}