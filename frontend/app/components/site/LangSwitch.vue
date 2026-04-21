<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { localeFlags } from '~/constants/site'

withDefaults(defineProps<{ block?: boolean }>(), { block: false })

const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const current = computed(() => locales.value.find(item => item.code === locale.value))

const items = computed<DropdownMenuItem[]>(() =>
  locales.value.map(item => ({
    label: item.name,
    icon: localeFlags[item.code],
    to: switchLocalePath(item.code),
    active: item.code === locale.value,
    class: item.code === locale.value ? 'font-semibold' : ''
  }))
)
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'end' }"
    :ui="{ content: 'min-w-44' }"
  >
    <UButton
      color="neutral"
      variant="ghost"
      trailing-icon="i-lucide-chevron-down"
      :icon="localeFlags[locale]"
      :block="block"
      :aria-label="$t('nav.language')"
      class="font-medium"
    >
      <span class="uppercase">{{ current?.code === 'kr' ? 'Ўз' : current?.code }}</span>
    </UButton>
  </UDropdownMenu>
</template>
