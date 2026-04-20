<script setup lang="ts">
import type { FormError, FormErrorEvent } from '@nuxt/ui'
import { PageType } from '~/types/api'
import type { LocaleSuffix, Page } from '~/types/api'
import { adminLocales, pageTypeMeta } from '~/constants/admin'

const props = defineProps<{ id?: number, initialType?: PageType }>()

const api = useAdminApi()
const router = useRouter()
const { siteUrl } = useRuntimeConfig().public

const suffixes = adminLocales.map(locale => locale.suffix)

const employeeCommonKeys = ['email', 'phoneNumber', 'dateOfBirth', 'workStartTime', 'workEndTime', 'mainImgURL'] as const
const employeeLocalKeys = ['lastName', 'firstName', 'fathersName', 'position', 'address', 'receptionDays', 'content'] as const
const departmentCommonKeys = ['phone', 'email', 'telegram', 'facebook', 'linkedin', 'mainPicture'] as const
const departmentLocalKeys = ['name', 'address', 'content'] as const

const blank = (keys: readonly string[]) => Object.fromEntries(keys.map(key => [key, ''])) as Record<string, string>
const perLocale = (keys: readonly string[]) =>
  Object.fromEntries(suffixes.map(suffix => [suffix, blank(keys)])) as Record<LocaleSuffix, Record<string, string>>

const state = reactive({
  pageType: props.initialType ?? PageType.Simple,
  slug: '',
  isPublished: true,
  titleUz: '', titleKr: '', titleRu: '', titleEn: '',
  contentUz: '', contentKr: '', contentRu: '', contentEn: '',
  employeeCommon: blank(employeeCommonKeys),
  employeeLocal: perLocale(employeeLocalKeys),
  departmentCommon: blank(departmentCommonKeys),
  departmentLocal: perLocale(departmentLocalKeys)
})

const loading = ref(Boolean(props.id))
const saving = ref(false)
const original = ref<Page | null>(null)

const typeMeta = computed(() => pageTypeMeta.find(item => item.value === state.pageType) ?? pageTypeMeta[0]!)

const hydrate = (page: Page) => {
  Object.assign(state, pickFields(page, ['pageType', 'slug', 'isPublished', 'titleUz', 'titleKr', 'titleRu', 'titleEn'] as const))
  if (page.pageType === PageType.Simple) {
    Object.assign(state, pickFields(page, ['contentUz', 'contentKr', 'contentRu', 'contentEn'] as const))
    return
  }
  const isEmployee = page.pageType === PageType.Employee
  const commonKeys = isEmployee ? employeeCommonKeys : departmentCommonKeys
  const localKeys = isEmployee ? employeeLocalKeys : departmentLocalKeys
  const common = isEmployee ? state.employeeCommon : state.departmentCommon
  const local = isEmployee ? state.employeeLocal : state.departmentLocal

  for (const suffix of suffixes) {
    const parsed = parseJson<Record<string, string>>(page[`content${suffix}`]) ?? {}
    for (const key of localKeys) local[suffix]![key] = parsed[key] ?? ''
    if (suffix === 'Uz') for (const key of commonKeys) common[key] = parsed[key] ?? ''
  }
}

if (props.id) {
  api.get<Page>(`/pages/${props.id}/full`)
    .then((page) => {
      original.value = page
      hydrate(page)
    })
    .catch(() => router.replace('/admin/pages'))
    .finally(() => (loading.value = false))
}

const filled = (suffix: LocaleSuffix) => Boolean(state[`title${suffix}`].trim())

const validate = (value: typeof state): FormError[] => {
  const errors = requireFields(value, { titleUz: 'O‘zbekcha sarlavha majburiy' })
  if (value.pageType === PageType.Employee && !value.employeeLocal.Uz.lastName?.trim()) {
    errors.push({ name: 'employee.lastName', message: 'Familiyani kiriting' })
  }
  return errors
}

const onError = (event: FormErrorEvent) => {
  const first = event.errors[0]?.id
  if (first) document.getElementById(first)?.focus()
}

const buildContent = (suffix: LocaleSuffix) => {
  if (state.pageType === PageType.Simple) return state[`content${suffix}`]
  if (state.pageType === PageType.Employee) {
    return JSON.stringify({ ...state.employeeCommon, ...state.employeeLocal[suffix] })
  }
  return JSON.stringify({ ...state.departmentCommon, ...state.departmentLocal[suffix] })
}

