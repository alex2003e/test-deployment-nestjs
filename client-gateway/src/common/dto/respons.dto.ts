import { IsBoolean, IsString } from 'class-validator';

export class ResponsDto {
  @IsBoolean()
  success: boolean = true;

  @IsString()
  message: string;

  data: object | object[];
}
