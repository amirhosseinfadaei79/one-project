import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { PAGINATION } from '../../shared/constants/pagination.constants';

export class PaginationDto {
  @ApiPropertyOptional({ default: PAGINATION.DEFAULT_PAGE })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  currentPage?: number = PAGINATION.DEFAULT_PAGE;

  @ApiPropertyOptional({ default: PAGINATION.DEFAULT_PAGE_SIZE })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(PAGINATION.MAX_PAGE_SIZE) 
  @IsOptional()
  pageSize?: number = PAGINATION.DEFAULT_PAGE_SIZE;
}