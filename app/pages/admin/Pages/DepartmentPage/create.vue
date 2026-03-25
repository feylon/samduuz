<template>
  <div class="p-6  mx-auto">
    <div class="flex gap-4 items-center mb-6">
      <UButton icon="tabler:arrow-left" color="neutral" variant="soft" @click="$router.push('/admin/news')">
        Orqaga
      </UButton>
      <h1 class="text-2xl font-bold">Kafedra sahifasi qo'shish</h1>
    </div>

    <UTabs color="secondary" :items="tabs" variant="link" :ui="{ trigger: 'grow' }" class="gap-4 w-full">
      
      <template #uz="{ item }">
        <p class="text-gray-500 mb-4">{{ item.description }}</p>

        <UForm :state="formState.uz" class="flex flex-col gap-6">
          <UFormField label="Sarlavha (O'zbek)" name="title">
            <UInput ref="titleUzRef" color="secondary" v-model="formState.uz.title" class="w-full" placeholder="Sahifa sarlavhasini kiriting" />
          </UFormField>

          <UFormField label="Asosiy Rasm (O'zbek)" name="mainPicture">
            <div class="flex items-center gap-4">
              <UInput color="secondary" v-model="formState.uz.mainPicture" class="flex-grow" placeholder="Rasm URL (Fayl menejeridan tanlang)" readonly />
              <UButton @click="openFileManager('uz')" color="primary" variant="soft" icon="i-heroicons-folder-open">
                Menejerni ochish
              </UButton>
            </div>
            <div v-if="formState.uz.mainPicture" class="mt-3 relative w-32 h-32 rounded-lg overflow-hidden border">
              <img :src="ENV_BASE + formState.uz.mainPicture" class="w-full h-full object-cover" />
              <UButton @click="formState.uz.mainPicture = ''" color="error" variant="solid" size="2xs" icon="i-heroicons-trash" class="absolute top-1 right-1 rounded-full px-1" />
            </div>
          </UFormField>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <UFormField label="Kafedra nomi" name="name"><UInput color="secondary" v-model="formState.uz.name" class="w-full" /></UFormField>
            <UFormField label="Manzil" name="address"><UInput color="secondary" v-model="formState.uz.address" class="w-full" /></UFormField>
            <UFormField label="Telefon raqami" name="phone"><UInput color="secondary" v-model="formState.uz.phone" class="w-full" /></UFormField>
            <UFormField label="Email" name="email"><UInput color="secondary" v-model="formState.uz.email" class="w-full" /></UFormField>
            <UFormField label="Facebook" name="facebook"><UInput color="secondary" v-model="formState.uz.facebook" class="w-full" /></UFormField>
            <UFormField label="Telegram" name="telegram"><UInput color="secondary" v-model="formState.uz.telegram" class="w-full" /></UFormField>
            <UFormField label="LinkedIn" name="linkedin"><UInput color="secondary" v-model="formState.uz.linkedin" class="w-full" /></UFormField>
          </div>

          <UFormField label="Batafsil ma'lumot (O'zbek)" name="content">
            <TextEditor v-model="formState.uz.content" />
          </UFormField>
        </UForm>
      </template>

      <template #en="{ item }">
        <p class="text-gray-500 mb-4">{{ item.description }}</p>

        <UForm :state="formState.en" class="flex flex-col gap-6">
          <UFormField label="Sarlavha (Ingliz)" name="title">
            <UInput color="secondary" v-model="formState.en.title" class="w-full" placeholder="Enter title" />
          </UFormField>

          <UFormField label="Asosiy Rasm (Ingliz)" name="mainPicture">
            <div class="flex items-center gap-4">
              <UInput color="secondary" v-model="formState.en.mainPicture" class="flex-grow" placeholder="Rasm URL (Fayl menejeridan tanlang)" readonly />
              <UButton @click="openFileManager('en')" color="primary" variant="soft" icon="i-heroicons-folder-open">
                Menejerni ochish
              </UButton>
            </div>
            <div v-if="formState.en.mainPicture" class="mt-3 relative w-32 h-32 rounded-lg overflow-hidden border">
              <img :src="ENV_BASE + formState.en.mainPicture" class="w-full h-full object-cover" />
              <UButton @click="formState.en.mainPicture = ''" color="error" variant="solid" size="2xs" icon="i-heroicons-trash" class="absolute top-1 right-1 rounded-full px-1" />
            </div>
          </UFormField>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <UFormField label="Kafedra nomi" name="name"><UInput color="secondary" v-model="formState.en.name" class="w-full" /></UFormField>
            <UFormField label="Manzil" name="address"><UInput color="secondary" v-model="formState.en.address" class="w-full" /></UFormField>
            <UFormField label="Telefon raqami" name="phone"><UInput color="secondary" v-model="formState.en.phone" class="w-full" /></UFormField>
            <UFormField label="Email" name="email"><UInput color="secondary" v-model="formState.en.email" class="w-full" /></UFormField>
            <UFormField label="Facebook" name="facebook"><UInput color="secondary" v-model="formState.en.facebook" class="w-full" /></UFormField>
            <UFormField label="Telegram" name="telegram"><UInput color="secondary" v-model="formState.en.telegram" class="w-full" /></UFormField>
            <UFormField label="LinkedIn" name="linkedin"><UInput color="secondary" v-model="formState.en.linkedin" class="w-full" /></UFormField>
          </div>

          <UFormField label="Batafsil ma'lumot (Ingliz)" name="content">
            <TextEditor v-model="formState.en.content" />
          </UFormField>
        </UForm>
      </template>

      <template #ru="{ item }">
        <p class="text-gray-500 mb-4">{{ item.description }}</p>

        <UForm :state="formState.ru" class="flex flex-col gap-6">
          <UFormField label="Sarlavha (Rus)" name="title">
            <UInput color="secondary" v-model="formState.ru.title" class="w-full" placeholder="Введите заголовок" />
          </UFormField>

          <UFormField label="Asosiy Rasm (Rus)" name="mainPicture">
            <div class="flex items-center gap-4">
              <UInput color="secondary" v-model="formState.ru.mainPicture" class="flex-grow" placeholder="Rasm URL (Fayl menejeridan tanlang)" readonly />
              <UButton @click="openFileManager('ru')" color="primary" variant="soft" icon="i-heroicons-folder-open">
                Menejerni ochish
              </UButton>
            </div>
            <div v-if="formState.ru.mainPicture" class="mt-3 relative w-32 h-32 rounded-lg overflow-hidden border">
              <img :src="ENV_BASE + formState.ru.mainPicture" class="w-full h-full object-cover" />
              <UButton @click="formState.ru.mainPicture = ''" color="error" variant="solid" size="2xs" icon="i-heroicons-trash" class="absolute top-1 right-1 rounded-full px-1" />
            </div>
          </UFormField>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <UFormField label="Kafedra nomi" name="name"><UInput color="secondary" v-model="formState.ru.name" class="w-full" /></UFormField>
            <UFormField label="Manzil" name="address"><UInput color="secondary" v-model="formState.ru.address" class="w-full" /></UFormField>
            <UFormField label="Telefon raqami" name="phone"><UInput color="secondary" v-model="formState.ru.phone" class="w-full" /></UFormField>
            <UFormField label="Email" name="email"><UInput color="secondary" v-model="formState.ru.email" class="w-full" /></UFormField>
            <UFormField label="Facebook" name="facebook"><UInput color="secondary" v-model="formState.ru.facebook" class="w-full" /></UFormField>
            <UFormField label="Telegram" name="telegram"><UInput color="secondary" v-model="formState.ru.telegram" class="w-full" /></UFormField>
            <UFormField label="LinkedIn" name="linkedin"><UInput color="secondary" v-model="formState.ru.linkedin" class="w-full" /></UFormField>
          </div>

          <UFormField label="Batafsil ma'lumot (Rus)" name="content">
            <TextEditor v-model="formState.ru.content" />
          </UFormField>
        </UForm>
      </template>

      <template #kr="{ item }">
        <p class="text-gray-500 mb-4">{{ item.description }}</p>

        <UForm :state="formState.kr" class="flex flex-col gap-6">
          <UFormField label="Sarlavha (Kiril)" name="title">
            <UInput color="secondary" v-model="formState.kr.title" class="w-full" placeholder="Сарлавҳа киритинг" />
          </UFormField>

          <UFormField label="Asosiy Rasm (Kiril)" name="mainPicture">
            <div class="flex items-center gap-4">
              <UInput color="secondary" v-model="formState.kr.mainPicture" class="flex-grow" placeholder="Rasm URL (Fayl menejeridan tanlang)" readonly />
              <UButton @click="openFileManager('kr')" color="primary" variant="soft" icon="i-heroicons-folder-open">
                Menejerni ochish
              </UButton>
            </div>
            <div v-if="formState.kr.mainPicture" class="mt-3 relative w-32 h-32 rounded-lg overflow-hidden border">
              <img :src="ENV_BASE + formState.kr.mainPicture" class="w-full h-full object-cover" />
              <UButton @click="formState.kr.mainPicture = ''" color="error" variant="solid" size="2xs" icon="i-heroicons-trash" class="absolute top-1 right-1 rounded-full px-1" />
            </div>
          </UFormField>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <UFormField label="Kafedra nomi" name="name"><UInput color="secondary" v-model="formState.kr.name" class="w-full" /></UFormField>
            <UFormField label="Manzil" name="address"><UInput color="secondary" v-model="formState.kr.address" class="w-full" /></UFormField>
            <UFormField label="Telefon raqami" name="phone"><UInput color="secondary" v-model="formState.kr.phone" class="w-full" /></UFormField>
            <UFormField label="Email" name="email"><UInput color="secondary" v-model="formState.kr.email" class="w-full" /></UFormField>
            <UFormField label="Facebook" name="facebook"><UInput color="secondary" v-model="formState.kr.facebook" class="w-full" /></UFormField>
            <UFormField label="Telegram" name="telegram"><UInput color="secondary" v-model="formState.kr.telegram" class="w-full" /></UFormField>
            <UFormField label="LinkedIn" name="linkedin"><UInput color="secondary" v-model="formState.kr.linkedin" class="w-full" /></UFormField>
          </div>

          <UFormField label="Batafsil ma'lumot (Kiril)" name="content">
            <TextEditor v-model="formState.kr.content" />
          </UFormField>
        </UForm>
      </template>
    </UTabs>

    <div class="mt-8 flex justify-end">
      <UButton @click="savedFunction" label="Sahifani saqlash" type="submit" color="secondary" size="lg" icon="material-symbols:save" />
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
import type { DepartmentDetails } from '~~/types/globalTypes'

