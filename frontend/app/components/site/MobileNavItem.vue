<script setup lang="ts">
import type { PublicMenu } from '~/types/api'

const props = withDefaults(defineProps<{ item: PublicMenu, depth?: number }>(), { depth: 0 })
const emit = defineEmits<{ navigate: [] }>()

const expanded = ref(false)
const hasChildren = computed(() => props.item.children.length > 0)
</script>

<template>
  <li>
    <div class="flex items-center">
      <SiteMenuLink
        v-if="item.link"
        :link="item.link"
        :is-external="item.isExternal"
        class="flex-1 rounded-lg px-3 py-2.5 transition-colors hover:bg-elevated hover:text-primary"
        :class="depth === 0 ? 'text-base font-semibold text-highlighted' : 'text-sm text-default'"
        @click="emit('navigate')"
      >
        {{ item.name }}
      </SiteMenuLink>
      <button
        v-else
        type="button"
        class="flex-1 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-elevated"
        :class="depth === 0 ? 'text-base font-semibold text-highlighted' : 'text-sm text-default'"
        :aria-expanded="expanded"
        @click="expanded = !expanded"
      >
        {{ item.name }}
      </button>
      <UButton
        v-if="hasChildren"
        color="neutral"
        variant="ghost"
        size="sm"
        :icon="expanded ? 'i-lucide-minus' : 'i-lucide-plus'"
        :aria-expanded="expanded"
        :aria-label="item.name"
        @click="expanded = !expanded"
      />
    </div>
    <ul
      v-if="hasChildren"
      v-show="expanded"
      class="ml-3 mt-1 space-y-0.5 border-l-2 border-secondary/40 pl-2"
    >
      <SiteMobileNavItem
        v-for="child in item.children"
        :key="child.id"
        :item="child"
        :depth="depth + 1"
        @navigate="emit('navigate')"
      />
    </ul>
  </li>
</template>
