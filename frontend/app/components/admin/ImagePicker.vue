<script setup lang="ts">
const model = defineModel<string | null | undefined>({ default: '' })

withDefaults(defineProps<{ aspect?: string, label?: string }>(), {
  aspect: 'aspect-[16/9]',
  label: 'Rasm tanlash'
})

const media = useMedia()
const open = ref(false)

const onSelect = (url: string) => {
  model.value = url
  open.value = false
}
</script>

<template>
  <div class="space-y-2">
    <div
      class="group relative overflow-hidden rounded-xl border border-dashed border-accented bg-elevated/50 transition-colors hover:border-primary"
      :class="aspect"
    >
      <template v-if="model">
        <img
          :src="media(model)"
          alt=""
          class="size-full object-cover"
        >
        <div class="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <UButton
            icon="i-lucide-replace"
            color="neutral"
            @click="open = true"
          >
            Almashtirish
          </UButton>
          <UButton
            icon="i-lucide-x"
            color="error"
            aria-label="Olib tashlash"
            @click="model = ''"
          />
        </div>
      </template>
      <button
        v-else
        type="button"
        class="flex size-full flex-col items-center justify-center gap-2 text-muted transition-colors hover:text-primary"
        @click="open = true"
      >
        <UIcon
          name="i-lucide-image-plus"
          class="size-8"
        />
        <span class="text-sm font-medium">{{ label }}</span>
      </button>
    </div>
    <p
      v-if="model"
      class="truncate text-xs text-dimmed"
    >
      {{ model }}
    </p>
    <AdminFileManagerModal
      v-model:open="open"
      accept="image"
      @select="onSelect"
    />
  </div>
</template>
