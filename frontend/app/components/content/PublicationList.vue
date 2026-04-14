<script setup lang="ts">
import type { Paginated, PublicationListItem } from '~/types/api'

const props = defineProps<{
  base: '/news' | '/announcements'
  title: string
  description: string
  icon: string
}>()

const route = useRoute()
const router = useRouter()

const page = computed(() => Math.max(1, Number(route.query.page) || 1))
const search = ref(typeof route.query.q === 'string' ? route.query.q : '')
const appliedSearch = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''))
const pageSize = 12

const { data, pending, error, refresh } = await usePublicFetch<Paginated<PublicationListItem>>(props.base, {
  query: computed(() => ({
    page: page.value,
    pageSize,
    ...(appliedSearch.value ? { search: appliedSearch.value } : {})
  }))
})

let searchTimer: ReturnType<typeof setTimeout> | undefined
watch(search, (value) => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    router.replace({ query: { ...route.query, q: value.trim() || undefined, page: undefined } })
  }, 400)
})

const goToPage = (value: number) => {
  router.push({ query: { ...route.query, page: value > 1 ? value : undefined } })
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}

useSiteSeo({
  title: () => (page.value > 1 ? `${props.title} — ${page.value}` : props.title),
  description: () => props.description
})
</script>

<template>
  <div>
    <ContentPageHero :title="title" :description="description" :breadcrumbs="[{ label: title }]">
      <div class="mt-8 max-w-md">
        <UInput
          v-model="search"
          :placeholder="$t('content.search')"
          icon="i-lucide-search"
          size="xl"
          class="w-full"
          :ui="{ base: 'bg-white/10 text-white placeholder:text-white/50 ring-white/20 focus-visible:ring-gold-400 rounded-full', leadingIcon: 'text-white/60' }"
          :aria-label="$t('content.search')"
        />
      </div>
    </ContentPageHero>

    <section class="container-page py-10 sm:py-14">
      <div v-if="pending && !data" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ContentCardSkeleton v-for="n in 6" :key="n" />
      </div>

      <ContentEmptyState
        v-else-if="error"
        icon="i-lucide-wifi-off"
        :title="$t('content.load_error')"
        text=""
      >
        <UButton class="mt-4" icon="i-lucide-refresh-cw" @click="() => refresh()">
          {{ $t('content.retry') }}
        </UButton>
      </ContentEmptyState>

      <ContentEmptyState
        v-else-if="!data?.items.length"
        :icon="icon"
        :title="appliedSearch ? $t('content.nothing_found', { q: appliedSearch }) : undefined"
      />

      <template v-else>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" :class="{ 'opacity-60 transition-opacity': pending }">
          <div v-for="(item, index) in data.items" :key="item.id" v-reveal="(index % 3) * 70">
            <ContentPublicationCard :item="item" :base="base" :eager="index < 3" />
          </div>
        </div>

        <div v-if="data.meta.totalPages > 1" class="mt-12 flex justify-center">
          <UPagination
            :page="page"
            :total="data.meta.totalCount"
            :items-per-page="pageSize"
            :sibling-count="1"
            show-edges
            @update:page="goToPage"
          />
        </div>
      </template>
    </section>
  </div>
</template>
