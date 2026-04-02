import { Not, ObjectLiteral, Repository } from 'typeorm';
import { slugify } from './slugify';

export const generateUniqueSlug = async <T extends ObjectLiteral & { id: number; slug: string }>(
  repository: Repository<T>,
  source: string,
  excludeId?: number,
): Promise<string> => {
  const base = slugify(source);
  let candidate = base;
  let counter = 2;

  while (true) {
    const where: Record<string, unknown> = { slug: candidate };
    if (excludeId) where.id = Not(excludeId);
    const taken = await repository.exists({ where: where as never });
    if (!taken) return candidate;
    candidate = `${base}-${counter++}`;
  }
};

export const isNumericId = (value: string) => /^\d+$/.test(value);
