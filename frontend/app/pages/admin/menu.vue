<script setup lang="ts">
import type { FormError } from '@nuxt/ui'
import type { Menu } from '~/types/api'
import { adminLocales } from '~/constants/admin'

definePageMeta({ layout: 'admin', i18n: false })
useHead({ title: 'Menyu' })

const api = useAdminApi()
const confirm = useConfirm()

const tree = ref<Menu[]>([])
const loading = ref(true)

const load = async () => {
  loading.value = true
  try {
    tree.value = await api.get<Menu[]>('/menus/full')
  } finally {
    loading.value = false
  }
}
onMounted(load)

const panel = reactive({
  open: false,
  editId: null as number | null,
  parentName: '' as string,
  saving: false
})

const emptyForm = () => ({
  nameUz: '', nameKr: '', nameRu: '', nameEn: '',
  priority: 1,
  parentId: null as number | null,
  relatedPageId: null as number | null,
  externalLink: ''
})

const form = reactive(emptyForm())
const linkType = ref<'none' | 'page' | 'url'>('none')

const openCreate = (parent?: Menu) => {
  Object.assign(form, emptyForm(), {
    parentId: parent?.id ?? null,
    priority: (parent ? parent.children.length : tree.value.length) + 1
  })
  linkType.value = parent ? 'page' : 'none'
  Object.assign(panel, { open: true, editId: null, parentName: parent?.nameUz ?? '', saving: false })
}

const openEdit = (item: Menu) => {
  Object.assign(form, pickFields(item, ['nameUz', 'nameKr', 'nameRu', 'nameEn', 'priority', 'parentId', 'relatedPageId'] as const), { externalLink: item.externalLink ?? '' })
  linkType.value = item.externalLink ? 'url' : item.relatedPageId ? 'page' : 'none'
  const findName = (items: Menu[]): string => {
    for (const entry of items) {
      if (entry.id === item.parentId) return entry.nameUz
      const nested = findName(entry.children)
      if (nested) return nested
    }
    return ''
  }
  Object.assign(panel, { open: true, editId: item.id, parentName: findName(tree.value), saving: false })
}

const validate = (value: typeof form): FormError[] => {
  const errors = requireFields(value, { nameUz: 'O‘zbekcha nom majburiy' })
  if (linkType.value === 'page' && !value.relatedPageId) errors.push({ name: 'relatedPageId', message: 'Sahifani tanlang' })
  if (linkType.value === 'url' && !/^(https?:\/\/|\/)/.test(value.externalLink)) {
    errors.push({ name: 'externalLink', message: 'https:// yoki / bilan boshlanadigan havola kiriting' })
  }
  return errors
}

const submit = async () => {
  panel.saving = true
  const body = {
    ...form,
    priority: Number(form.priority) || 0,
    relatedPageId: linkType.value === 'page' ? form.relatedPageId : null,
    externalLink: linkType.value === 'url' ? form.externalLink.trim() : null
  }
  try {
    if (panel.editId) await api.save(`/menus/${panel.editId}`, body, 'PUT')
    else await api.save('/menus', body)
    panel.open = false
    await load()
  } catch {
    panel.saving = false
  }
}

const removeItem = async (item: Menu) => {
  const ok = await confirm({
    title: `“${item.nameUz}” menyusini o‘chirasizmi?`,
    description: item.children.length ? 'Uning barcha ichki elementlari ham o‘chiriladi.' : undefined,
    confirmLabel: 'O‘chirish'
  })
  if (!ok) return
  await api.remove(`/menus/${item.id}`)
  await load()
}
</script>

<template>
  <AdminPage
    title="Menyu"
    description="Sayt sarlavhasidagi navigatsiya. 3 darajagacha ichma-ich joylashtirish mumkin."
  >
    <template #actions>
      <UButton
        icon="i-lucide-plus"
        @click="openCreate()"
      >
        Bo‘lim qo‘shish
      </UButton>
    </template>

    <div
      v-if="loading"
      class="max-w-3xl space-y-2"
    >
      <USkeleton
        v-for="n in 5"
        :key="n"
        class="h-16 rounded-xl"
      />
    </div>
    <AdminEmptyState
      v-else-if="!tree.length"
      title="Menyu bo‘sh"
      text="Birinchi bo‘limni qo‘shing"
      icon="i-lucide-list-tree"
    />
    <ul
      v-else
      class="max-w-3xl space-y-2"
    >
      <AdminMenuNode
        v-for="item in tree"
        :key="item.id"
        :item="item"
        @add="openCreate"
        @edit="openEdit"
        @remove="removeItem"
      />
    </ul>

    <USlideover
      v-model:open="panel.open"
      :title="panel.editId ? 'Menyuni tahrirlash' : 'Yangi menyu elementi'"
      :description="panel.parentName ? `Ota bo‘lim: ${panel.parentName}` : 'Yuqori darajadagi bo‘lim'"
      :ui="{ content: 'max-w-lg' }"
    >
      <template #body>
        <UForm
          id="menu-form"
          :state="form"
          :validate="validate"
          class="space-y-5"
          @submit="submit"
        >
          <UFormField
            v-for="locale in adminLocales"
            :key="locale.suffix"
            :label="`Nomi (${locale.label})`"
            :name="`name${locale.suffix}`"
            :required="locale.suffix === 'Uz'"
          >
            <UInput
              v-model="form[`name${locale.suffix}`]"
              :icon="locale.icon"
              class="w-full"
              maxlength="150"
            />
          </UFormField>

          <UFormField
            label="Tartib raqami"
            help="Kichik raqamli element oldinda turadi"
          >
            <UInputNumber
              v-model="form.priority"
              :min="0"
              :max="1000"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Havola turi">
            <URadioGroup
              v-model="linkType"
              orientation="horizontal"
              :items="[
                { label: 'Guruh', value: 'none' },
                { label: 'Sahifa', value: 'page' },
                { label: 'URL', value: 'url' }
              ]"
            />
          </UFormField>
          <UFormField
            v-if="linkType === 'page'"
            label="Sahifa"
            name="relatedPageId"
          >
            <AdminPageSelect v-model="form.relatedPageId" />
          </UFormField>
          <UFormField
            v-if="linkType === 'url'"
            label="URL"
            name="externalLink"
            help="Tashqi sayt (https://...) yoki ichki yo‘l (/news)"
          >
            <UInput
              v-model="form.externalLink"
              placeholder="https://hemis.samdu.uz"
              icon="i-lucide-link"
              class="w-full"
            />
          </UFormField>
        </UForm>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton
            color="neutral"
            variant="outline"
            @click="panel.open = false"
          >
            Bekor qilish
          </UButton>
          <UButton
            type="submit"
            form="menu-form"
            :loading="panel.saving"
            icon="i-lucide-save"
          >
            Saqlash
          </UButton>
        </div>
      </template>
    </USlideover>
  </AdminPage>
</template>
