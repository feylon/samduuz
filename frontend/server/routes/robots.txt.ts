export default defineEventHandler((event) => {
  const site = useRuntimeConfig(event).public.siteUrl.replace(/\/+$/, '')
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /auth',
    '',
    `Sitemap: ${site}/sitemap.xml`,
    ''
  ].join('\n')
})
