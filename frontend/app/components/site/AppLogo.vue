<script setup lang="ts">
withDefaults(defineProps<{ inverted?: boolean, compact?: boolean }>(), {
  inverted: false,
  compact: false
})
</script>

<template>
  <NuxtLinkLocale to="/" class="group flex min-w-0 items-center gap-3" :aria-label="$t('site.full')">
    <span class="relative shrink-0 rounded-full bg-white p-0.5 shadow-sm ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-105">
      <img
        src="/pics/logo.webp"
        :alt="$t('site.short')"
        width="56"
        height="56"
        class="size-11 sm:size-13 rounded-full object-contain"
      >
    </span>
    <span v-if="!compact" class="min-w-0 leading-tight">
      <span
        class="block truncate text-[11px] font-medium uppercase tracking-wider sm:text-xs"
        :class="inverted ? 'text-white/70' : 'text-muted'"
      >
        {{ $t('site.line1') }}
      </span>
      <span
        class="font-display block truncate text-sm font-bold sm:text-base"
        :class="inverted ? 'text-white' : 'text-highlighted'"
      >
        {{ $t('site.line2') }}
      </span>
    </span>
  </NuxtLinkLocale>
</template>
