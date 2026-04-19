<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Paginated, Publication } from '~/types/api'

const props = defineProps<{
  endpoint: '/news' | '/announcements'
  publicBase: string
  noun: string
}>()

const api = useAdminApi()
const media = useMedia()
const confirm = useConfirm()
const { siteUrl } = useRuntimeConfig().public
const UBadge = resolveComponent('UBadge')

const page = ref(1)
const pageSize = 15
const search = ref('')
const debounced = useDebounced(search, 350)
const loading = ref(false)
const result = ref<Paginated<Publication> | null>(null)

const load = async () => {
  loading.value = true
  try {
    result.value = await api.get<Paginated<Publication>>(`${props.endpoint}/full`, {
      page: page.value,
      pageSize,
      search: debounced.value || undefined
    })
  } finally {
    loading.value = false
  }
}

watch(debounced, () => {
  page.value = 1
  load()
})
watch(page, load)
onMounted(load)

const statusOf = (item: Publication) => {
  if (!item.isPublished) return { label: 'Qoralama', color: 'neutral' as const }
  if (new Date(item.publishedAt) > new Date()) return { label: 'Rejalashtirilgan', color: 'warning' as const }
  return { label: 'Chop etilgan', color: 'success' as const }
}

const removeItem = async (item: Publication) => {
  const ok = await confirm({
    title: `${props.noun}ni o‘chirasizmi?`,
    description: `“${item.titleUz}” saytdan olib tashlanadi.`,
    confirmLabel: 'O‘chirish'
  })
  if (!ok) return
  await api.remove(`${props.endpoint}/${item.id}`)
  if (result.value?.items.length === 1 && page.value > 1) page.value -= 1
  else await load()
}

const columns: TableColumn<Publication>[] = [
  { accessorKey: 'titleUz', header: 'Sarlavha' },
  {
    accessorKey: 'isPublished',
    header: 'Holati',
    meta: { class: { th: 'hidden md:table-cell', td: 'hidden md:table-cell' } },
    cell: ({ row }) => {
      const status = statusOf(row.original)
      return h(UBadge, { color: status.color, variant: 'subtle' }, () => status.label)
    }
  },
  {
    accessorKey: 'publishedAt',
    header: 'Sana',
    meta: { class: { th: 'hidden lg:table-cell', td: 'hidden lg:table-cell whitespace-nowrap text-muted' } },
    cell: ({ row }) => formatDate(row.original.publishedAt, 'uz', true)
  },
  {
    accessorKey: 'views',
    header: 'Ko‘rish',
    meta: { class: { th: 'hidden sm:table-cell text-right', td: 'hidden sm:table-cell text-right tabular-nums text-muted' } }
  },
  { id: 'actions', header: '', meta: { class: { td: 'text-right' } } }
]
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <UInput
        v-model="search"
        icon="i-lucide-search"
        placeholder="Sarlavha yoki slug bo‘yicha qidirish"
        class="w-full sm:max-w-sm"
      />
      <p
        v-if="result"
        class="text-sm text-muted"
      >
        Jami: <span class="font-semibold text-highlighted">{{ result.meta.totalCount }}</span>
      </p>
    </div>

    <div class="overflow-hidden rounded-2xl border border-default bg-default">
      <UTable
        :data="result?.items ?? []"
        :columns="columns"
        :loading="loading"
        :ui="{ td: 'py-3', th: 'bg-elevated/40' }"
      >
        <template #titleUz-cell="{ row }">
          <NuxtLink
            :to="`/admin${endpoint}/${row.original.id}`"
            class="group flex min-w-0 items-center gap-3"
          >
            <img
              :src="media(row.original.mainImagePath)"
              alt=""
              class="h-12 w-16 shrink-0 rounded-lg bg-elevated object-cover"
              loading="lazy"
            >
            <div class="min-w-0">
              <p class="max-w-[52vw] truncate sm:max-w-md font-medium text-highlighted group-hover:text-primary">{{ row.original.titleUz }}</p>
              <p class="max-w-[52vw] truncate sm:max-w-md font-mono text-xs text-dimmed">/{{ row.original.slug }}</p>
            </div>
          </NuxtLink>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex justify-end gap-1">
            <UTooltip text="Saytda ko‘rish">
              <UButton
                :to="`${siteUrl}${publicBase}/${row.original.slug}`"
                target="_blank"
                icon="i-lucide-external-link"
                color="neutral"
                variant="ghost"
                size="sm"
              />
            </UTooltip>
            <UTooltip text="Tahrirlash">
              <UButton
                :to="`/admin${endpoint}/${row.original.id}`"
                icon="i-lucide-pencil"
                color="neutral"
                variant="ghost"
                size="sm"
              />
            </UTooltip>
            <UTooltip text="O‘chirish">
              <UButton
                icon="i-lucide-trash-2"
                color="error"
                variant="ghost"
                size="sm"
                @click="removeItem(row.original)"
              />
            </UTooltip>
          </div>
        </template>
        <template #empty>
          <AdminEmptyState
            :title="debounced ? 'Hech narsa topilmadi' : `Hozircha ${noun.toLowerCase()} yo‘q`"
            :text="debounced ? 'Boshqa so‘z bilan qidirib ko‘ring' : 'Birinchi materialni qo‘shing'"
            icon="i-lucide-newspaper"
            class="m-4 border-0"
          />
        </template>
      </UTable>
    </div>

    <div
      v-if="result && result.meta.totalPages > 1"
      class="flex justify-center"
    >
      <UPagination
        v-model:page="page"
        :total="result.meta.totalCount"
        :items-per-page="pageSize"
      />
    </div>
  </div>
</template>
