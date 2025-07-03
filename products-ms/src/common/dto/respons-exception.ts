import { IsNumber, IsPositive } from "class-validator";
import { ResponsDto } from "./respons.dto";

export class ResponsExceptionDto extends ResponsDto {
        
  @IsPositive()
  @IsNumber()
  statusCode: number;

}
  