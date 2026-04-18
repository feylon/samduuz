<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { FileItem } from '~/types/api'

const props = withDefaults(defineProps<{
  selectable?: boolean
  accept?: 'image' | 'any'
  syncRoute?: boolean
}>(), { selectable: false, accept: 'any', syncRoute: false })

const emit = defineEmits<{ select: [string] }>()

const route = useRoute()
const router = useRouter()
const api = useAdminApi()
const media = useMedia()
const confirm = useConfirm()
const toast = useToast()

const localPath = ref('')
const path = computed({
  get: () => (props.syncRoute ? String(route.query.path ?? '') : localPath.value),
  set: (value: string) => {
    if (props.syncRoute) router.replace({ query: { ...route.query, path: value || undefined } })
    else localPath.value = value
  }
})

const filter = ref('')
const files = ref<FileItem[]>([])
const folders = ref<string[]>([])
const loading = ref(false)
const uploading = ref(0)
const dragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const load = async () => {
  loading.value = true
  try {
    const query = { path: path.value || undefined }
    const [fileList, folderList] = await Promise.all([
      api.get<FileItem[]>('/files', query),
      api.get<{ folders: string[] }>('/folders', query)
    ])
    files.value = fileList
    folders.value = folderList.folders
  } catch {
    files.value = []
    folders.value = []
  } finally {
    loading.value = false
  }
}

watch(path, load, { immediate: true })

const segments = computed(() => (path.value ? path.value.split('/') : []))
const crumbs = computed<{ label: string, icon?: string, onClick: () => void }[]>(() => [
  { label: 'uploads', icon: 'i-lucide-hard-drive', onClick: () => { path.value = '' } },
  ...segments.value.map((segment, index) => ({
    label: segment,
    onClick: () => {
      path.value = segments.value.slice(0, index + 1).join('/')
    }
  }))
])

const join = (name: string) => (path.value ? `${path.value}/${name}` : name)
const goUp = () => (path.value = segments.value.slice(0, -1).join('/'))

const visibleFolders = computed(() => folders.value.filter(name => name.toLowerCase().includes(filter.value.toLowerCase())))
const visibleFiles = computed(() =>
  files.value.filter(file => file.name.toLowerCase().includes(filter.value.toLowerCase()))
)

const isSelectable = (file: FileItem) => props.selectable && (props.accept === 'any' || file.kind === 'image')

const fileIcon: Record<FileItem['kind'], string> = {
  image: 'i-lucide-image',
  video: 'i-lucide-film',
  document: 'i-lucide-file-text',
  archive: 'i-lucide-file-archive',
  other: 'i-lucide-file'
}

const uploadFiles = async (list: FileList | File[] | null | undefined) => {
  const items = Array.from(list ?? [])
  if (!items.length) return
  uploading.value = items.length
  let uploaded = 0
  for (const file of items) {
    const form = new FormData()
    form.append('file', file)
    form.append('path', path.value)
    try {
      await api.request('/files', { method: 'POST', body: form })
      uploaded += 1
    } catch {
      continue
    } finally {
      uploading.value -= 1
    }
  }
  if (uploaded) toast.add({ title: `${uploaded} ta fayl yuklandi`, color: 'success', icon: 'i-lucide-upload' })
  if (fileInput.value) fileInput.value.value = ''
  await load()
}

const onDrop = (event: DragEvent) => {
  dragging.value = false
  uploadFiles(event.dataTransfer?.files)
}

const folderModal = reactive({ open: false, mode: 'create' as 'create' | 'rename', oldName: '', name: '', saving: false })

const openFolderModal = (mode: 'create' | 'rename', oldName = '') => {
  Object.assign(folderModal, { open: true, mode, oldName, name: oldName, saving: false })
}

const submitFolder = async () => {
  const name = folderModal.name.trim()
  if (!name) return
  folderModal.saving = true
  try {
    if (folderModal.mode === 'create') {
      await api.save('/folders', { path: path.value, folderName: name })
    } else {
      await api.save('/folders', { path: path.value, oldName: folderModal.oldName, newName: name }, 'PUT')
    }
    folderModal.open = false
    await load()
  } catch {
    folderModal.saving = false
  }
}

