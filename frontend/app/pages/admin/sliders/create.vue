<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="flex gap-4 items-center mb-6">
      <UButton icon="tabler:arrow-left" color="neutral" variant="soft" @click="$router.push('/admin/slides')">
        Orqaga
      </UButton>
      <h1 class="text-2xl font-bold">Slayd qo'shish</h1>
    </div>

    <div class="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <UFormField label="Slayd holati" name="isActive">
        <div class="h-10 flex items-center">
          <USwitch v-model="formState.isActive" color="success" size="lg" label="Faol" />
        </div>
      </UFormField>

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

      <UFormField label="Asosiy Rasm" name="mainImagePath" class="md:col-span-2">
        <div class="flex items-center gap-4">
          <UInput color="secondary" v-model="formState.mainImagePath" class="flex-grow" placeholder="Rasm URL (Fayl menejeridan tanlang)" readonly />
          <UButton @click="isFileManagerOpen = true" color="primary" variant="soft" icon="i-heroicons-folder-open">
            Menejerni ochish
          </UButton>
        </div>
        <div v-if="formState.mainImagePath" class="mt-3 relative w-48 h-32 rounded-lg overflow-hidden border">
          <img :src="ENV_BASE + formState.mainImagePath" class="w-full h-full object-cover" />
          <UButton @click="formState.mainImagePath = ''" color="error" variant="solid" size="2xs" icon="i-heroicons-trash" class="absolute top-1 right-1 rounded-full px-1" />
        </div>
      </UFormField>
    </div>

    <UTabs color="secondary" :items="tabs" variant="link" :ui="{ trigger: 'grow' }" class="gap-4 w-full">
      <template #uz>
        <UForm :state="formState" class="flex flex-col gap-6 mt-4">
          <UFormField label="Sarlavha (O'zbek)" name="titleUz">
            <UInput ref="titleUzRef" color="secondary" v-model="formState.titleUz" class="w-full" placeholder="Sarlavha kiriting" />
          </UFormField>
          <UFormField label="Tavsif (O'zbek)" name="descriptionUz">
            <UTextarea color="secondary" v-model="formState.descriptionUz" class="w-full" placeholder="Qisqacha tavsif kiriting" />
          </UFormField>
        </UForm>
      </template>

      <template #en>
        <UForm :state="formState" class="flex flex-col gap-6 mt-4">
          <UFormField label="Sarlavha (Ingliz)" name="titleEn">
            <UInput color="secondary" v-model="formState.titleEn" class="w-full" placeholder="Enter title" />
          </UFormField>
          <UFormField label="Tavsif (Ingliz)" name="descriptionEn">
            <UTextarea color="secondary" v-model="formState.descriptionEn" class="w-full" placeholder="Enter description" />
          </UFormField>
        </UForm>
      </template>

      <template #ru>
        <UForm :state="formState" class="flex flex-col gap-6 mt-4">
          <UFormField label="Sarlavha (Rus)" name="titleRu">
            <UInput color="secondary" v-model="formState.titleRu" class="w-full" placeholder="Введите заголовок" />
          </UFormField>
          <UFormField label="Tavsif (Rus)" name="descriptionRu">
            <UTextarea color="secondary" v-model="formState.descriptionRu" class="w-full" placeholder="Введите описание" />
          </UFormField>
        </UForm>
      </template>

      <template #kr>
        <UForm :state="formState" class="flex flex-col gap-6 mt-4">
          <UFormField label="Sarlavha (Kiril)" name="titleKr">
            <UInput color="secondary" v-model="formState.titleKr" class="w-full" placeholder="Сарлавҳа киритинг" />
          </UFormField>
          <UFormField label="Tavsif (Kiril)" name="descriptionKr">
            <UTextarea color="secondary" v-model="formState.descriptionKr" class="w-full" placeholder="Тавсиф киритинг" />
          </UFormField>
        </UForm>
      </template>
    </UTabs>

    <div class="mt-8 flex justify-end">
      <UButton @click="savedFunction" label="Slaydni saqlash" type="submit" color="secondary" size="lg" icon="material-symbols:save" />
    </div>

    <UModal
      v-if="isFileManagerOpen"
      :open="isFileManagerOpen"
      @update:open="isFileManagerOpen = $event"
      title="Fayl menejeri"
      :ui="{ width: 'sm:max-w-4xl' }"
    >
      <template #body>
        <div class="max-h-[80vh] overflow-y-auto">
          <FileManagerModal
            @select="handleFileManagerSelect"
            @close="isFileManagerOpen = false"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import type { TabsItem } from '@nuxt/ui'

definePageMeta({
  layout: 'admin' 
});
useHead({
  title: "Slayd qo'shish",
  
})

const { ENV_BASE, api } = useEnv()
const toast = useToast()
const router = useRouter()
const titleUzRef = ref<any>(null)
const isFileManagerOpen = ref(false)

const formState = reactive({
  titleUz: "",
  titleEn: "",
  titleRu: "",
  titleKr: "",
  descriptionUz: "",
  descriptionRu: "",
  descriptionEn: "",
  descriptionKr: "",
  relatedPageId: null as number | null,
  mainImagePath: "",
  isActive: true
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

const handleFileManagerSelect = (url: string) => {
  formState.mainImagePath = url.replace(ENV_BASE, '')
}

const savedFunction = async () => {
  if (!formState.titleUz) {
    toast.add({
      color: "warning",
      title: "Diqqat!",
      description: "Iltimos, slaydning O'zbek tilidagi sarlavhasini kiriting."
    })
    if (titleUzRef.value) titleUzRef.value.inputRef?.focus()
    return
  }

  if (!formState.mainImagePath) {
    toast.add({
      color: "warning",
      title: "Diqqat!",
      description: "Iltimos, slayd uchun rasm tanlang."
    })
    return
  }

  try {
    await useApi('slides', {
      method: 'POST',
      body: formState
    })

    toast.add({
      title: "Muvaffaqiyatli!",
      description: "Slayd muvaffaqiyatli yaratildi.",
      color: "success"
    })

    router.push('/admin/slides')

  } catch (error) {
    toast.add({
      title: "Xatolik!",
      description: "Slaydni saqlashda xatolik yuz berdi.",
      color: "error"
    })
  }
}
</script>