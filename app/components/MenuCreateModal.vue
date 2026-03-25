<template>
  <div class="mt-8">
    <UCard :ui="{ ring: 'ring-1 ring-gray-200', divide: 'divide-y divide-gray-100', rounded: 'rounded-2xl', shadow: 'shadow-md' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold">Menyu qo'shish</h2>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="$emit('close')" />
        </div>
      </template>

      <div class="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormField label="Tegishli sahifani biriktirish" name="relatedPageId">
          <USelectMenu
            v-model="formState.relatedPageId"
            :items="pageOptions"
            value-key="id"
            label-key="label"
            placeholder="Sahifani tanlang"
            class="w-full"
            :loading="pagesPending"
            icon="i-heroicons-link"
          />
        </UFormField>

        <UFormField label="Tashqi havola (Ixtiyoriy)" name="externalLink">
          <UInput color="secondary" v-model="formState.externalLink" class="w-full" placeholder="https://..." icon="i-heroicons-globe-alt" />
        </UFormField>

        <UFormField label="Ota menyu ID (Ixtiyoriy)" name="parentId">
          <UInput type="number" color="secondary" v-model.number="formState.parentId" class="w-full" placeholder="Masalan: 1" icon="i-heroicons-folder" />
        </UFormField>

        <UFormField label="Navbat (Priority)" name="priority">
          <UInput type="number" color="secondary" v-model.number="formState.priority" class="w-full" placeholder="1" icon="i-heroicons-bars-3-bottom-left" />
        </UFormField>
      </div>

      <UTabs color="secondary" :items="tabs" variant="link" :ui="{ trigger: 'grow' }" class="gap-4 w-full">
        <template #uz>
          <UForm :state="formState" class="flex flex-col gap-6 mt-4">
            <UFormField label="Menyu nomi (O'zbek)" name="nameUz">
              <UInput ref="nameUzRef" color="secondary" v-model="formState.nameUz" class="w-full" placeholder="Menyu nomini kiriting" />
            </UFormField>
          </UForm>
        </template>

        <template #en>
          <UForm :state="formState" class="flex flex-col gap-6 mt-4">
            <UFormField label="Menyu nomi (Ingliz)" name="nameEn">
              <UInput color="secondary" v-model="formState.nameEn" class="w-full" placeholder="Enter menu name" />
            </UFormField>
          </UForm>
        </template>

        <template #ru>
          <UForm :state="formState" class="flex flex-col gap-6 mt-4">
            <UFormField label="Menyu nomi (Rus)" name="nameRu">
              <UInput color="secondary" v-model="formState.nameRu" class="w-full" placeholder="Введите название меню" />
            </UFormField>
          </UForm>
        </template>

        <template #kr>
          <UForm :state="formState" class="flex flex-col gap-6 mt-4">
            <UFormField label="Menyu nomi (Kiril)" name="nameKr">
              <UInput color="secondary" v-model="formState.nameKr" class="w-full" placeholder="Меню номини киритинг" />
            </UFormField>
          </UForm>
        </template>
      </UTabs>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton label="Bekor qilish" color="gray" variant="soft" @click="$emit('close')" />
          <UButton @click="savedFunction" label="Menyuni saqlash" color="secondary" icon="material-symbols:save" />
        </div>
      </template>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import type { TabsItem } from '@nuxt/ui'

const props = defineProps<{
  parentId: number | null
}>()

// Endi 'close' emiti orqali ota komponentga xabar yuboramiz
const emit = defineEmits(['close', 'saved'])

const { api } = useEnv()
const toast = useToast()
const nameUzRef = ref<any>(null)

const formState = reactive({
  nameUz: "",
  nameRu: "",
  nameEn: "",
  nameKr: "",
  priority: 1,
  parentId: null as number | null,
  relatedPageId: null as number | null,
  externalLink: null as string | null
})

const tabs = [
  { label: "O'zbekcha", slot: 'uz' as const },
  { label: "Inglizcha", slot: 'en' as const },
  { label: "Ruscha", slot: 'ru' as const },
  { label: "Kirilcha", slot: 'kr' as const }
] satisfies TabsItem[];

const { data: pagesData, pending: pagesPending } = await useFetch<any>('pages', {
  baseURL: api,
  method: 'GET',
  headers: { Authorization: `Bearer ${useCookie("accessToken").value}` },
  query: {
    OnlyUnasignedPages: true,
    Page: 1,
    PageSize: 500
  }
})

const pageOptions = computed(() => {
  if (!pagesData.value?.data?.items) return []
  return pagesData.value.data.items.map((page: any) => ({
    label: page.titleUz,
    id: page.id
  }))
})

// Ota sahifadan kelgan parentId ni ulash
watch(() => props.parentId, (newVal) => {
  formState.parentId = newVal;
}, { immediate: true })

const savedFunction = async () => {
  if (!formState.nameUz) {
    toast.add({
      color: "warning",
      title: "Diqqat!",
      description: "Iltimos, menyuning O'zbek tilidagi nomini kiriting."
    })
    if (nameUzRef.value) nameUzRef.value.inputRef?.focus()
    return
  }

  try {
    await useApi('menus', {
      method: 'POST',
      body: formState
    })

    toast.add({
      title: "Muvaffaqiyatli!",
      description: "Menyu muvaffaqiyatli yaratildi.",
      color: "success"
    })

    // Muvaffaqiyatli saqlangach eventlarni otamiz: avval saqlanganini, so'ng formani yopishni
    emit('saved')
    emit('close')

    // Formani tozalaymiz
    Object.assign(formState, {
      nameUz: "",
      nameRu: "",
      nameEn: "",
      nameKr: "",
      priority: 1,
      parentId: null,
      relatedPageId: null,
      externalLink: null
    })

  } catch (error) {
    toast.add({
      title: "Xatolik!",
      description: "Menyuni saqlashda xatolik yuz berdi.",
      color: "error"
    })
  }
};
</script>