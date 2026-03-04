import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,  // Use Req instead of Request
  Query,
} from '@nestjs/common';
import { Request } from 'express';  // Import Request from express
import { UserService } from './user.service';
import { AddressDto } from './dto/address.dto';
import { JwtUserGuard } from '../../common/guards/jwt-user.guard';

// Define the user type from your JWT strategy
interface RequestWithUser extends Request {
  user: {
    userId: number;
    email: string;
    role: string;
  };
}

@UseGuards(JwtUserGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 📋 Get user addresses
  @Get('addresses')
  async getAddresses(@Req() req: RequestWithUser) {
    return this.userService.getUserAddresses(req.user.userId);
  }

  // ➕ Add new address
  @Post('addresses')
  async addAddress(@Req() req: RequestWithUser, @Body() addressDto: AddressDto) {
    return this.userService.addAddress(req.user.userId, addressDto);
  }

  // ✏️ Update address
  @Put('addresses/:id')
  async updateAddress(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) addressId: number,
    @Body() addressDto: AddressDto,
  ) {
    return this.userService.updateAddress(req.user.userId, addressId, addressDto);
  }

  // 🗑️ Delete address
  @Delete('addresses/:id')
  async deleteAddress(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) addressId: number,
  ) {
    return this.userService.deleteAddress(req.user.userId, addressId);
  }

  // 📦 Get user orders
  @Get('orders')
  async getOrders(
    @Req() req: RequestWithUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.userService.getUserOrders(
      req.user.userId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  // 🔍 Get single order
  @Get('orders/:id')
  async getOrder(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) orderId: number,
  ) {
    return this.userService.getUserOrder(req.user.userId, orderId);
  }
}