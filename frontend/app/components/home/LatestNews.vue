<script setup lang="ts">
import type { Paginated, PublicationListItem } from '~/types/api'

const { data, pending, error } = await usePublicFetch<Paginated<PublicationListItem>>('/news', {
  query: { page: 1, pageSize: 5 }
})

const localePath = useLocalePath()
const featured = computed(() => data.value?.items[0])
const rest = computed(() => data.value?.items.slice(1) ?? [])
</script>

<template>
  <section class="container-page py-16 sm:py-20 lg:py-24">
    <ContentSectionHeading
      :eyebrow="$t('home.news_eyebrow')"
      :title="$t('home.news_title')"
      :to="localePath('/news')"
      :link-label="$t('home.all_news')"
    />

    <div v-if="pending && !data" class="grid gap-6 lg:grid-cols-2">
      <ContentCardSkeleton />
      <div class="grid gap-6 sm:grid-cols-2">
        <ContentCardSkeleton v-for="n in 2" :key="n" />
      </div>
    </div>

    <ContentEmptyState v-else-if="error || !featured" icon="i-lucide-newspaper" />

    <div v-else class="grid gap-6 lg:grid-cols-2">
      <div v-reveal>
        <ContentPublicationCard :item="featured" base="/news" featured />
      </div>
      <div class="grid gap-6 sm:grid-cols-2">
        <div v-for="(item, index) in rest" :key="item.id" v-reveal="(index + 1) * 80">
          <ContentPublicationCard :item="item" base="/news" />
        </div>
      </div>
    </div>
  </section>
</template>
