interface SitemapEntry {
  slug: string
  updatedAt: string
}

interface SitemapPayload {
  pages: SitemapEntry[]
  news: SitemapEntry[]
  announcements: SitemapEntry[]
}

const locales = [
  { code: 'uz', hreflang: 'uz', prefix: '' },
  { code: 'kr', hreflang: 'uz-Cyrl', prefix: '/kr' },
  { code: 'ru', hreflang: 'ru', prefix: '/ru' },
  { code: 'en', hreflang: 'en', prefix: '/en' }
]

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export default defineCachedEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const site = config.public.siteUrl.replace(/\/+$/, '')
  const apiBase = config.apiInternal || config.public.apiBase

  let payload: SitemapPayload = { pages: [], news: [], announcements: [] }
  try {
    const response = await $fetch<{ data: SitemapPayload }>('/seo/sitemap', { baseURL: apiBase })
    payload = response.data
  } catch (error) {
    console.error('Sitemap uchun ma’lumot olinmadi:', error)
  }

  const routes: { path: string, lastmod?: string, priority: string, changefreq: string }[] = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/news', priority: '0.9', changefreq: 'daily' },
    { path: '/announcements', priority: '0.8', changefreq: 'daily' },
    ...payload.news.map(item => ({ path: `/news/${item.slug}`, lastmod: item.updatedAt, priority: '0.7', changefreq: 'weekly' })),
    ...payload.announcements.map(item => ({ path: `/announcements/${item.slug}`, lastmod: item.updatedAt, priority: '0.6', changefreq: 'weekly' })),
    ...payload.pages.map(item => ({ path: `/pages/${item.slug}`, lastmod: item.updatedAt, priority: '0.6', changefreq: 'monthly' }))
  ]

  const urlFor = (prefix: string, path: string) => `${site}${prefix}${path === '/' && prefix ? '' : path}`

  const body = routes.flatMap(route =>
    locales.map((locale) => {
      const alternates = locales
        .map(alt => `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${escapeXml(urlFor(alt.prefix, route.path))}"/>`)
        .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(urlFor('', route.path))}"/>`)
        .join('\n')

      return [
        '  <url>',
        `    <loc>${escapeXml(urlFor(locale.prefix, route.path))}</loc>`,
        route.lastmod ? `    <lastmod>${new Date(route.lastmod).toISOString()}</lastmod>` : '',
        `    <changefreq>${route.changefreq}</changefreq>`,
        `    <priority>${route.priority}</priority>`,
        alternates,
        '  </url>'
      ].filter(Boolean).join('\n')
    })
  ).join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>`
}, { maxAge: 60 * 30, name: 'sitemap' })
