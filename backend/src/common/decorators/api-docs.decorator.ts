import { applyDecorators, HttpCode, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ErrorResponseDto, PaginationMetaDto } from '../dto/api-response.dto';
import { Auth } from './auth.decorator';
import { ResponseMessage } from './response-message.decorator';

interface ApiDocsOptions {
  summary: string;
  description?: string;
  type?: Type<unknown>;
  isArray?: boolean;
  paginated?: boolean;
  status?: HttpStatus.OK | HttpStatus.CREATED;
  message?: string;
  auth?: boolean;
  unauthorized?: string;
  validation?: boolean;
  notFound?: string;
  conflict?: string;
  badRequest?: string;
  payloadTooLarge?: boolean;
}

const errorExample = (
  statusCode: number,
  message: string,
  path: string,
  errors: { field: string; message: string }[] = [],
) => ({
  success: false,
  statusCode,
  message,
  data: null,
  errors,
  path,
  timestamp: '2026-04-12T09:30:00.000Z',
});

const errorResponse = (status: number, description: string, example: object) =>
  ApiResponse({
    status,
    description,
    schema: { allOf: [{ $ref: getSchemaPath(ErrorResponseDto) }], example },
  });

const dataSchema = (options: ApiDocsOptions) => {
  if (!options.type) return { type: 'object', nullable: true, example: null };
  const ref = { $ref: getSchemaPath(options.type) };
  if (options.paginated) {
    return {
      type: 'object',
      properties: {
        items: { type: 'array', items: ref },
        meta: { $ref: getSchemaPath(PaginationMetaDto) },
      },
    };
  }
  return options.isArray ? { type: 'array', items: ref } : ref;
};

export const ApiDocs = (options: ApiDocsOptions) => {
  const status = options.status ?? HttpStatus.OK;
  const message = options.message ?? 'Muvaffaqiyatli bajarildi';
  const models = [ErrorResponseDto, PaginationMetaDto, ...(options.type ? [options.type] : [])];

  const decorators = [
    ApiExtraModels(...models),
    ApiOperation({ summary: options.summary, description: options.description }),
    HttpCode(status),
    ResponseMessage(message),
    ApiResponse({
      status,
      description: message,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          statusCode: { type: 'number', example: status },
          message: { type: 'string', example: message },
          data: dataSchema(options),
          errors: { type: 'array', items: {}, example: [] },
        },
      },
    }),
    errorResponse(
      HttpStatus.TOO_MANY_REQUESTS,
      'So‘rovlar soni chegaradan oshdi',
      errorExample(429, 'Juda ko‘p so‘rov yuborildi, birozdan so‘ng urinib ko‘ring', '/api/...'),
    ),
    errorResponse(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Serverdagi kutilmagan xatolik',
      errorExample(500, 'Serverda ichki xatolik yuz berdi', '/api/...'),
    ),
  ];

  if (options.auth) decorators.push(Auth());

  if (options.auth || options.unauthorized) {
    decorators.push(
      errorResponse(
        HttpStatus.UNAUTHORIZED,
        options.unauthorized ?? 'Token yuborilmagan, noto‘g‘ri yoki muddati tugagan',
        errorExample(
          401,
          options.unauthorized ?? 'Avtorizatsiyadan o‘tilmagan yoki token muddati tugagan',
          '/api/...',
        ),
      ),
    );
  }

  if (options.validation) {
    decorators.push(
      errorResponse(
        HttpStatus.BAD_REQUEST,
        'Yuborilgan ma’lumotlar validatsiyadan o‘tmadi',
        errorExample(400, 'Validatsiya xatoligi', '/api/...', [
          { field: 'titleUz', message: 'titleUz bo‘sh bo‘lmasligi kerak' },
        ]),
      ),
    );
  } else if (options.badRequest) {
    decorators.push(
      errorResponse(
        HttpStatus.BAD_REQUEST,
        options.badRequest,
        errorExample(400, options.badRequest, '/api/...'),
      ),
    );
  }

  if (options.notFound) {
    decorators.push(
      errorResponse(
        HttpStatus.NOT_FOUND,
        'So‘ralgan resurs topilmadi',
        errorExample(404, options.notFound, '/api/...'),
      ),
    );
  }

  if (options.conflict) {
    decorators.push(
      errorResponse(
        HttpStatus.CONFLICT,
        'Ma’lumot boshqa yozuv bilan to‘qnashdi',
        errorExample(409, options.conflict, '/api/...'),
      ),
    );
  }

  if (options.payloadTooLarge) {
    decorators.push(
      errorResponse(
        HttpStatus.PAYLOAD_TOO_LARGE,
        'Fayl hajmi ruxsat etilganidan katta',
        errorExample(413, 'Fayl hajmi juda katta', '/api/files'),
      ),
    );
  }

  return applyDecorators(...decorators);
};