const deleteFolder = async (name: string) => {
  const ok = await confirm({
    title: `“${name}” papkasini o‘chirasizmi?`,
    description: 'Papka ichidagi barcha fayllar ham o‘chiriladi. Bu amalni ortga qaytarib bo‘lmaydi.',
    confirmLabel: 'O‘chirish'
  })
  if (!ok) return
  await api.remove('/folders', { path: join(name) })
  await load()
}

const deleteFile = async (file: FileItem) => {
  const ok = await confirm({
    title: `“${file.name}” faylini o‘chirasizmi?`,
    description: 'Fayl saytdagi materiallarda ishlatilgan bo‘lsa, u yerda ko‘rinmay qoladi.',
    confirmLabel: 'O‘chirish'
  })
  if (!ok) return
  await api.remove('/files', { path: file.url })
  await load()
}

const copyLink = async (file: FileItem) => {
  await navigator.clipboard.writeText(media(file.url) ?? file.url)
  toast.add({ title: 'Havola nusxalandi', color: 'success', icon: 'i-lucide-copy' })
}

const folderActions = (name: string): DropdownMenuItem[] => [
  { label: 'Ochish', icon: 'i-lucide-folder-open', onSelect: () => (path.value = join(name)) },
  { label: 'Nomini o‘zgartirish', icon: 'i-lucide-pencil', onSelect: () => openFolderModal('rename', name) },
  { type: 'separator' },
  { label: 'O‘chirish', icon: 'i-lucide-trash-2', color: 'error', onSelect: () => deleteFolder(name) }
]

const fileActions = (file: FileItem): DropdownMenuItem[] => [
  ...(isSelectable(file) ? [{ label: 'Tanlash', icon: 'i-lucide-check', onSelect: () => emit('select', file.url) }] : []),
  { label: 'Ko‘rish', icon: 'i-lucide-external-link', to: media(file.url), target: '_blank' },
  { label: 'Havolani nusxalash', icon: 'i-lucide-copy', onSelect: () => copyLink(file) },
  { type: 'separator' },
  { label: 'O‘chirish', icon: 'i-lucide-trash-2', color: 'error', onSelect: () => deleteFile(file) }
]

const onFileClick = (file: FileItem) => {
  if (isSelectable(file)) emit('select', file.url)
  else window.open(media(file.url), '_blank')
}
</script>