const submit = async () => {
  saving.value = true
  const body = {
    pageType: state.pageType,
    slug: state.slug.trim() || undefined,
    isPublished: state.isPublished,
    titleUz: state.titleUz,
    titleKr: state.titleKr,
    titleRu: state.titleRu,
    titleEn: state.titleEn,
    contentUz: buildContent('Uz'),
    contentKr: buildContent('Kr'),
    contentRu: buildContent('Ru'),
    contentEn: buildContent('En')
  }
  try {
    if (props.id) await api.save(`/pages/${props.id}`, body, 'PUT')
    else await api.save('/pages', body)
    await router.push('/admin/pages')
  } catch {
    saving.value = false
  }
}

const publicUrl = computed(() => (original.value ? `${siteUrl.replace(/\/+$/, '')}/pages/${original.value.slug}` : ''))
</script>

<template>
  <div
    v-if="loading"
    class="grid gap-6 xl:grid-cols-3"
  >
    <USkeleton class="h-[32rem] rounded-2xl xl:col-span-2" />
    <USkeleton class="h-80 rounded-2xl" />
  </div>

  <UForm
    v-else
    :state="state"
    :validate="validate"
    class="grid items-start gap-6 xl:grid-cols-3"
    @submit="submit"
    @error="onError"
  >
    <div class="space-y-6 xl:col-span-2">
      <AdminFormCard
        v-if="!id"
        title="Sahifa turi"
      >
        <div class="grid gap-3 sm:grid-cols-3">
          <button
            v-for="type in pageTypeMeta"
            :key="type.value"
            type="button"
            class="flex items-center gap-3 rounded-xl border p-3 text-left transition-all"
            :class="state.pageType === type.value ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-default hover:border-accented'"
            @click="state.pageType = type.value"
          >
            <UIcon
              :name="type.icon"
              class="size-5 shrink-0"
              :class="state.pageType === type.value ? 'text-primary' : 'text-muted'"
            />
            <span class="text-sm font-medium">{{ type.label }}</span>
          </button>
        </div>
      </AdminFormCard>

      <AdminFormCard
        v-if="state.pageType === PageType.Employee"
        title="Umumiy ma’lumotlar"
        description="Bu maydonlar barcha tillar uchun bir xil"
      >
        <div class="grid gap-5 md:grid-cols-[12rem_1fr]">
          <UFormField label="Surat">
            <AdminImagePicker
              v-model="state.employeeCommon.mainImgURL"
              aspect="aspect-[4/5]"
              label="Surat tanlash"
            />
          </UFormField>
          <div class="grid content-start gap-4 sm:grid-cols-2">
            <UFormField label="Elektron pochta">
              <UInput
                v-model="state.employeeCommon.email"
                type="email"
                icon="i-lucide-mail"
                class="w-full"
              />
            </UFormField>
            <UFormField label="Telefon">
              <UInput
                v-model="state.employeeCommon.phoneNumber"
                icon="i-lucide-phone"
                placeholder="+998 66 ..."
                class="w-full"
              />
            </UFormField>
            <UFormField label="Tug‘ilgan sana">
              <UInput
                v-model="state.employeeCommon.dateOfBirth"
                type="date"
                class="w-full"
              />
            </UFormField>
            <div class="grid grid-cols-2 gap-2">
              <UFormField label="Ish boshlanishi">
                <UInput
                  v-model="state.employeeCommon.workStartTime"
                  type="time"
                  class="w-full"
                />
              </UFormField>
              <UFormField label="Ish tugashi">
                <UInput
                  v-model="state.employeeCommon.workEndTime"
                  type="time"
                  class="w-full"
                />
              </UFormField>
            </div>
          </div>
        </div>
      </AdminFormCard>

      <AdminFormCard
        v-if="state.pageType === PageType.Department"
        title="Umumiy ma’lumotlar"
        description="Bu maydonlar barcha tillar uchun bir xil"
      >
        <UFormField label="Muqova rasmi">
          <AdminImagePicker
            v-model="state.departmentCommon.mainPicture"
            aspect="aspect-[21/9]"
          />
        </UFormField>
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField label="Telefon">
            <UInput
              v-model="state.departmentCommon.phone"
              icon="i-lucide-phone"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Elektron pochta">
            <UInput
              v-model="state.departmentCommon.email"
              type="email"
              icon="i-lucide-mail"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Telegram">
            <UInput
              v-model="state.departmentCommon.telegram"
              icon="i-simple-icons-telegram"
              placeholder="https://t.me/..."
              class="w-full"
            />
          </UFormField>
          <UFormField label="Facebook">
            <UInput
              v-model="state.departmentCommon.facebook"
              icon="i-simple-icons-facebook"
              placeholder="https://facebook.com/..."
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="LinkedIn"
            class="sm:col-span-2"
          >
            <UInput
              v-model="state.departmentCommon.linkedin"
              icon="i-simple-icons-linkedin"
              placeholder="https://linkedin.com/..."
              class="w-full"
            />
          </UFormField>
        </div>
      </AdminFormCard>

      <AdminFormCard
        title="Tarjima qilinadigan ma’lumotlar"
        description="O‘zbekcha variant majburiy, qolgan tillar bo‘sh bo‘lsa o‘zbekchasi ko‘rsatiladi."
      >
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
                  placeholder="Menyu va brauzer sarlavhasida ko‘rinadi"
                />
              </UFormField>

              <UFormField
                v-if="state.pageType === PageType.Simple"
                label="Matn"
              >
                <AdminRichEditor v-model="state[`content${suffix}`]" />
              </UFormField>

              <template v-else-if="state.pageType === PageType.Employee">
                <div class="grid gap-4 sm:grid-cols-3">
                  <UFormField
                    label="Familiya"
                    :name="suffix === 'Uz' ? 'employee.lastName' : undefined"
                    :required="suffix === 'Uz'"
                  >
                    <UInput
                      v-model="state.employeeLocal[suffix].lastName"
                      class="w-full"
                    />
                  </UFormField>
                  <UFormField label="Ism">
                    <UInput
                      v-model="state.employeeLocal[suffix].firstName"
                      class="w-full"
                    />
                  </UFormField>
                  <UFormField label="Otasining ismi">
                    <UInput
                      v-model="state.employeeLocal[suffix].fathersName"
                      class="w-full"
                    />
                  </UFormField>
                </div>
                <UFormField label="Lavozimi">
                  <UInput
                    v-model="state.employeeLocal[suffix].position"
                    class="w-full"
                    placeholder="Rektor, professor"
                  />
                </UFormField>
                <div class="grid gap-4 sm:grid-cols-2">
                  <UFormField label="Qabul kunlari">
                    <UInput
                      v-model="state.employeeLocal[suffix].receptionDays"
                      class="w-full"
                      placeholder="Dushanba, Payshanba"
                    />
                  </UFormField>
                  <UFormField label="Manzil">
                    <UInput
                      v-model="state.employeeLocal[suffix].address"
                      class="w-full"
                    />
                  </UFormField>
                </div>
                <UFormField label="Tarjimai hol">
                  <AdminRichEditor v-model="state.employeeLocal[suffix].content" />
                </UFormField>
              </template>

              <template v-else>
                <UFormField label="Kafedra nomi">
                  <UInput
                    v-model="state.departmentLocal[suffix].name"
                    class="w-full"
                  />
                </UFormField>
                <UFormField label="Manzil">
                  <UInput
                    v-model="state.departmentLocal[suffix].address"
                    class="w-full"
                  />
                </UFormField>
                <UFormField label="Kafedra haqida">
                  <AdminRichEditor v-model="state.departmentLocal[suffix].content" />
                </UFormField>
              </template>
            </div>
          </template>
        </AdminLocaleTabs>
      </AdminFormCard>
    </div>

    <div class="space-y-6 xl:sticky xl:top-4">
      <AdminFormCard title="Sozlamalar">
        <div class="flex items-center gap-2 rounded-lg bg-elevated/60 px-3 py-2 text-sm">
          <UIcon
            :name="typeMeta.icon"
            class="size-4 text-primary"
          />
          {{ typeMeta.label }}
        </div>
        <USwitch
          v-model="state.isPublished"
          label="Saytda ko‘rsatish"
        />
        <UFormField
          label="Slug (URL)"
          name="slug"
          help="Bo‘sh qoldirilsa sarlavhadan yaratiladi"
        >
          <UInput
            v-model="state.slug"
            placeholder="universitet-tarixi"
            class="w-full"
            :ui="{ base: 'font-mono text-sm' }"
          />
        </UFormField>
        <a
          v-if="publicUrl"
          :href="publicUrl"
          target="_blank"
          class="block truncate text-xs text-primary hover:underline"
        >{{ publicUrl }}</a>
      </AdminFormCard>
      <div class="flex gap-2">
        <UButton
          to="/admin/pages"
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
