import { Language, LANGUAGE_SUFFIX } from '../enums/language.enum';

export const pickLocale = (source: object, key: string, lang: Language): string => {
  const record = source as Record<string, unknown>;
  const value = record[`${key}${LANGUAGE_SUFFIX[lang]}`];
  if (typeof value === 'string' && value.trim()) return value;
  const fallback = record[`${key}Uz`];
  return typeof fallback === 'string' ? fallback : '';
};
