<script setup lang="ts">
import type { FormError, FormErrorEvent } from '@nuxt/ui'
import type { LocaleSuffix, Publication } from '~/types/api'

const props = defineProps<{
  endpoint: '/news' | '/announcements'
  publicBase: string
  id?: number
  noun: string
}>()

const api = useAdminApi()
const router = useRouter()
const { siteUrl } = useRuntimeConfig().public
const listPath = `/admin${props.endpoint}`

const fields = [
  'titleUz', 'titleKr', 'titleRu', 'titleEn',
  'descriptionUz', 'descriptionKr', 'descriptionRu', 'descriptionEn',
  'contentUz', 'contentKr', 'contentRu', 'contentEn',
  'mainImagePath', 'isPublished', 'slug'
] as const

const state = reactive({
  titleUz: '', titleKr: '', titleRu: '', titleEn: '',
  descriptionUz: '', descriptionKr: '', descriptionRu: '', descriptionEn: '',
  contentUz: '', contentKr: '', contentRu: '', contentEn: '',
  mainImagePath: '',
  isPublished: true,
  publishedAt: toDateTimeLocal(),
  slug: ''
})

const loading = ref(Boolean(props.id))
const saving = ref(false)
const original = ref<Publication | null>(null)

if (props.id) {
  api.get<Publication>(`${props.endpoint}/${props.id}/full`)
    .then((item) => {
      original.value = item
      Object.assign(state, pickFields(item, fields), { publishedAt: toDateTimeLocal(item.publishedAt) })
    })
    .catch(() => router.replace(listPath))
    .finally(() => (loading.value = false))
}

const filled = (suffix: LocaleSuffix) => Boolean(state[`title${suffix}`]?.trim())

const validate = (value: typeof state): FormError[] => requireFields(value, {
  titleUz: 'O‘zbekcha sarlavha majburiy',
  descriptionUz: 'O‘zbekcha qisqacha tavsif majburiy',
  mainImagePath: 'Asosiy rasmni tanlang'
})

const onError = (event: FormErrorEvent) => {
  const first = event.errors[0]?.id
  if (first) document.getElementById(first)?.focus()
}

const submit = async () => {
  saving.value = true
  try {
    const body = {
      ...state,
      slug: state.slug.trim() || undefined,
      publishedAt: new Date(state.publishedAt).toISOString()
    }
    if (props.id) {
      await api.save(`${props.endpoint}/${props.id}`, body, 'PUT')
    } else {
      await api.save(props.endpoint, body)
    }
    await router.push(listPath)
  } catch {
    saving.value = false
  }
}

const publicUrl = computed(() =>
  original.value ? `${siteUrl.replace(/\/+$/, '')}${props.publicBase}/${original.value.slug}` : ''
)
</script>

<template>
  <div
    v-if="loading"
    class="grid gap-6 xl:grid-cols-3"
  >
    <USkeleton class="h-[32rem] rounded-2xl xl:col-span-2" />
    <USkeleton class="h-96 rounded-2xl" />
  </div>

  <UForm
    v-else
    :state="state"
    :validate="validate"
    class="grid items-start gap-6 xl:grid-cols-3"
    @submit="submit"
    @error="onError"
  >
    <AdminFormCard
      class="xl:col-span-2"
      title="Matn"
      description="Ma’lumotlarni har bir til uchun alohida kiriting. O‘zbekcha variant majburiy."
    >
      <AdminLocaleTabs :filled="filled">
        <template #default="{ suffix }">
          <div class="space-y-5">
            <UFormField
              :label="`Sarlavha`"
              :name="`title${suffix}`"
              :required="suffix === 'Uz'"
            >
              <UInput
                v-model="state[`title${suffix}`]"
                :placeholder="`${noun} sarlavhasi`"
                size="lg"
                class="w-full"
                maxlength="255"
              />
            </UFormField>
            <UFormField
              label="Qisqacha tavsif"
              :name="`description${suffix}`"
              :required="suffix === 'Uz'"
              :hint="`${state[`description${suffix}`].length}/500`"
            >
              <UTextarea
                v-model="state[`description${suffix}`]"
                :rows="3"
                autoresize
                maxlength="500"
                placeholder="Ro‘yxatda va ijtimoiy tarmoqlarda ko‘rinadigan qisqa matn"
                class="w-full"
              />
            </UFormField>
            <UFormField
              label="To‘liq matn"
              :name="`content${suffix}`"
            >
              <AdminRichEditor v-model="state[`content${suffix}`]" />
            </UFormField>
          </div>
        </template>
      </AdminLocaleTabs>
    </AdminFormCard>

    <div class="space-y-6 xl:sticky xl:top-4">
      <AdminFormCard title="Asosiy rasm">
        <UFormField
          name="mainImagePath"
          required
        >
          <AdminImagePicker v-model="state.mainImagePath" />
        </UFormField>
      </AdminFormCard>

      <AdminFormCard title="Nashr sozlamalari">
        <USwitch
          v-model="state.isPublished"
          label="Saytda ko‘rsatish"
          description="O‘chirilsa, material faqat admin panelda qoladi"
        />
        <UFormField
          label="Chop etish sanasi"
          name="publishedAt"
          help="Kelajakdagi sana tanlansa, material shu vaqtda chiqadi"
        >
          <UInput
            v-model="state.publishedAt"
            type="datetime-local"
            class="w-full"
          />
        </UFormField>
        <UFormField
          label="Slug (URL)"
          name="slug"
          help="Bo‘sh qoldirilsa sarlavhadan avtomatik yaratiladi"
        >
          <UInput
            v-model="state.slug"
            placeholder="masalan: xalqaro-konferensiya"
            class="w-full"
            :ui="{ base: 'font-mono text-sm' }"
          />
        </UFormField>
        <div
          v-if="original"
          class="rounded-lg bg-elevated/60 p-3 text-xs text-muted"
        >
          <div class="flex items-center justify-between gap-2">
            <span class="flex items-center gap-1"><UIcon
              name="i-lucide-eye"
              class="size-3.5"
            /> {{ original.views }} ko‘rish</span>
            <span class="flex items-center gap-1"><UIcon
              name="i-lucide-heart"
              class="size-3.5"
            /> {{ original.likes }}</span>
          </div>
          <a
            :href="publicUrl"
            target="_blank"
            class="mt-2 block truncate text-primary hover:underline"
          >{{ publicUrl }}</a>
        </div>
      </AdminFormCard>

      <div class="flex gap-2">
        <UButton
          :to="listPath"
          color="neutral"
          variant="outline"
          class="flex-1 justify-center"
        >
          Bekor qilish
        </UButton>
        <UButton
          type="submit"
          :loading="saving"
          icon="i-lucide-save"
          class="flex-1 justify-center"
        >
          Saqlash
        </UButton>
      </div>
    </div>
  </UForm>
</template>
