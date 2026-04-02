import { BadRequestException, ValidationError } from '@nestjs/common';

const flatten = (errors: ValidationError[], parent = ''): { field: string; message: string }[] =>
  errors.flatMap((error) => {
    const field = parent ? `${parent}.${error.property}` : error.property;
    const own = Object.values(error.constraints ?? {}).map((message) => ({ field, message }));
    return [...own, ...flatten(error.children ?? [], field)];
  });

export const validationExceptionFactory = (errors: ValidationError[]) =>
  new BadRequestException({ message: 'Validatsiya xatoligi', errors: flatten(errors) });
