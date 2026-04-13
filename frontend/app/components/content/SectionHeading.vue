<script setup lang="ts">
withDefaults(defineProps<{
  eyebrow?: string
  title: string
  to?: string
  linkLabel?: string
  inverted?: boolean
  center?: boolean
}>(), { inverted: false, center: false })
</script>

<template>
  <div
    class="mb-8 flex flex-col gap-4 sm:mb-10"
    :class="center ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between'"
  >
    <div v-reveal>
      <p
        v-if="eyebrow"
        class="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]"
        :class="[inverted ? 'text-gold-300' : 'text-secondary', center ? 'justify-center' : '']"
      >
        <span class="h-px w-6 bg-current" />
        {{ eyebrow }}
      </p>
      <h2
        class="font-display text-2xl font-extrabold sm:text-3xl lg:text-4xl"
        :class="inverted ? 'text-white' : 'text-highlighted'"
      >
        {{ title }}
      </h2>
    </div>
    <UButton
      v-if="to && linkLabel"
      :to="to"
      :color="inverted ? 'secondary' : 'primary'"
      variant="link"
      trailing-icon="i-lucide-arrow-right"
      class="group -ml-2.5 self-start px-2.5 font-semibold sm:ml-0 sm:self-auto"
      :ui="{ trailingIcon: 'transition-transform group-hover:translate-x-1' }"
    >
      {{ linkLabel }}
    </UButton>
  </div>
</template>
