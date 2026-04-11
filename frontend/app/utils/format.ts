const intlLocales: Record<string, string> = {
  uz: 'uz-Latn-UZ',
  kr: 'uz-Cyrl-UZ',
  ru: 'ru-RU',
  en: 'en-GB'
}

const monthNames: Record<string, string[]> = {
  uz: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'],
  kr: ['январ', 'феврал', 'март', 'апрел', 'май', 'июн', 'июл', 'август', 'сентабр', 'октабр', 'ноябр', 'декабр']
}

export const formatDate = (value?: string | Date | null, locale = 'uz', withTime = false) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const time = withTime
    ? `, ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    : ''

  const months = monthNames[locale]
  if (months) {
    return `${date.getDate()}-${months[date.getMonth()]}, ${date.getFullYear()}${time}`
  }

  return date.toLocaleDateString(intlLocales[locale] ?? 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) + time
}

export const formatNumber = (value: number) =>
  Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

export const formatBytes = (bytes: number) => {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`
}

export const stripHtml = (html?: string | null) =>
  (html ?? '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()

export const truncate = (text: string, length = 160) =>
  text.length > length ? `${text.slice(0, length).replace(/\s+\S*$/, '')}…` : text

export const parseJson = <T>(raw?: string | null): Partial<T> | null => {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed as Partial<T> : null
  } catch {
    return null
  }
}
