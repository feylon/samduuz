interface SitemapEntry {
  slug: string
  updatedAt: string
}

interface SitemapPayload {
  pages: SitemapEntry[]
  news: SitemapEntry[]
  announcements: SitemapEntry[]
}

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

  const body = routes.map(route => [
    '  <url>',
    `    <loc>${escapeXml(`${site}${route.path === '/' ? '' : route.path}`)}</loc>`,
    route.lastmod ? `    <lastmod>${new Date(route.lastmod).toISOString()}</lastmod>` : '',
    `    <changefreq>${route.changefreq}</changefreq>`,
    `    <priority>${route.priority}</priority>`,
    '  </url>'
  ].filter(Boolean).join('\n')).join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`
}, { maxAge: 60 * 30, name: 'sitemap' })
