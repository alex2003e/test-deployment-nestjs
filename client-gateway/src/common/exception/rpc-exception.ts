import {
  Catch,
  RpcExceptionFilter,
  ArgumentsHost,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { ResponsExceptionDto } from '../dto';

@Catch(RpcException)
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const ctx = host.switchToHttp();
    const respons = ctx.getResponse();

    const { statusCode, ...data } = exception.getError() as ResponsExceptionDto;
    if (!statusCode) {
      Logger.fatal(
        'ExceptionFilter - RpcException - statusCode not found, setting 500 as default',
        data,
      );
      return respons.status(500).json({
        success: false,
        message: 'Internal Error Server.',
        data: {},
      });
    }
    Logger.error(data);
    Logger.error(
      `ExceptionFilter - RpcException - statusCode: ${statusCode}`,
      data,
    );

    return respons.status(statusCode).json(data);
  }
}
