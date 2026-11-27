import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { User } from './entities/user-entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '../shared/enums/user-role.enum';
import { VerifyDto } from './dto/verify.dto';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { LoginAdminDto } from './dto/login-admin.dto';
import { FindAllDto } from './dto/find-all.dto';
import { PAGINATION } from '../shared/constants/pagination.constants';
import { buildPaginationResponse } from '../shared/utils/pagination.util';

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
  async loginAdmin(payload: LoginAdminDto) {
    const { username, password } = payload
    const user = await this.userRepo.findOne({
      where: { username },
      select: { username: true, password: true, id: true, role: true }
    })
    if (!user || !user.password) throw new UnauthorizedException('نام کاربری یا رمز عبور اشتباه است');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('نام کاربری یا رمز عبور اشتباه است');
    }
    const payloadSign = { sub: user.id, username: user.username, role: user.role };
    const token = this.jwtService.sign(payloadSign);
    return {
      token: token
    }
  }
  async getAll(payload: FindAllDto) {
    const {
      search = '',
      currentPage = PAGINATION.DEFAULT_PAGE,
      pageSize = PAGINATION.DEFAULT_PAGE_SIZE,
      role
    } = payload;
    const query = this.userRepo.createQueryBuilder('user');
    if (search) {
      query.andWhere('user.mobile LIKE :search OR user.username LIKE :search', {
        search: `%${search}%`,
      });
    }
    if (role) {
      query.andWhere('user.role = :role', { role });
    }
    const skip = (currentPage! - 1) * pageSize!;
    query.skip(skip).take(pageSize!);
    const [data, total] = await query.getManyAndCount();
    return buildPaginationResponse(data, total, currentPage, pageSize);
  }
}
