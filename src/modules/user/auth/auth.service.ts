import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // 📝 REGISTER new user
  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, phone } = registerDto;

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Generate token
    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user: userWithoutPassword,
      token,
      message: 'Registration successful!'
    };
  }

  // 🔐 LOGIN user
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Remove password
    const { password: _, ...userWithoutPassword } = user;

    // Generate token
    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user: userWithoutPassword,
      token,
      message: 'Login successful!'
    };
  }

  // 👤 GET profile
  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        isActive: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        addresses: true,
        _count: {
          select: { orders: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // ✏️ UPDATE profile
  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If email is being updated, check it's not taken
    if (updateProfileDto.email && updateProfileDto.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateProfileDto.email },
      });

      if (existingUser) {
        throw new BadRequestException('Email already in use');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateProfileDto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        isActive: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      user: updatedUser,
      message: 'Profile updated successfully'
    };
  }

  // 🔑 CHANGE password
  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password updated successfully' };
  }

  // 📧 FORGOT password
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // For security, don't reveal if user exists
    if (!user) {
      return { message: 'If your email exists, you will receive a reset link' };
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { 
        expiresIn: '1h', 
        secret: this.configService.get('JWT_RESET_SECRET') || 'reset-secret' 
      },
    );

    // TODO: In production, send email with reset link
    // For development, return token (remove in production)
    console.log('Reset token:', resetToken);

    return {
      message: 'Password reset instructions sent to email',
      resetToken: resetToken, // Remove this line in production
    };
  }

  // 🔄 RESET password
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password } = resetPasswordDto;

    try {
      // Verify token
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_RESET_SECRET') || 'reset-secret',
      });

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update password
      await this.prisma.user.update({
        where: { id: payload.sub },
        data: { password: hashedPassword },
      });

      return { message: 'Password reset successful' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  // 🎫 Generate JWT token
  private generateToken(userId: number, email: string, role: string = 'CUSTOMER') {
    return this.jwtService.sign(
      {
        sub: userId,
        email,
        role,
      },
      {
        secret: this.configService.get('JWT_SECRET') || 'user-secret-key',
        expiresIn: '7d',
      },
    );
  }
}