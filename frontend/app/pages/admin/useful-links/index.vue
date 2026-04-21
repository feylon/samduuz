<script setup lang="ts">
import type { UsefulLink } from '~/types/api'

definePageMeta({ layout: 'admin', i18n: false })
useHead({ title: 'Foydali havolalar' })

const api = useAdminApi()
const media = useMedia()
const confirm = useConfirm()

const links = ref<UsefulLink[]>([])
const loading = ref(true)

const load = async () => {
  loading.value = true
  try {
    links.value = await api.get<UsefulLink[]>('/useful-links/full')
  } finally {
    loading.value = false
  }
}
onMounted(load)

const removeLink = async (link: UsefulLink) => {
  const ok = await confirm({ title: 'Havolani o‘chirasizmi?', description: `“${link.nameUz}”`, confirmLabel: 'O‘chirish' })
  if (!ok) return
  await api.remove(`/useful-links/${link.id}`)
  await load()
}
</script>

<template>
  <AdminPage
    title="Foydali havolalar"
    description="Bosh sahifaning pastki qismidagi hamkor saytlar lentasi."
  >
    <template #actions>
      <UButton
        to="/admin/useful-links/create"
        icon="i-lucide-plus"
      >
        Qo‘shish
      </UButton>
    </template>

    <div
      v-if="loading"
      class="space-y-3"
    >
      <USkeleton
        v-for="n in 4"
        :key="n"
        class="h-20 rounded-2xl"
      />
    </div>
    <AdminEmptyState
      v-else-if="!links.length"
      title="Havolalar yo‘q"
      icon="i-lucide-link"
    />
    <ul
      v-else
      class="space-y-3"
    >
      <li
        v-for="link in links"
        :key="link.id"
        class="flex items-center gap-4 rounded-2xl border border-default bg-default p-3 sm:p-4"
        :class="{ 'opacity-60': !link.isActive }"
      >
        <span class="hidden w-6 text-center text-sm font-semibold text-dimmed sm:block">{{ link.priority }}</span>
        <img
          :src="media(link.imagePath)"
          alt=""
          class="size-12 shrink-0 rounded-xl bg-elevated object-contain p-1"
        >
        <div class="min-w-0 flex-1">
          <p class="truncate font-medium text-highlighted">
            {{ link.nameUz }}
          </p>
          <a
            :href="link.externalLink"
            target="_blank"
            class="truncate text-xs text-primary hover:underline"
          >{{ link.externalLink }}</a>
        </div>
        <UBadge
          v-if="!link.isActive"
          label="Yashirin"
          color="neutral"
          variant="subtle"
          class="hidden sm:inline-flex"
        />
        <div class="flex gap-1">
          <UButton
            :to="`/admin/useful-links/${link.id}`"
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
            @click="removeLink(link)"
          />
        </div>
      </li>
    </ul>
  </AdminPage>
</template>
