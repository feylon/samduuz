<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'
import type { Page, Paginated } from '~/types/api'
import { pageTypeMeta } from '~/constants/admin'

definePageMeta({ layout: 'admin', i18n: false })
useHead({ title: 'Sahifalar' })

const api = useAdminApi()
const confirm = useConfirm()
const { siteUrl } = useRuntimeConfig().public

const page = ref(1)
const pageSize = 20
const search = ref('')
const debounced = useDebounced(search, 350)
const typeFilter = ref<number | 'all'>('all')
const loading = ref(false)
const result = ref<Paginated<Page> | null>(null)

const load = async () => {
  loading.value = true
  try {
    result.value = await api.get<Paginated<Page>>('/pages/full', {
      page: page.value,
      pageSize,
      search: debounced.value || undefined,
      pageType: typeFilter.value === 'all' ? undefined : typeFilter.value
    })
  } finally {
    loading.value = false
  }
}

watch([debounced, typeFilter], () => {
  page.value = 1
  load()
})
watch(page, load)
onMounted(load)

const createItems: DropdownMenuItem[] = pageTypeMeta.map(type => ({
  label: type.label,
  icon: type.icon,
  to: `/admin/pages/create?type=${type.value}`
}))

const filterItems = [{ label: 'Barcha turlar', value: 'all' as const }, ...pageTypeMeta.map(type => ({ label: type.label, value: type.value }))]

const removePage = async (item: Page) => {
  const ok = await confirm({
    title: 'Sahifani o‘chirasizmi?',
    description: `“${item.titleUz}” sahifasi va unga bog‘langan menyu havolalari ishlamay qoladi.`,
    confirmLabel: 'O‘chirish'
  })
  if (!ok) return
  await api.remove(`/pages/${item.id}`)
  await load()
}

const columns: TableColumn<Page>[] = [
  { accessorKey: 'titleUz', header: 'Sarlavha' },
  { accessorKey: 'pageType', header: 'Turi', meta: { class: { th: 'hidden md:table-cell', td: 'hidden md:table-cell' } } },
  {
    accessorKey: 'updatedAt',
    header: 'Yangilangan',
    meta: { class: { th: 'hidden lg:table-cell', td: 'hidden lg:table-cell whitespace-nowrap text-muted' } },
    cell: ({ row }) => formatDate(row.original.updatedAt, 'uz', true)
  },
  { accessorKey: 'views', header: 'Ko‘rish', meta: { class: { th: 'hidden sm:table-cell text-right', td: 'hidden sm:table-cell text-right text-muted tabular-nums' } } },
  { id: 'actions', header: '', meta: { class: { td: 'text-right' } } }
]
</script>

<template>
  <AdminPage title="Sahifalar">
    <template #actions>
      <UDropdownMenu
        :items="createItems"
        :content="{ align: 'end' }"
      >
        <UButton
          icon="i-lucide-plus"
          trailing-icon="i-lucide-chevron-down"
        >
          Yaratish
        </UButton>
      </UDropdownMenu>
    </template>

    <div class="space-y-4">
      <div class="flex flex-col gap-3 sm:flex-row">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Sarlavha yoki slug"
          class="w-full sm:max-w-sm"
        />
        <USelect
          v-model="typeFilter"
          :items="filterItems"
          class="w-full sm:w-52"
        />
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
              :to="`/admin/pages/${row.original.id}`"
              class="group block min-w-0"
            >
              <p class="flex max-w-md items-center gap-2 truncate font-medium text-highlighted group-hover:text-primary">
                {{ row.original.titleUz }}
                <UBadge
                  v-if="!row.original.isPublished"
                  label="Yashirin"
                  color="neutral"
                  variant="subtle"
                  size="sm"
                />
              </p>
              <p class="max-w-[52vw] truncate sm:max-w-md font-mono text-xs text-dimmed">/pages/{{ row.original.slug }}</p>
            </NuxtLink>
          </template>
          <template #pageType-cell="{ row }">
            <UBadge
              :icon="pageTypeMeta[row.original.pageType]?.icon"
              :label="pageTypeMeta[row.original.pageType]?.label"
              :color="pageTypeMeta[row.original.pageType]?.color"
              variant="subtle"
            />
          </template>
          <template #actions-cell="{ row }">
            <div class="flex justify-end gap-1">
              <UButton
                :to="`${siteUrl}/pages/${row.original.slug}`"
                target="_blank"
                icon="i-lucide-external-link"
                color="neutral"
                variant="ghost"
                size="sm"
                aria-label="Saytda ko‘rish"
              />
              <UButton
                :to="`/admin/pages/${row.original.id}`"
                icon="i-lucide-pencil"
                color="neutral"
                variant="ghost"
                size="sm"
                aria-label="Tahrirlash"
              />
              <UButton
                icon="i-lucide-trash-2"
                color="error"
                variant="ghost"
                size="sm"
                aria-label="O‘chirish"
                @click="removePage(row.original)"
              />
            </div>
          </template>
          <template #empty>
            <AdminEmptyState
              title="Sahifalar topilmadi"
              icon="i-lucide-files"
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
  </AdminPage>
</template>
