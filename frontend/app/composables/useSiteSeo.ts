interface SiteSeoOptions {
  title: MaybeRefOrGetter<string | undefined>
  description?: MaybeRefOrGetter<string | undefined>
  image?: MaybeRefOrGetter<string | undefined>
  type?: 'website' | 'article'
  publishedTime?: MaybeRefOrGetter<string | undefined>
  modifiedTime?: MaybeRefOrGetter<string | undefined>
}

export const useSiteSeo = (options: SiteSeoOptions) => {
  const { siteUrl } = useRuntimeConfig().public
  const route = useRoute()
  const { t } = useI18n()

  const canonical = computed(() => `${siteUrl.replace(/\/+$/, '')}${route.path === '/' ? '' : route.path}`)
  const description = computed(() => toValue(options.description) || t('site.description'))
  const image = computed(() => toValue(options.image) || `${siteUrl.replace(/\/+$/, '')}/og-image.jpg`)

  useSeoMeta({
    title: () => toValue(options.title),
    description,
    ogTitle: () => toValue(options.title),
    ogDescription: description,
    ogImage: image,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogUrl: canonical,
    ogType: options.type ?? 'website',
    ogSiteName: () => t('site.full'),
    twitterCard: 'summary_large_image',
    twitterTitle: () => toValue(options.title),
    twitterDescription: description,
    twitterImage: image,
    articlePublishedTime: () => toValue(options.publishedTime),
    articleModifiedTime: () => toValue(options.modifiedTime)
  })

  useHead({
    link: [{ rel: 'canonical', href: canonical }]
  })

  return { canonical }
}
