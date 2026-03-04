import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Put, 
  UseGuards, 
  Req,
  HttpCode, 
  HttpStatus, 
  BadRequestException 
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { JwtUserGuard } from '../../../common/guards/jwt-user.guard';

@Controller('user/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtUserGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    // Handle both possible structures
    const userId = (req.user as any)?.id || (req.user as any)?.userId;
    return this.authService.getProfile(userId);
  }

  @UseGuards(JwtUserGuard)
  @Put('profile')
  async updateProfile(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = (req.user as any)?.id || (req.user as any)?.userId;
    return this.authService.updateProfile(userId, updateProfileDto);
  }

  @UseGuards(JwtUserGuard)
  @Post('change-password')
  async changePassword(
    @Req() req: Request,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    const { oldPassword, newPassword } = body;
    
    if (!oldPassword || !newPassword) {
      throw new BadRequestException('Old password and new password are required');
    }

    const userId = (req.user as any)?.id || (req.user as any)?.userId;
    return this.authService.changePassword(userId, oldPassword, newPassword);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}