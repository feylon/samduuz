<script setup lang="ts">
import type { FormError } from '@nuxt/ui'
import type { LocaleSuffix, Slide } from '~/types/api'

const props = defineProps<{ id?: number }>()

const api = useAdminApi()
const router = useRouter()

const state = reactive({
  titleUz: '', titleKr: '', titleRu: '', titleEn: '',
  descriptionUz: '', descriptionKr: '', descriptionRu: '', descriptionEn: '',
  mainImagePath: '',
  isActive: true,
  priority: 1,
  relatedPageId: null as number | null,
  externalLink: ''
})

const linkType = ref<'none' | 'page' | 'external'>('none')
const loading = ref(Boolean(props.id))
const saving = ref(false)

if (props.id) {
  api.get<Slide>(`/slides/${props.id}`)
    .then((slide) => {
      Object.assign(state, pickFields(slide, Object.keys(state) as (keyof typeof state)[]), { externalLink: slide.externalLink ?? '' })
      linkType.value = slide.externalLink ? 'external' : slide.relatedPageId ? 'page' : 'none'
    })
    .catch(() => router.replace('/admin/slides'))
    .finally(() => (loading.value = false))
}

const filled = (suffix: LocaleSuffix) => Boolean(state[`title${suffix}`].trim())

const validate = (value: typeof state): FormError[] => {
  const errors = requireFields(value, {
    titleUz: 'O‘zbekcha sarlavha majburiy',
    mainImagePath: 'Slayd uchun rasm tanlang'
  })
  if (linkType.value === 'external' && !/^https?:\/\//.test(value.externalLink)) {
    errors.push({ name: 'externalLink', message: 'To‘liq havola kiriting (https://...)' })
  }
  if (linkType.value === 'page' && !value.relatedPageId) {
    errors.push({ name: 'relatedPageId', message: 'Sahifani tanlang' })
  }
  return errors
}

const submit = async () => {
  saving.value = true
  const body = {
    ...state,
    priority: Number(state.priority) || 0,
    relatedPageId: linkType.value === 'page' ? state.relatedPageId : null,
    externalLink: linkType.value === 'external' ? state.externalLink.trim() : null
  }
  try {
    if (props.id) await api.save(`/slides/${props.id}`, body, 'PUT')
    else await api.save('/slides', body)
    await router.push('/admin/slides')
  } catch {
    saving.value = false
  }
}
</script>

<template>
  <USkeleton
    v-if="loading"
    class="h-[32rem] rounded-2xl"
  />

  <UForm
    v-else
    :state="state"
    :validate="validate"
    class="grid items-start gap-6 xl:grid-cols-3"
    @submit="submit"
  >
    <div class="space-y-6 xl:col-span-2">
      <AdminFormCard
        title="Rasm"
        description="Tavsiya etilgan o‘lcham: 1920×900 piksel"
      >
        <UFormField
          name="mainImagePath"
          required
        >
          <AdminImagePicker
            v-model="state.mainImagePath"
            aspect="aspect-[21/9]"
          />
        </UFormField>
      </AdminFormCard>

      <AdminFormCard title="Matn">
        <AdminLocaleTabs :filled="filled">
          <template #default="{ suffix }">
            <div class="space-y-5">
              <UFormField
                label="Sarlavha"
                :name="`title${suffix}`"
                :required="suffix === 'Uz'"
              >
                <UInput
                  v-model="state[`title${suffix}`]"
                  size="lg"
                  class="w-full"
                  maxlength="255"
                />
              </UFormField>
              <UFormField
                label="Tavsif"
                :name="`description${suffix}`"
              >
                <UTextarea
                  v-model="state[`description${suffix}`]"
                  :rows="3"
                  autoresize
                  maxlength="500"
                  class="w-full"
                />
              </UFormField>
            </div>
          </template>
        </AdminLocaleTabs>
      </AdminFormCard>
    </div>

    <div class="space-y-6 xl:sticky xl:top-4">
      <AdminFormCard title="Sozlamalar">
        <USwitch
          v-model="state.isActive"
          label="Faol"
          description="Faol slaydlar bosh sahifada ko‘rinadi"
        />
        <UFormField
          label="Tartib raqami"
          help="Kichik raqamli slayd birinchi chiqadi"
        >
          <UInputNumber
            v-model="state.priority"
            :min="0"
            :max="1000"
            class="w-full"
          />
        </UFormField>
      </AdminFormCard>

      <AdminFormCard title="Tugma havolasi">
        <URadioGroup
          v-model="linkType"
          :items="[
            { label: 'Havolasiz', value: 'none' },
            { label: 'Saytdagi sahifa', value: 'page' },
            { label: 'Tashqi havola', value: 'external' }
          ]"
        />
        <UFormField
          v-if="linkType === 'page'"
          label="Sahifa"
          name="relatedPageId"
        >
          <AdminPageSelect v-model="state.relatedPageId" />
        </UFormField>
        <UFormField
          v-if="linkType === 'external'"
          label="URL"
          name="externalLink"
        >
          <UInput
            v-model="state.externalLink"
            placeholder="https://"
            icon="i-lucide-link"
            class="w-full"
          />
        </UFormField>
      </AdminFormCard>

      <div class="flex gap-2">
        <UButton
          to="/admin/slides"
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
