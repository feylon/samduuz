<script setup lang="ts">
import type { Menu } from '~/types/api'

const props = withDefaults(defineProps<{ item: Menu, depth?: number }>(), { depth: 0 })
const emit = defineEmits<{ add: [Menu], edit: [Menu], remove: [Menu] }>()

const expanded = ref(true)

const target = computed(() => {
  if (props.item.externalLink) return { icon: 'i-lucide-external-link', text: props.item.externalLink }
  if (props.item.relatedPage) return { icon: 'i-lucide-file-text', text: `/pages/${props.item.relatedPage.slug}` }
  return { icon: 'i-lucide-folder-tree', text: 'Faqat guruh' }
})
</script>

<template>
  <li>
    <div
      class="group flex items-center gap-2 rounded-xl border border-default bg-default p-2 pr-2 transition-colors hover:border-primary/30 sm:gap-3 sm:p-3"
      :class="depth === 0 ? 'shadow-sm' : ''"
    >
      <UButton
        v-if="item.children.length"
        :icon="expanded ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
        color="neutral"
        variant="ghost"
        size="xs"
        :aria-label="expanded ? 'Yig‘ish' : 'Yoyish'"
        @click="expanded = !expanded"
      />
      <span
        v-else
        class="w-6"
      />
      <span class="flex size-7 shrink-0 items-center justify-center rounded-lg bg-elevated text-xs font-semibold text-muted">{{ item.priority }}</span>
      <div class="min-w-0 flex-1">
        <p class="truncate font-medium text-highlighted">
          {{ item.nameUz }}
        </p>
        <p class="flex items-center gap-1 truncate text-xs text-dimmed">
          <UIcon
            :name="target.icon"
            class="size-3 shrink-0"
          />
          <span class="truncate">{{ target.text }}</span>
        </p>
      </div>
      <div class="flex shrink-0 gap-0.5">
        <UTooltip
          v-if="depth < 2"
          text="Ichki element qo‘shish"
        >
          <UButton
            icon="i-lucide-plus"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="emit('add', item)"
          />
        </UTooltip>
        <UTooltip text="Tahrirlash">
          <UButton
            icon="i-lucide-pencil"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="emit('edit', item)"
          />
        </UTooltip>
        <UTooltip text="O‘chirish">
          <UButton
            icon="i-lucide-trash-2"
            color="error"
            variant="ghost"
            size="sm"
            @click="emit('remove', item)"
          />
        </UTooltip>
      </div>
    </div>
    <ul
      v-if="item.children.length && expanded"
      class="ml-5 mt-2 space-y-2 border-l-2 border-dashed border-default pl-3 sm:ml-8 sm:pl-4"
    >
      <AdminMenuNode
        v-for="child in item.children"
        :key="child.id"
        :item="child"
        :depth="depth + 1"
        @add="emit('add', $event)"
        @edit="emit('edit', $event)"
        @remove="emit('remove', $event)"
      />
    </ul>
  </li>
</template>
