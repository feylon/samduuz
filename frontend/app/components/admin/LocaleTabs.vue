<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import type { LocaleSuffix } from '~/types/api'
import { adminLocales } from '~/constants/admin'

const props = defineProps<{ filled?: (suffix: LocaleSuffix) => boolean }>()

defineSlots<{ default(props: { suffix: LocaleSuffix, label: string }): unknown }>()

const items = computed<(TabsItem & { suffix: LocaleSuffix })[]>(() =>
  adminLocales.map(locale => ({
    label: locale.label,
    icon: locale.icon,
    value: locale.suffix,
    suffix: locale.suffix,
    badge: props.filled && !props.filled(locale.suffix) ? { label: 'bo‘sh', color: 'neutral', variant: 'subtle', size: 'sm' } : undefined
  }))
)
</script>

<template>
  <UTabs
    :items="items"
    default-value="Uz"
    variant="link"
    :unmount-on-hide="false"
    :ui="{ list: 'overflow-x-auto', trigger: 'shrink-0', content: 'pt-5' }"
  >
    <template #content="{ item }">
      <slot
        :suffix="item.suffix"
        :label="item.label as string"
      />
    </template>
  </UTabs>
</template>
