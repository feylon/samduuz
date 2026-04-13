<script setup lang="ts">
import type { PublicSlide } from '~/types/api'

const { data: slides, pending } = await usePublicFetch<PublicSlide[]>('/slides', { default: () => [] })

const media = useMedia()
const localePath = useLocalePath()

const linkOf = (slide: PublicSlide) => {
  if (!slide.link) return undefined
  return slide.isExternal ? slide.link : localePath(slide.link)
}
</script>

<template>
  <section class="relative bg-brand-950" aria-roledescription="carousel">
    <USkeleton v-if="pending && !slides?.length" class="h-[min(72vh,680px)] min-h-[420px] w-full rounded-none" />

    <UCarousel
      v-else-if="slides?.length"
      v-slot="{ item, index }"
      :items="slides"
      :autoplay="slides.length > 1 ? { delay: 6500, stopOnInteraction: false, stopOnMouseEnter: true } : false"
      :fade="true"
      :loop="slides.length > 1"
      :dots="slides.length > 1"
      :arrows="slides.length > 1"
      prev-icon="i-lucide-chevron-left"
      next-icon="i-lucide-chevron-right"
      :prev="{ color: 'neutral', variant: 'solid', class: 'hidden md:inline-flex left-4 lg:left-8 bg-white/15 text-white hover:bg-white/25 ring-0 backdrop-blur' }"
      :next="{ color: 'neutral', variant: 'solid', class: 'hidden md:inline-flex right-4 lg:right-8 bg-white/15 text-white hover:bg-white/25 ring-0 backdrop-blur' }"
      :ui="{
        root: 'relative',
        item: 'basis-full',
        dots: 'absolute bottom-20 sm:bottom-24 inset-x-0 z-10',
        dot: 'w-8 h-1.5 rounded-full bg-white/40 data-[state=active]:bg-gold-400 data-[state=active]:w-12 transition-all'
      }"
    >
      <div class="relative h-[min(72vh,680px)] min-h-[440px] w-full overflow-hidden">
        <img
          :src="media(item.mainImagePath)"
          :alt="item.title"
          :loading="index === 0 ? 'eager' : 'lazy'"
          :fetchpriority="index === 0 ? 'high' : 'auto'"
          decoding="async"
          class="absolute inset-0 size-full scale-105 object-cover"
        >
        <div class="absolute inset-0 bg-gradient-to-r from-brand-950/90 via-brand-950/60 to-brand-950/10" />
        <div class="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-transparent to-transparent" />

        <div class="container-page relative flex h-full items-center pb-16">
          <div class="max-w-2xl text-white">
            <span class="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <span class="size-1.5 rounded-full bg-gold-400" />
              {{ $t('home.hero_badge') }}
            </span>
            <component
              :is="index === 0 ? 'h1' : 'h2'"
              class="font-display text-3xl font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl"
            >
              {{ item.title }}
            </component>
            <p v-if="item.description" class="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              {{ item.description }}
            </p>
            <UButton
              v-if="linkOf(item)"
              :to="linkOf(item)"
              :target="item.isExternal ? '_blank' : undefined"
              color="secondary"
              size="xl"
              trailing-icon="i-lucide-arrow-right"
              class="mt-8 rounded-full px-6 font-semibold text-brand-950"
            >
              {{ $t('home.hero_more') }}
            </UButton>
          </div>
        </div>
      </div>
    </UCarousel>

    <div v-else class="relative flex h-[60vh] min-h-[420px] items-center overflow-hidden">
      <div class="pointer-events-none absolute inset-0 bg-pattern opacity-[0.06] invert" />
      <div class="pointer-events-none absolute -right-20 top-10 size-96 rounded-full bg-gold-500/20 blur-3xl" />
      <div class="container-page relative pb-16 text-white">
        <p class="mb-3 text-sm uppercase tracking-[0.2em] text-gold-300">{{ $t('site.line1') }}</p>
        <h1 class="font-display max-w-3xl text-4xl font-extrabold sm:text-6xl">{{ $t('site.line2') }}</h1>
      </div>
    </div>
  </section>
</template>
