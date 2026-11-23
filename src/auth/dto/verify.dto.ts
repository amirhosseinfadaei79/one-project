import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length, Matches } from "class-validator"

export class VerifyDto {
    @ApiProperty({
        description: 'شماره موبایل کاربر (باید با الگوی شماره موبایل ایرانی مطابقت داشته باشد)',
        example: '09135882813',
        pattern: '^09\\d{9}$',
        minLength: 11,
        maxLength: 11
    })
    @IsString({ message: 'شماره موبایل باید یک رشته متنی باشد' })
    @IsNotEmpty({ message: 'شماره موبایل الزامی است' })
    @Matches(/^09\d{9}$/, { message: 'شماره موبایل باید با الگوی شماره موبایل ایرانی (09xxxxxxxxx) مطابقت داشته باشد' })
    mobile: string;

    @ApiProperty({
        description: 'کد تأیید ۴ رقمی ارسال شده به موبایل',
        example: '1234',
        minLength: 4,
        maxLength: 4
    })
    @IsString({ message: 'کد تأیید باید یک رشته متنی باشد' })
    @IsNotEmpty({ message: 'کد تأیید الزامی است' })
    @Length(4, 4, { message: 'کد تأیید باید دقیقاً ۴ رقم باشد' })
    @Matches(/^\d{4}$/, { message: 'کد تأیید فقط باید شامل اعداد باشد' })
    otpCode: string;
}