definePageMeta({
  layout: 'admin' 
});
useHead({
  title: "Kafedra sahifasi qo'shish"
})

const { ENV_BASE } = useEnv()
const toast = useToast() 
const titleUzRef = ref<any>(null)
const router = useRouter()

const isFileManagerOpen = ref(false)
const currentImageLang = ref<keyof typeof formState | null>(null)

const openFileManager = (lang: keyof typeof formState) => {
  currentImageLang.value = lang
  isFileManagerOpen.value = true
}

const handleFileManagerSelect = (url: string) => {
  const relativePath = url.replace(ENV_BASE, '')
  if (currentImageLang.value) {
    formState[currentImageLang.value].mainPicture = relativePath
  }
}

const defaultDetails = (): DepartmentDetails & { content: string } => ({
  name: "", address: "", phone: "", email: "", facebook: "", telegram: "", linkedin: "", mainPicture: "", content: ""
})

const formState = reactive({
  uz: { title: "", ...defaultDetails() },
  en: { title: "", ...defaultDetails() },
  ru: { title: "", ...defaultDetails() },
  kr: { title: "", ...defaultDetails() },
})

const tabs = [
  { label: "O'zbekcha", description: "O'zbek tilidagi ma'lumotlarni kiriting.", slot: 'uz' as const },
  { label: "Inglizcha", description: "Ingliz tilidagi ma'lumotlarni kiriting.", slot: 'en' as const },
  { label: "Ruscha", description: "Rus tilidagi ma'lumotlarni kiriting.", slot: 'ru' as const },
  { label: "Kirilcha", description: "Kiril alifbosidagi ma'lumotlarni kiriting.", slot: 'kr' as const }
] satisfies TabsItem[];

