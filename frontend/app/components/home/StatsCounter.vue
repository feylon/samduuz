<script setup lang="ts">
const stats = [
  { key: 'home.stat_professors', icon: 'i-lucide-presentation', value: 825 },
  { key: 'home.stat_students', icon: 'i-lucide-graduation-cap', value: 12100 },
  { key: 'home.stat_library', icon: 'i-lucide-library-big', value: 3794575 },
  { key: 'home.stat_bachelors', icon: 'i-lucide-award', value: 76 }
]

const section = ref<HTMLElement | null>(null)
const displayed = ref(stats.map(() => 0))

const animate = () => {
  const started = performance.now()
  const duration = 1800
  const tick = (now: number) => {
    const progress = Math.min((now - started) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    displayed.value = stats.map(stat => stat.value * eased)
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

onMounted(() => {
  if (!section.value) return
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    displayed.value = stats.map(stat => stat.value)
    return
  }
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) return
    animate()
    observer.disconnect()
  }, { threshold: 0.3 })
  observer.observe(section.value)
  onBeforeUnmount(() => observer.disconnect())
})
</script>

<template>
  <section ref="section" class="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-950 to-brand-950 py-16 text-white sm:py-20 lg:py-24">
    <div class="pointer-events-none absolute inset-0 bg-pattern opacity-[0.05] invert" />
    <div class="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
    <div class="container-page relative">
      <ContentSectionHeading :eyebrow="$t('home.stats_eyebrow')" :title="$t('home.stats_title')" inverted center />
      <dl class="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        <div
          v-for="(stat, index) in stats"
          :key="stat.key"
          v-reveal="index * 90"
          class="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center backdrop-blur transition-colors hover:border-gold-400/40 hover:bg-white/[0.07] sm:p-8"
        >
          <div class="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-gold-400/15 text-gold-300 transition-transform group-hover:scale-110 sm:size-14">
            <UIcon :name="stat.icon" class="size-6 sm:size-7" />
          </div>
          <dd class="font-display text-2xl font-extrabold tabular-nums sm:text-4xl">
            {{ formatNumber(displayed[index] ?? 0) }}<span class="text-gold-400">+</span>
          </dd>
          <dt class="mt-2 text-xs leading-snug text-white/65 sm:text-sm">
            {{ $t(stat.key) }}
          </dt>
        </div>
      </dl>
    </div>
  </section>
</template>
