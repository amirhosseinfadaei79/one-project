import { ApiPropertyOptional } from "@nestjs/swagger";
import { SearchPaginationDto } from "../../shared/dtos/search-pagination.dto";
import { UserRole } from "../../shared/enums/user-role.enum";
import { IsEnum, IsOptional } from "class-validator";

export class FindAllDto extends SearchPaginationDto {
    @ApiPropertyOptional({ enum: UserRole })
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;
}