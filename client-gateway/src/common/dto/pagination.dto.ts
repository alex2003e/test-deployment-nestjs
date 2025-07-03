import { Type } from 'class-transformer';
import { IsPositive, IsOptional } from 'class-validator';

export class PaginationDto {
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page: number = 1;

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit: number = 10;
}
