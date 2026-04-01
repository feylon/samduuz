<template>
  <div class="p-6 mx-auto">
    <div class="flex gap-4 items-center mb-6">
      <UButton icon="tabler:arrow-left" color="neutral" variant="soft" @click="$router.push('/admin/useful-links')">
        Orqaga
      </UButton>
      <h1 class="text-2xl font-bold">Foydali havola qo'shish</h1>
    </div>

    <div class="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <UFormField label="Tashqi havola (External Link)" name="externalLink" class="md:col-span-2">
        <UInput color="secondary" v-model="formState.externalLink" class="w-full" placeholder="https://example.com" icon="i-heroicons-link" />
      </UFormField>

      <UFormField label="Asosiy Rasm" name="imagePath" class="md:col-span-2">
        <div class="flex items-center gap-4">
          <UInput color="secondary" v-model="formState.imagePath" class="flex-grow" placeholder="Rasm URL (Fayl menejeridan tanlang)" readonly />
          <UButton @click="isFileManagerOpen = true" color="secondary" variant="soft" icon="i-heroicons-folder-open">
            Menejerni ochish
          </UButton>
        </div>
        <div v-if="formState.imagePath" class="mt-3 relative w-48 h-32 rounded-lg overflow-hidden border">
          <img :src="ENV_BASE + formState.imagePath" class="w-full h-full object-cover" />
          <UButton @click="formState.imagePath = ''" color="error" variant="solid" size="2xs" icon="i-heroicons-trash" class="absolute top-1 right-1 rounded-full px-1" />
        </div>
      </UFormField>
    </div>

    <UTabs color="secondary" :items="tabs" variant="link" :ui="{ trigger: 'grow' }" class="gap-4 w-full">
      <template #uz>
        <UForm :state="formState" class="flex flex-col gap-6 mt-4">
          <UFormField label="Nomi (O'zbek)" name="nameUz">
            <UInput ref="nameUzRef" color="secondary" v-model="formState.nameUz" class="w-full" placeholder="Nomini kiriting" />
          </UFormField>
        </UForm>
      </template>

      <template #en>
        <UForm :state="formState" class="flex flex-col gap-6 mt-4">
          <UFormField label="Nomi (Ingliz)" name="nameEn">
            <UInput color="secondary" v-model="formState.nameEn" class="w-full" placeholder="Enter name" />
          </UFormField>
        </UForm>
      </template>

      <template #ru>
        <UForm :state="formState" class="flex flex-col gap-6 mt-4">
          <UFormField label="Nomi (Rus)" name="nameRu">
            <UInput color="secondary" v-model="formState.nameRu" class="w-full" placeholder="Введите название" />
          </UFormField>
        </UForm>
      </template>

      <template #kr>
        <UForm :state="formState" class="flex flex-col gap-6 mt-4">
          <UFormField label="Nomi (Kiril)" name="nameKr">
            <UInput color="secondary" v-model="formState.nameKr" class="w-full" placeholder="Номини киритинг" />
          </UFormField>
        </UForm>
      </template>
    </UTabs>

    <div class="mt-8 flex justify-end">
      <UButton @click="savedFunction" label="Saqlash" type="submit" color="secondary" size="lg" icon="material-symbols:save" />
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
  title: "Foydali havola qo'shish",
})

const { ENV_BASE, api } = useEnv()
const toast = useToast()
const router = useRouter()
const nameUzRef = ref<any>(null)
const isFileManagerOpen = ref(false)

const formState = reactive({
  nameUz: "",
  nameRu: "",
  nameEn: "",
  nameKr: "",
  externalLink: null as string | null,
  imagePath: ""
})

const tabs = [
  { label: "O'zbekcha", slot: 'uz' as const },
  { label: "Inglizcha", slot: 'en' as const },
  { label: "Ruscha", slot: 'ru' as const },
  { label: "Kirilcha", slot: 'kr' as const }
] satisfies TabsItem[];

const handleFileManagerSelect = (url: string) => {
  formState.imagePath = url.replace(ENV_BASE, '')
}

const savedFunction = async () => {
  if (!formState.externalLink) {
    toast.add({
      color: "warning",
      title: "Diqqat!",
      description: "Iltimos, tashqi havolani (External Link) kiriting."
    })
    return
  }

  if (!formState.imagePath) {
    toast.add({
      color: "warning",
      title: "Diqqat!",
      description: "Iltimos, havola uchun rasm tanlang."
    })
    return
  }

  if (!formState.nameUz) {
    toast.add({
      color: "warning",
      title: "Diqqat!",
      description: "Iltimos, havolaning O'zbek tilidagi nomini kiriting."
    })
    if (nameUzRef.value) nameUzRef.value.inputRef?.focus()
    return
  }

  if (!formState.nameEn) {
    toast.add({
      color: "warning",
      title: "Diqqat!",
      description: "Iltimos, havolaning Ingliz tilidagi nomini kiriting."
    })
    return
  }

  if (!formState.nameRu) {
    toast.add({
      color: "warning",
      title: "Diqqat!",
      description: "Iltimos, havolaning Rus tilidagi nomini kiriting."
    })
    return
  }

  if (!formState.nameKr) {
    toast.add({
      color: "warning",
      title: "Diqqat!",
      description: "Iltimos, havolaning Kiril tilidagi nomini kiriting."
    })
    return
  }

  try {
    await useApi('useful-links', {
      method: 'POST',
      body: formState
    })

    toast.add({
      title: "Muvaffaqiyatli!",
      description: "Foydali havola muvaffaqiyatli yaratildi.",
      color: "success"
    })

    router.push('/admin/useful-links')

  } catch (error) {
    toast.add({
      title: "Xatolik!",
      description: "Saqlashda xatolik yuz berdi.",
      color: "error"
    })
  }
}
</script>