import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Headers,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  private async getCartId(@Headers('x-cart-id') cartId?: string): Promise<string> {
    if (cartId) {
      try {
        await this.cartService.getCart(cartId);
        return cartId;
      } catch {
        // Cart doesn't exist, create new
      }
    }
    
    const sessionId = Math.random().toString(36).substring(2, 15);
    return this.cartService.getOrCreateCart(sessionId);
  }

  @Get()
  async getCart(@Headers('x-cart-id') cartId?: string) {
    const id = await this.getCartId(cartId);
    return this.cartService.getCart(id);
  }

  @Get('count')  // ← ADD THIS METHOD
  async getCartCount(@Headers('x-cart-id') cartId?: string) {
    const id = await this.getCartId(cartId);
    const cart = await this.cartService.getCart(id);
    return {
      cartId: cart.id,
      totalItems: cart.totalItems,
      totalAmount: cart.totalAmount,
    };
  }

  @Post('items')
  async addItem(
    @Body() dto: AddToCartDto,
    @Headers('x-cart-id') cartId?: string,
  ) {
    const id = await this.getCartId(cartId);
    return this.cartService.addToCart(id, dto);
  }

  @Put('items/:itemId')
  async updateItem(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: UpdateCartItemDto,
    @Headers('x-cart-id') cartId?: string,
  ) {
    const id = await this.getCartId(cartId);
    return this.cartService.updateCartItem(id, itemId, dto);
  }

  @Delete('items/:itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeItem(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Headers('x-cart-id') cartId?: string,
  ) {
    const id = await this.getCartId(cartId);
    await this.cartService.removeFromCart(id, itemId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearCart(@Headers('x-cart-id') cartId?: string) {
    const id = await this.getCartId(cartId);
    await this.cartService.clearCart(id);
  }

  @Post('checkout')
  async checkout(
    @Body() customerInfo: any,
    @Headers('x-cart-id') cartId?: string,
  ) {
    const id = await this.getCartId(cartId);
    return this.cartService.checkout(id, customerInfo);
  }
}