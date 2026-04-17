<script setup lang="ts">
defineProps<{ title?: string, description?: string }>()
</script>

<template>
  <section class="rounded-2xl border border-default bg-default p-4 sm:p-6">
    <header
      v-if="title"
      class="mb-5"
    >
      <h2 class="font-semibold text-highlighted">
        {{ title }}
      </h2>
      <p
        v-if="description"
        class="mt-0.5 text-sm text-muted"
      >
        {{ description }}
      </p>
    </header>
    <div class="space-y-5">
      <slot />
    </div>
  </section>
</template>
