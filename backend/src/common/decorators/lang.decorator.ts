import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Language } from '../enums/language.enum';

const aliases: Record<string, Language> = {
  uz: Language.Uz,
  'uz-latn': Language.Uz,
  kr: Language.Kr,
  'uz-cyrl': Language.Kr,
  ru: Language.Ru,
  en: Language.En,
};

export const resolveLanguage = (raw?: string | null): Language => {
  if (!raw) return Language.Uz;
  const first = raw.split(',')[0].split(';')[0].trim().toLowerCase();
  return aliases[first] ?? aliases[first.split('-')[0]] ?? Language.Uz;
};

export const Lang = createParamDecorator((_: unknown, ctx: ExecutionContext): Language => {
  const request = ctx.switchToHttp().getRequest<Request>();
  const fromQuery = typeof request.query.lang === 'string' ? request.query.lang : null;
  return resolveLanguage(fromQuery ?? request.headers['accept-language']);
});
