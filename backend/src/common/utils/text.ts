export const stripHtml = (html: string) =>
  html
    .replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

export const makeExcerpt = (raw: string, length = 180) => {
  let text = raw ?? '';
  if (text.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(text) as Record<string, unknown>;
      text = typeof parsed.content === 'string' ? parsed.content : '';
    } catch {
      text = raw;
    }
  }
  const plain = stripHtml(text);
  if (plain.length <= length) return plain;
  return `${plain.slice(0, length).replace(/\s+\S*$/, '')}…`;
};
