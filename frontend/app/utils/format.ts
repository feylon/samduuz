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

const TIME_ZONE = 'Asia/Tashkent'

export const dateParts = (value: string | Date) => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(new Date(value))
  const pick = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find(part => part.type === type)?.value ?? 0)
  return { year: pick('year'), month: pick('month') - 1, day: pick('day'), hour: pick('hour'), minute: pick('minute') }
}

export const formatDate = (value?: string | Date | null, locale = 'uz', withTime = false) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const parts = dateParts(date)
  const time = withTime
    ? `, ${String(parts.hour).padStart(2, '0')}:${String(parts.minute).padStart(2, '0')}`
    : ''

  const months = monthNames[locale]
  if (months) {
    return `${parts.day}-${months[parts.month]}, ${parts.year}${time}`
  }

  return date.toLocaleDateString(intlLocales[locale] ?? 'en-GB', {
    timeZone: TIME_ZONE,
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) + time
}

export const formatMonthShort = (value: string | Date, locale = 'uz') => {
  const months = monthNames[locale]
  if (months) return months[dateParts(value).month]!.slice(0, 3)
  return new Date(value)
    .toLocaleDateString(intlLocales[locale] ?? 'en-GB', { timeZone: TIME_ZONE, month: 'short' })
    .replace('.', '')
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
