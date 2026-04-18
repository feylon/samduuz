<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false })
defineProps<{ accept?: 'image' | 'any' }>()
const emit = defineEmits<{ select: [string] }>()
</script>

<template>
  <UModal
    v-model:open="open"
    title="Fayl menejeri"
    description="Faylni tanlash uchun ustiga bosing"
    :ui="{ content: 'sm:max-w-5xl', body: 'p-0 sm:p-0' }"
  >
    <template #body>
      <AdminFileManager
        selectable
        :accept="accept"
        class="p-4 sm:p-6"
        @select="(url: string) => emit('select', url)"
      />
    </template>
  </UModal>
</template>
