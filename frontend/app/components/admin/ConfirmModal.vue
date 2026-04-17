<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description?: string
  confirmLabel?: string
  danger?: boolean
}>(), { confirmLabel: 'Tasdiqlash', danger: true })

const emit = defineEmits<{ close: [boolean] }>()
</script>

<template>
  <UModal
    :title="title"
    :description="description"
    :dismissible="true"
    :ui="{ footer: 'justify-end' }"
    @update:open="(open: boolean) => !open && emit('close', false)"
  >
    <template #footer>
      <UButton
        color="neutral"
        variant="outline"
        @click="emit('close', false)"
      >
        Bekor qilish
      </UButton>
      <UButton
        :color="danger ? 'error' : 'primary'"
        :icon="danger ? 'i-lucide-trash-2' : 'i-lucide-check'"
        @click="emit('close', true)"
      >
        {{ confirmLabel }}
      </UButton>
    </template>
  </UModal>
</template>
