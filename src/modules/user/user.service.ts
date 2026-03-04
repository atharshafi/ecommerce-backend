import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddressDto } from './dto/address.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // 📋 Get all addresses for a user
  async getUserAddresses(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { addresses: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.addresses;
  }

  // ➕ Add new address
  async addAddress(userId: number, addressDto: AddressDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If setting as default, unset other defaults
    if (addressDto.isDefault) {
      await this.prisma.address.updateMany({
        where: {
          userId,
          type: addressDto.type,
          isDefault: true,
        },
        data: { isDefault: false },
      });
    }

    const address = await this.prisma.address.create({
      data: {
        ...addressDto,
        userId,
      },
    });

    return {
      address,
      message: 'Address added successfully'
    };
  }

  // ✏️ Update address
  async updateAddress(userId: number, addressId: number, addressDto: AddressDto) {
    // Check address belongs to user
    const address = await this.prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    // If setting as default, unset other defaults
    if (addressDto.isDefault && !address.isDefault) {
      await this.prisma.address.updateMany({
        where: {
          userId,
          type: addressDto.type,
          isDefault: true,
          NOT: { id: addressId },
        },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await this.prisma.address.update({
      where: { id: addressId },
      data: addressDto,
    });

    return {
      address: updatedAddress,
      message: 'Address updated successfully'
    };
  }

  // 🗑️ Delete address
  async deleteAddress(userId: number, addressId: number) {
    // Check address belongs to user
    const address = await this.prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    // Don't allow deleting last address
    const addressCount = await this.prisma.address.count({
      where: { userId },
    });

    if (addressCount <= 1) {
      throw new BadRequestException('Cannot delete the only address');
    }

    await this.prisma.address.delete({
      where: { id: addressId },
    });

    return { message: 'Address deleted successfully' };
  }

  // 📦 Get user orders with pagination
  async getUserOrders(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  woodType: true,
                  images: {
                    take: 1,
                    select: { imageUrl: true },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({
        where: { userId },
      }),
    ]);

    return {
      data: orders,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  // 🔍 Get single order
  async getUserOrder(userId: number, orderId: number) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                woodType: true,
                images: {
                  take: 1,
                  select: { imageUrl: true },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}