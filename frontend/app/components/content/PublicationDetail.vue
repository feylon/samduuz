<script setup lang="ts">
import type { PublicationDetail } from '~/types/api'

const props = defineProps<{
  base: '/news' | '/announcements'
  sectionTitle: string
  relatedTitle: string
}>()

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const { locale } = useI18n()
const media = useMedia()
const localePath = useLocalePath()
const { siteUrl } = useRuntimeConfig().public
const baseURL = useApiBase()

const { data: item, error } = await usePublicFetch<PublicationDetail>(() => `${props.base}/${slug.value}`)

if (error.value || !item.value) {
  throw createError({ statusCode: error.value?.statusCode ?? 404, statusMessage: 'Not Found', fatal: true })
}

const likes = ref(item.value.likes)
const liked = ref(false)
const storageKey = computed(() => `liked:${props.base}:${item.value?.id}`)

onMounted(() => {
  liked.value = localStorage.getItem(storageKey.value) === '1'
})

const like = async () => {
  if (liked.value || !item.value) return
  liked.value = true
  likes.value += 1
  localStorage.setItem(storageKey.value, '1')
  try {
    await $fetch(`${props.base}/${item.value.slug}/like`, { baseURL, method: 'POST' })
  } catch {
    likes.value -= 1
  }
}

const imageUrl = computed(() => media(item.value?.mainImagePath))
const { canonical } = useSiteSeo({
  title: () => item.value?.title,
  description: () => item.value?.description || truncate(stripHtml(item.value?.content), 160),
  image: imageUrl,
  type: 'article',
  publishedTime: () => item.value?.publishedAt,
  modifiedTime: () => item.value?.updatedAt
})

useJsonLd(() => item.value && ({
  '@type': props.base === '/news' ? 'NewsArticle' : 'Article',
  'headline': item.value.title,
  'description': item.value.description,
  'image': imageUrl.value ? [imageUrl.value] : undefined,
  'datePublished': item.value.publishedAt,
  'dateModified': item.value.updatedAt,
  'inLanguage': locale.value,
  'mainEntityOfPage': canonical.value,
  'publisher': {
    '@type': 'CollegeOrUniversity',
    'name': 'Samarqand davlat universiteti',
    'logo': { '@type': 'ImageObject', 'url': `${siteUrl}/icon-512.png` }
  }
}), 'article')
</script>

<template>
  <div v-if="item">
    <ContentPageHero
      :title="item.title"
      :breadcrumbs="[{ label: sectionTitle, to: localePath(base) }, { label: item.title }]"
    >
      <div class="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
        <span class="flex items-center gap-2">
          <UIcon
            name="i-lucide-calendar"
            class="size-4 text-gold-400"
          />
          <time :datetime="item.publishedAt">{{ formatDate(item.publishedAt, locale, true) }}</time>
        </span>
        <span class="flex items-center gap-2">
          <UIcon
            name="i-lucide-eye"
            class="size-4 text-gold-400"
          />
          {{ $t('content.views', { n: formatNumber(item.views) }) }}
        </span>
      </div>
    </ContentPageHero>

    <div class="container-page grid gap-10 py-10 sm:py-14 lg:grid-cols-12">
      <article class="min-w-0 lg:col-span-8">
        <figure
          v-if="item.mainImagePath"
          class="mb-8 overflow-hidden rounded-2xl bg-elevated shadow-sm"
        >
          <img
            :src="imageUrl"
            :alt="item.title"
            width="1200"
            height="750"
            fetchpriority="high"
            class="aspect-[16/9] w-full object-cover"
          >
        </figure>

        <p
          v-if="item.description"
          class="mb-8 border-l-4 border-secondary pl-5 text-lg font-medium leading-relaxed text-highlighted sm:text-xl"
        >
          {{ item.description }}
        </p>

        <div
          class="rich-content"
          v-html="item.content"
        />

        <div class="mt-12 flex flex-col gap-4 border-t border-default pt-6 sm:flex-row sm:items-center sm:justify-between">
          <ContentShareButtons
            :title="item.title"
            :url="canonical"
          />
          <UButton
            :icon="liked ? 'i-lucide-heart' : 'i-lucide-heart'"
            :color="liked ? 'error' : 'neutral'"
            :variant="liked ? 'soft' : 'outline'"
            class="self-start rounded-full"
            :aria-pressed="liked"
            @click="like"
          >
            {{ liked ? $t('content.liked') : $t('content.likes') }} · {{ likes }}
          </UButton>
        </div>
      </article>

      <aside
        v-if="item.related.length"
        class="lg:col-span-4"
      >
        <div class="space-y-5 lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]">
          <h2 class="font-display flex items-center gap-2 text-lg font-bold text-highlighted">
            <span class="h-5 w-1 rounded-full bg-secondary" />
            {{ relatedTitle }}
          </h2>
          <ul class="space-y-3">
            <li
              v-for="related in item.related"
              :key="related.id"
            >
              <NuxtLink
                :to="localePath(`${base}/${related.slug}`)"
                class="group flex gap-3 rounded-xl p-2 transition-colors hover:bg-elevated"
              >
                <img
                  v-if="related.mainImagePath"
                  :src="media(related.mainImagePath)"
                  :alt="related.title"
                  loading="lazy"
                  width="112"
                  height="80"
                  class="h-20 w-28 shrink-0 rounded-lg object-cover"
                >
                <div class="min-w-0">
                  <p class="text-sm font-semibold leading-snug text-highlighted line-clamp-3 group-hover:text-primary">
                    {{ related.title }}
                  </p>
                  <time
                    :datetime="related.publishedAt"
                    class="mt-1 block text-xs text-dimmed"
                  >
                    {{ formatDate(related.publishedAt, locale) }}
                  </time>
                </div>
              </NuxtLink>
            </li>
          </ul>
          <UButton
            :to="localePath(base)"
            variant="soft"
            block
            trailing-icon="i-lucide-arrow-right"
          >
            {{ sectionTitle }}
          </UButton>
        </div>
      </aside>
    </div>
  </div>
</template>
