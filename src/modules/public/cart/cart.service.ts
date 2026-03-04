import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartResponseDto, CartItemResponse } from './dto/cart-response.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateCart(sessionId?: string): Promise<string> {
    if (sessionId) {
      const existingCart = await this.prisma.cart.findFirst({
        where: { sessionId },
      });
      if (existingCart) return existingCart.id;
    }

    const newCart = await this.prisma.cart.create({
      data: { sessionId },
    });
    return newCart.id;
  }

  async getCart(cartId: string): Promise<CartResponseDto> {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { take: 1 },
              },
            },
          },
        },
      },
    });

    if (!cart) throw new NotFoundException('Cart not found');

    const items: CartItemResponse[] = cart.items.map(item => ({
      id: item.id,
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      imageUrl: item.product.images[0]?.imageUrl,
      woodType: item.product.woodType,
      stock: item.product.stock,
      subtotal: item.product.price * item.quantity,
    }));

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

    return {
      id: cart.id,
      items,
      totalItems,
      totalAmount,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  }

  async addToCart(cartId: string, dto: AddToCartDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId, status: true },
    });

    if (!product) throw new NotFoundException('Product not found');
    if (product.stock < dto.quantity) throw new BadRequestException('Insufficient stock');

    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cartId, productId: dto.productId },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + dto.quantity;
      if (product.stock < newQuantity) throw new BadRequestException('Insufficient stock');

      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await this.prisma.cartItem.create({
        data: { cartId, productId: dto.productId, quantity: dto.quantity },
      });
    }

    return this.getCart(cartId);
  }

  async updateCartItem(cartId: string, itemId: number, dto: UpdateCartItemDto) {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId },
      include: { product: true },
    });

    if (!cartItem) throw new NotFoundException('Cart item not found');

    if (dto.quantity === 0) {
      await this.prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      if (cartItem.product.stock < dto.quantity) throw new BadRequestException('Insufficient stock');

      await this.prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity: dto.quantity },
      });
    }

    return this.getCart(cartId);
  }

  async removeFromCart(cartId: string, itemId: number) {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId },
    });

    if (!cartItem) throw new NotFoundException('Cart item not found');

    await this.prisma.cartItem.delete({ where: { id: itemId } });
    return this.getCart(cartId);
  }

  async clearCart(cartId: string) {
    await this.prisma.cartItem.deleteMany({ where: { cartId } });
  }

  async checkout(cartId: string, customerInfo: any) {
    const cart = await this.getCart(cartId);

    if (cart.items.length === 0) throw new BadRequestException('Cart is empty');

    for (const item of cart.items) {
      if (item.quantity > item.stock) {
        throw new BadRequestException(`Insufficient stock for ${item.productName}`);
      }
    }

    const order = await this.prisma.$transaction(async (prisma) => {
      const newOrder = await prisma.order.create({
        data: {
          totalAmount: cart.totalAmount,
          status: 'PENDING',
          customerEmail: customerInfo.customerEmail,
          customerName: customerInfo.customerName,
          customerPhone: customerInfo.customerPhone,
          shippingAddress: customerInfo.shippingAddress,
          notes: customerInfo.notes,
        },
      });

      for (const item of cart.items) {
        await prisma.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          },
        });

        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await prisma.cartItem.deleteMany({ where: { cartId } });

      return newOrder;
    });

    return {
      message: 'Order placed successfully',
      orderId: order.id,
      totalAmount: order.totalAmount,
    };
  }
}