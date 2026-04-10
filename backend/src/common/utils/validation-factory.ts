import { BadRequestException, ValidationError } from '@nestjs/common';

const templates: Record<string, (field: string, limit?: string) => string> = {
  isNotEmpty: (field) => `${field} bo‘sh bo‘lmasligi kerak`,
  isString: (field) => `${field} matn bo‘lishi kerak`,
  isInt: (field) => `${field} butun son bo‘lishi kerak`,
  isBoolean: (field) => `${field} true yoki false bo‘lishi kerak`,
  isEnum: (field) => `${field} ruxsat etilgan qiymatlardan biri bo‘lishi kerak`,
  isDate: (field) => `${field} to‘g‘ri sana bo‘lishi kerak`,
  isJWT: (field) => `${field} JWT formatida bo‘lishi kerak`,
  maxLength: (field, limit) => `${field} uzunligi ${limit} belgidan oshmasligi kerak`,
  minLength: (field, limit) => `${field} uzunligi kamida ${limit} belgi bo‘lishi kerak`,
  min: (field, limit) => `${field} ${limit} dan kichik bo‘lmasligi kerak`,
  max: (field, limit) => `${field} ${limit} dan katta bo‘lmasligi kerak`,
  whitelistValidation: (field) => `${field} maydoni qabul qilinmaydi`,
};

const isDefaultMessage = (message: string, property: string) =>
  message.startsWith(`${property} must`) ||
  message.startsWith(`${property} should`) ||
  message.startsWith(`property ${property} should`);

const translate = (constraint: string, message: string, property: string) => {
  const template = templates[constraint];
  if (!template || !isDefaultMessage(message, property)) return message;
  return template(property, message.match(/-?\d+(\.\d+)?/)?.[0]);
};

const flatten = (errors: ValidationError[], parent = ''): { field: string; message: string }[] =>
  errors.flatMap((error) => {
    const field = parent ? `${parent}.${error.property}` : error.property;
    const own = Object.entries(error.constraints ?? {}).map(([constraint, message]) => ({
      field,
      message: translate(constraint, message, error.property),
    }));
    return [...own, ...flatten(error.children ?? [], field)];
  });

export const validationExceptionFactory = (errors: ValidationError[]) =>
  new BadRequestException({ message: 'Validatsiya xatoligi', errors: flatten(errors) });
