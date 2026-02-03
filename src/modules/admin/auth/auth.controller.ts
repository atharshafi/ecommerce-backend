import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminLoginDto } from './dto/login.dto';
@Controller('admin/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() dto: AdminLoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
