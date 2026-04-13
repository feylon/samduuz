<script setup lang="ts">
withDefaults(defineProps<{ title?: string, text?: string, icon?: string }>(), {
  icon: 'i-lucide-inbox'
})
</script>

<template>
  <div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-default px-6 py-16 text-center">
    <div class="mb-4 flex size-14 items-center justify-center rounded-full bg-elevated">
      <UIcon :name="icon" class="size-6 text-muted" />
    </div>
    <p class="font-display text-lg font-bold text-highlighted">
      {{ title ?? $t('content.empty_title') }}
    </p>
    <p class="mt-1 max-w-sm text-sm text-muted">
      {{ text ?? $t('content.empty_text') }}
    </p>
    <slot />
  </div>
</template>
