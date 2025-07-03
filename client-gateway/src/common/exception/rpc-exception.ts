
import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { ResponsExceptionDto } from '../dto';

@Catch(RpcException)
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {

    const ctx  = host.switchToHttp();
    const respons = ctx.getResponse();

    const {statusCode, ...data} =  exception.getError() as ResponsExceptionDto;

    return respons.status(statusCode).json(data);
  }
}
