<script setup lang="ts">
import { quickLinks } from '~/constants/site'
</script>

<template>
  <div class="container-page relative z-10 -mt-14 sm:-mt-16">
    <div class="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-default shadow-2xl shadow-brand-950/10 ring-1 ring-default md:grid-cols-4">
      <a
        v-for="(link, index) in quickLinks"
        :key="link.key"
        v-reveal="index * 70"
        :href="link.href"
        target="_blank"
        rel="noopener"
        class="group flex items-center gap-3 bg-default p-4 transition-colors hover:bg-elevated sm:gap-4 sm:p-6"
      >
        <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-secondary group-hover:text-brand-950 sm:size-12">
          <UIcon :name="link.icon" class="size-5 sm:size-6" />
        </span>
        <span class="min-w-0 text-sm font-semibold leading-tight text-highlighted sm:text-base">
          {{ $t(link.key) }}
        </span>
      </a>
    </div>
  </div>
</template>
