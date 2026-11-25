import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { VerifyDto } from './dto/verify.dto';
import { Public } from '../common/decorators/public.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserRoles } from '../common/decorators/roles-decorator';
import { UserRole } from '../shared/enums/user-role.enum';

@ApiBearerAuth()
// @Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UserRoles(UserRole.USER)
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('register-admin')
  registerAdmin() {
    return this.authService.registerAdmin();
  }
  @Post('verify')
  async verify(@Body() verifyDto: VerifyDto) {
    const token = await this.authService.verify(verifyDto);
    return {
      token: token
    }
  }
}