const savedFunction = async () => {
  if (!formState.uz.title) {
    toast.add({
      color: "warning",
      title: "Diqqat!",
      description: "Iltimos, sahifaning O'zbek tilidagi sarlavhasini kiriting."
    })
    
    if (titleUzRef.value) {
       titleUzRef.value.inputRef?.focus() 
    }
    return
  }

  const createJSONContent = (langState: any) => {
    const { title, ...details } = langState; 
    return JSON.stringify(details);
  }

  const payload = {
    pageType: 2, 
    titleUz: formState.uz.title,
    titleEn: formState.en.title,
    titleRu: formState.ru.title,
    titleKr: formState.kr.title,
    contentUz: createJSONContent(formState.uz),
    contentEn: createJSONContent(formState.en),
    contentRu: createJSONContent(formState.ru),
    contentKr: createJSONContent(formState.kr)
  };

  try {
    await useApi('pages', {
      method: 'POST',
      body: payload
    });

    toast.add({
      title: "Muvaffaqiyatli!",
      description: "Sahifa muvaffaqiyatli yaratildi.",
      color: "success"
    });

    router.push('/admin/news');

  } catch (error) {
    toast.add({
      title: "Xatolik!",
      description: "Ma'lumotni saqlashda xatolik yuz berdi.",
      color: "error"
    });
  }
}
</script>