import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { VerifyDto } from './dto/verify.dto';
import { Public } from '../common/decorators/public.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { LoginAdminDto } from './dto/login-admin.dto';
import { FindAllDto } from './dto/find-all.dto';
import { UserRoles } from '../common/decorators/roles-decorator';
import { UserRole } from '../shared/enums/user-role.enum';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('verify')
  async verify(@Body() verifyDto: VerifyDto) {
    const token = await this.authService.verify(verifyDto);
    return {
      token: token
    }
  }

  @Public()
  @Post('registeradmin')
  registerAdmin() {
    return this.authService.registerAdmin();
  }

  @Public()
  @Post('loginadmin')
  loginAdmin(@Body() payload: LoginAdminDto) {
    return this.authService.loginAdmin(payload);
  }
  
  @UserRoles(UserRole.ADMIN)
  @Get('getall')
  async getAll(@Query() payload: FindAllDto) {
    return await this.authService.getAll(payload)
  }
}
