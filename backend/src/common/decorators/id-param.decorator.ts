import { BadRequestException, Param, ParseIntPipe } from '@nestjs/common';

export const ID_ERROR = 'ID musbat butun son bo‘lishi kerak';

export const IdParam = (name = 'id') =>
  Param(name, new ParseIntPipe({ exceptionFactory: () => new BadRequestException(ID_ERROR) }));
