<script setup lang="ts">
import type { PageOption } from '~/types/api'
import { pageTypeMeta } from '~/constants/admin'

const model = defineModel<number | null | undefined>({ default: null })

const api = useAdminApi()
const options = ref<PageOption[]>([])
const loading = ref(true)

onMounted(async () => {
  options.value = await api.get<PageOption[]>('/pages/options').catch(() => [])
  loading.value = false
})

const items = computed(() =>
  options.value.map(page => ({
    label: page.titleUz,
    value: page.id,
    description: `/pages/${page.slug}`,
    icon: pageTypeMeta.find(type => type.value === page.pageType)?.icon
  }))
)
</script>

<template>
  <USelectMenu
    v-model="model"
    :items="items"
    value-key="value"
    :loading="loading"
    placeholder="Sahifani tanlang"
    :search-input="{ placeholder: 'Sahifa nomi bo‘yicha qidirish' }"
    clear
    class="w-full"
  />
</template>
