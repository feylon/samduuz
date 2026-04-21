<script setup lang="ts">
import type { FormError } from '@nuxt/ui'
import type { UsefulLink } from '~/types/api'
import { adminLocales } from '~/constants/admin'

const props = defineProps<{ id?: number }>()

const api = useAdminApi()
const router = useRouter()

const state = reactive({
  nameUz: '', nameKr: '', nameRu: '', nameEn: '',
  externalLink: '',
  imagePath: '',
  priority: 1,
  isActive: true
})

const loading = ref(Boolean(props.id))
const saving = ref(false)

if (props.id) {
  api.get<UsefulLink>(`/useful-links/${props.id}/full`)
    .then(link => Object.assign(state, pickFields(link, Object.keys(state) as (keyof typeof state)[])))
    .catch(() => router.replace('/admin/useful-links'))
    .finally(() => (loading.value = false))
}

const validate = (value: typeof state): FormError[] => {
  const errors = requireFields(value, {
    nameUz: 'O‘zbekcha nom majburiy',
    imagePath: 'Logotip tanlang'
  })
  if (!/^https?:\/\/.+/.test(value.externalLink)) {
    errors.push({ name: 'externalLink', message: 'To‘liq havola kiriting (https://...)' })
  }
  return errors
}

const submit = async () => {
  saving.value = true
  const body = { ...state, priority: Number(state.priority) || 0 }
  try {
    if (props.id) await api.save(`/useful-links/${props.id}`, body, 'PUT')
    else await api.save('/useful-links', body)
    await router.push('/admin/useful-links')
  } catch {
    saving.value = false
  }
}
</script>

<template>
  <USkeleton
    v-if="loading"
    class="h-96 rounded-2xl"
  />

  <UForm
    v-else
    :state="state"
    :validate="validate"
    class="grid max-w-5xl items-start gap-6 lg:grid-cols-3"
    @submit="submit"
  >
    <AdminFormCard
      title="Ma’lumotlar"
      class="lg:col-span-2"
    >
      <UFormField
        label="Havola"
        name="externalLink"
        required
      >
        <UInput
          v-model="state.externalLink"
          placeholder="https://my.gov.uz"
          icon="i-lucide-globe"
          class="w-full"
        />
      </UFormField>
      <div class="grid gap-4 sm:grid-cols-2">
        <UFormField
          v-for="locale in adminLocales"
          :key="locale.suffix"
          :label="`Nomi (${locale.label})`"
          :name="`name${locale.suffix}`"
          :required="locale.suffix === 'Uz'"
        >
          <UInput
            v-model="state[`name${locale.suffix}`]"
            :icon="locale.icon"
            class="w-full"
            maxlength="255"
          />
        </UFormField>
      </div>
    </AdminFormCard>

    <div class="space-y-6">
      <AdminFormCard title="Logotip">
        <UFormField
          name="imagePath"
          required
        >
          <AdminImagePicker
            v-model="state.imagePath"
            aspect="aspect-square"
            label="Logotip tanlash"
          />
        </UFormField>
      </AdminFormCard>
      <AdminFormCard title="Sozlamalar">
        <USwitch
          v-model="state.isActive"
          label="Saytda ko‘rsatish"
        />
        <UFormField label="Tartib raqami">
          <UInputNumber
            v-model="state.priority"
            :min="0"
            :max="1000"
            class="w-full"
          />
        </UFormField>
      </AdminFormCard>
      <div class="flex gap-2">
        <UButton
          to="/admin/useful-links"
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