<template>
  <div
    class="relative"
    @dragover.prevent="dragging = true"
    @dragleave.self="dragging = false"
    @drop.prevent="onDrop"
  >
    <div class="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div class="flex min-w-0 items-center gap-1">
        <UButton
          v-if="path"
          icon="i-lucide-corner-left-up"
          color="neutral"
          variant="ghost"
          size="sm"
          aria-label="Yuqoriga"
          @click="goUp"
        />
        <nav class="flex min-w-0 flex-wrap items-center gap-1 text-sm">
          <template
            v-for="(crumb, index) in crumbs"
            :key="index"
          >
            <UIcon
              v-if="index"
              name="i-lucide-chevron-right"
              class="size-3.5 text-dimmed"
            />
            <button
              type="button"
              class="flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-elevated"
              :class="index === crumbs.length - 1 ? 'font-semibold text-highlighted' : 'text-muted'"
              @click="crumb.onClick"
            >
              <UIcon
                v-if="crumb.icon"
                :name="crumb.icon"
                class="size-4"
              />
              {{ crumb.label }}
            </button>
          </template>
        </nav>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <UInput
          v-model="filter"
          icon="i-lucide-search"
          placeholder="Qidirish"
          size="sm"
          class="w-full sm:w-48"
        />
        <UButton
          icon="i-lucide-refresh-cw"
          color="neutral"
          variant="outline"
          size="sm"
          :loading="loading"
          aria-label="Yangilash"
          @click="load"
        />
        <UButton
          icon="i-lucide-folder-plus"
          color="neutral"
          variant="outline"
          size="sm"
          @click="openFolderModal('create')"
        >
          Papka
        </UButton>
        <UButton
          icon="i-lucide-upload"
          size="sm"
          :loading="uploading > 0"
          @click="fileInput?.click()"
        >
          {{ uploading ? `Yuklanmoqda (${uploading})` : 'Yuklash' }}
        </UButton>
        <input
          ref="fileInput"
          type="file"
          class="hidden"
          multiple
          :accept="accept === 'image' ? 'image/*' : undefined"
          @change="uploadFiles(($event.target as HTMLInputElement).files)"
        >
      </div>
    </div>

    <div
      v-if="dragging"
      class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl border-2 border-dashed border-primary bg-primary/5 backdrop-blur-sm"
    >
      <div class="text-center text-primary">
        <UIcon
          name="i-lucide-upload-cloud"
          class="size-10"
        />
        <p class="mt-2 font-semibold">
          Fayllarni shu yerga tashlang
        </p>
      </div>
    </div>

    <div
      v-if="loading && !files.length && !folders.length"
      class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6"
    >
      <USkeleton
        v-for="n in 12"
        :key="n"
        class="aspect-square rounded-xl"
      />
    </div>

    <AdminEmptyState
      v-else-if="!visibleFolders.length && !visibleFiles.length"
      icon="i-lucide-folder-open"
      title="Papka bo‘sh"
      text="Fayllarni yuklash uchun “Yuklash” tugmasini bosing yoki ularni shu yerga sudrab tashlang."
    />

    <div
      v-else
      class="space-y-6"
    >
      <div
        v-if="visibleFolders.length"
        class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
      >
        <div
          v-for="folder in visibleFolders"
          :key="folder"
          class="group flex items-center gap-2 rounded-xl border border-default bg-default p-2 pl-3 transition-colors hover:border-primary/40 hover:bg-elevated/50"
        >
          <button
            type="button"
            class="flex min-w-0 flex-1 items-center gap-2.5 py-1 text-left"
            @dblclick="path = join(folder)"
            @click="path = join(folder)"
          >
            <UIcon
              name="i-lucide-folder"
              class="size-6 shrink-0 text-secondary"
            />
            <span class="truncate text-sm font-medium">{{ folder }}</span>
          </button>
          <UDropdownMenu :items="folderActions(folder)">
            <UButton
              icon="i-lucide-ellipsis-vertical"
              color="neutral"
              variant="ghost"
              size="xs"
              aria-label="Amallar"
            />
          </UDropdownMenu>
        </div>
      </div>

      <div
        v-if="visibleFiles.length"
        class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
      >
        <div
          v-for="file in visibleFiles"
          :key="file.url"
          class="group relative overflow-hidden rounded-xl border border-default bg-default transition-all hover:border-primary/40 hover:shadow-md"
          :class="{ 'opacity-50': selectable && !isSelectable(file) }"
        >
          <button
            type="button"
            class="block w-full text-left"
            :disabled="selectable && !isSelectable(file)"
            @click="onFileClick(file)"
          >
            <div class="flex aspect-square items-center justify-center bg-elevated/60">
              <img
                v-if="file.kind === 'image'"
                :src="media(file.url)"
                :alt="file.name"
                loading="lazy"
                class="size-full object-cover"
              >
              <UIcon
                v-else
                :name="fileIcon[file.kind]"
                class="size-10 text-muted"
              />
            </div>
            <div class="p-2.5">
              <p
                class="truncate text-xs font-medium text-highlighted"
                :title="file.name"
              >
                {{ file.name }}
              </p>
              <p class="text-[11px] text-dimmed">
                {{ formatBytes(file.size) }}
              </p>
            </div>
          </button>
          <div class="absolute right-1.5 top-1.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
            <UDropdownMenu :items="fileActions(file)">
              <UButton
                icon="i-lucide-ellipsis"
                color="neutral"
                variant="solid"
                size="xs"
                class="shadow"
                aria-label="Amallar"
              />
            </UDropdownMenu>
          </div>
        </div>
      </div>
    </div>

    <UModal
      v-model:open="folderModal.open"
      :title="folderModal.mode === 'create' ? 'Yangi papka' : 'Papka nomini o‘zgartirish'"
    >
      <template #body>
        <form
          id="folder-form"
          @submit.prevent="submitFolder"
        >
          <UFormField
            label="Papka nomi"
            help="Lotin harflari, raqamlar, “-” va “_” belgilari"
          >
            <UInput
              v-model="folderModal.name"
              autofocus
              placeholder="masalan: news-2026"
              class="w-full"
            />
          </UFormField>
        </form>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton
            color="neutral"
            variant="outline"
            @click="folderModal.open = false"
          >
            Bekor qilish
          </UButton>
          <UButton
            type="submit"
            form="folder-form"
            :loading="folderModal.saving"
            icon="i-lucide-check"
          >
            Saqlash
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
