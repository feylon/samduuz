<script setup lang="ts">
withDefaults(defineProps<{ title: string, text?: string, icon?: string }>(), { icon: 'i-lucide-inbox' })
</script>

<template>
  <div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-default px-6 py-14 text-center">
    <div class="mb-3 flex size-12 items-center justify-center rounded-full bg-elevated">
      <UIcon
        :name="icon"
        class="size-6 text-muted"
      />
    </div>
    <p class="font-semibold text-highlighted">
      {{ title }}
    </p>
    <p
      v-if="text"
      class="mt-1 max-w-sm text-sm text-muted"
    >
      {{ text }}
    </p>
    <slot />
  </div>
</template>
