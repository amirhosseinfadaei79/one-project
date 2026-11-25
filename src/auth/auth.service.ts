import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { User } from './entities/user-entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '../shared/enums/user-role.enum';
import { VerifyDto } from './dto/verify.dto';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService
  ) { }
  async register(registerDto: RegisterDto) {
    const { mobile } = registerDto
    const otpExpiresAt = new Date();
    otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 2);

    const userAlready = await this.userRepo.findOne({ where: { mobile } })
    if (userAlready) {
      userAlready.otpExpiresAt = otpExpiresAt
      userAlready.otpCode = "1234"
      return this.userRepo.save(userAlready)
    }
    const register = this.userRepo.create({
      mobile,
      otpCode: "1234",
      otpExpiresAt,
      role: UserRole.USER
    })
    return this.userRepo.save(register)
  }
  async verify(verifyDto: VerifyDto) {
    const { mobile, otpCode } = verifyDto
    const userAlready = await this.userRepo
      .createQueryBuilder('user')
      .where('user.mobile = :mobile', { mobile })
      .addSelect('user.otpCode')
      .getOne();
    if (!userAlready) throw new BadRequestException('لطفا ابتدا ثبت نام کنید');
    if (userAlready.otpExpiresAt && new Date() > userAlready.otpExpiresAt) {
      throw new BadRequestException('کد تایید منقضی شده است');
    }
    if (userAlready.otpCode !== otpCode) {
      throw new BadRequestException('کد تایید اشتباه است');
    }
    userAlready.otpCode = null;
    userAlready.otpExpiresAt = null;
    await this.userRepo.save(userAlready);
    const payload = { sub: userAlready.id, mobile: userAlready.mobile, role: userAlready.role };
    const token = this.jwtService.sign(payload);
    return token
  }
  async findUserById(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } })
    if (!user) throw new NotFoundException('کاربری با این شناسه یافت نشد!');
    return user;
  }
  async registerAdmin() {
    const adminUsername = "admin"
    const adminPassword = "admin@123"
    const hashedPass = await bcrypt.hash(adminPassword, 12)
    const alreadyAdmin = await this.userRepo.findOne({ where: { username: adminUsername } })
    if (alreadyAdmin) throw new BadRequestException('حساب از قبل ایجاد شده است')
    const create = this.userRepo.create({
      username: adminUsername,
      password: hashedPass,
      role: UserRole.ADMIN,
    })
    const savedAdmin = await this.userRepo.save(create);
    const payload = { sub: savedAdmin.id, username: adminUsername, role: UserRole.ADMIN };
    const token = this.jwtService.sign(payload);
    return token
  }
}
