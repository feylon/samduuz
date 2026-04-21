<script setup lang="ts">
import type { Paginated, PublicationListItem } from '~/types/api'

const { data, pending } = await usePublicFetch<Paginated<PublicationListItem>>('/announcements', {
  query: { page: 1, pageSize: 4 }
})

const localePath = useLocalePath()
</script>

<template>
  <section class="relative overflow-hidden bg-muted/60 py-16 sm:py-20 lg:py-24">
    <div class="pointer-events-none absolute inset-0 bg-pattern opacity-60" />
    <div class="container-page relative">
      <ContentSectionHeading
        :eyebrow="$t('home.announcements_eyebrow')"
        :title="$t('home.announcements_title')"
        :to="localePath('/announcements')"
        :link-label="$t('home.all_announcements')"
      />

      <div
        v-if="pending && !data"
        class="grid gap-4 md:grid-cols-2"
      >
        <USkeleton
          v-for="n in 4"
          :key="n"
          class="h-28 rounded-2xl"
        />
      </div>
      <ContentEmptyState
        v-else-if="!data?.items.length"
        icon="i-lucide-megaphone"
      />
      <div
        v-else
        class="grid gap-4 md:grid-cols-2"
      >
        <div
          v-for="(item, index) in data.items"
          :key="item.id"
          v-reveal="index * 70"
        >
          <ContentAnnouncementRow :item="item" />
        </div>
      </div>
    </div>
  </section>
</template>
