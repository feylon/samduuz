import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

interface FieldError {
  field: string;
  message: string;
}

const pgErrors: Record<string, { status: number; message: string }> = {
  '23505': { status: HttpStatus.CONFLICT, message: 'Bunday qiymatli yozuv allaqachon mavjud' },
  '23503': { status: HttpStatus.BAD_REQUEST, message: 'Bog‘langan yozuv topilmadi' },
  '22P02': { status: HttpStatus.BAD_REQUEST, message: 'Noto‘g‘ri formatdagi qiymat yuborildi' },
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Serverda ichki xatolik yuz berdi';
    let errors: FieldError[] = [];

    if (exception instanceof ThrottlerException) {
      status = HttpStatus.TOO_MANY_REQUESTS;
      message = 'Juda ko‘p so‘rov yuborildi, birozdan so‘ng urinib ko‘ring';
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      if (typeof body === 'string') {
        message = body;
      } else {
        const payload = body as { message?: string | string[]; errors?: FieldError[] };
        if (Array.isArray(payload.message)) {
          message = 'Validatsiya xatoligi';
          errors = payload.message.map((item) => ({ field: '', message: item }));
        } else if (payload.message) {
          message = payload.message;
        }
        if (payload.errors) errors = payload.errors;
      }
      if (status === HttpStatus.PAYLOAD_TOO_LARGE) message = 'Fayl hajmi juda katta';
    } else if (exception instanceof QueryFailedError) {
      const code = (exception.driverError as { code?: string })?.code ?? '';
      const known = pgErrors[code];
      if (known) {
        status = known.status;
        message = known.message;
      } else {
        this.logger.error(exception.message, exception.stack);
      }
    } else {
      const error = exception as Error;
      this.logger.error(error?.message ?? exception, error?.stack);
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      data: null,
      errors,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
