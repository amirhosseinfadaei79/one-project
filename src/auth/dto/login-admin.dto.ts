import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class LoginAdminDto {
    @ApiProperty({
        description: 'نام کاربری ادمین',
        example: 'admin',
        minLength: 3,
        maxLength: 30 
    })
    @IsString({ message: 'نام کاربری باید یک رشته متنی باشد' })
    @IsNotEmpty({ message: 'نام کاربری الزامی است' })
    @MinLength(3, { message: 'نام کاربری باید حداقل ۳ کاراکتر باشد' })
    @MaxLength(30, { message: 'نام کاربری نمی‌تواند بیشتر از ۳۰ کاراکتر باشد' })
    username: string;

    @ApiProperty({
        description: 'رمز عبور ادمین',
        example: 'admin@123',
        minLength: 6,
        maxLength: 255 
    })
    @IsString({ message: 'رمز عبور باید یک رشته متنی باشد' })
    @IsNotEmpty({ message: 'رمز عبور الزامی است' })
    @MinLength(6, { message: 'رمز عبور باید حداقل ۶ کاراکتر باشد' })
    @MaxLength(255, { message: 'رمز عبور نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد' })
    password: string;
}