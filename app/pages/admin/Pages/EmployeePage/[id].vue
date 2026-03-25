<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="flex gap-4 items-center mb-6">
      <UButton icon="tabler:arrow-left" color="neutral" variant="soft" @click="$router.push('/admin/news')">
        Orqaga
      </UButton>
      <h1 class="text-2xl font-bold">Rahbariyat sahifasini tahrirlash</h1>
    </div>

    <div v-if="pending" class="space-y-6">
      <USkeleton class="h-10 w-full" />
      <USkeleton class="h-[500px] w-full" />
    </div>

    <div v-else>
      <UTabs color="secondary" :items="tabs" variant="link" :ui="{ trigger: 'grow' }" class="gap-4 w-full">
        
        <template #uz="{ item }">
          <p class="text-gray-500 mb-4">{{ item.description }}</p>

          <UForm :state="formState.uz" class="flex flex-col gap-6">
            <UFormField label="Sarlavha (O'zbek)" name="title">
              <UInput ref="titleUzRef" color="secondary" v-model="formState.uz.title" class="w-full" placeholder="Sahifa sarlavhasini kiriting" />
            </UFormField>

            <UFormField label="Asosiy Rasm (O'zbek)" name="mainImgURL">
              <div class="flex items-center gap-4">
                <UInput color="secondary" v-model="formState.uz.mainImgURL" class="flex-grow" placeholder="Rasm URL (Fayl menejeridan tanlang)" readonly />
                <UButton @click="openFileManager('uz')" color="primary" variant="soft" icon="i-heroicons-folder-open">
                  Menejerni ochish
                </UButton>
              </div>
              <div v-if="formState.uz.mainImgURL" class="mt-3 relative w-32 h-32 rounded-lg overflow-hidden border">
                <img :src="ENV_BASE + formState.uz.mainImgURL" class="w-full h-full object-cover" />
                <UButton @click="formState.uz.mainImgURL = ''" color="error" variant="solid" size="2xs" icon="i-heroicons-trash" class="absolute top-1 right-1 rounded-full px-1" />
              </div>
            </UFormField>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <UFormField label="Lavozimi" name="position"><UInput color="secondary" v-model="formState.uz.position" class="w-full" /></UFormField>
              <UFormField label="Ismi" name="firstName"><UInput color="secondary" v-model="formState.uz.firstName" class="w-full" /></UFormField>
              <UFormField label="Familiyasi" name="lastName"><UInput color="secondary" v-model="formState.uz.lastName" class="w-full" /></UFormField>
              <UFormField label="Otasining ismi" name="fathersName"><UInput color="secondary" v-model="formState.uz.fathersName" class="w-full" /></UFormField>
              <UFormField label="Tug'ilgan sanasi" name="dateOfBirth"><UInput color="secondary" v-model="formState.uz.dateOfBirth" class="w-full" placeholder="Masalan: 01.01.1980" /></UFormField>
              <UFormField label="Manzil" name="address"><UInput color="secondary" v-model="formState.uz.address" class="w-full" /></UFormField>
              <UFormField label="Telefon raqami" name="phoneNumber"><UInput color="secondary" v-model="formState.uz.phoneNumber" class="w-full" /></UFormField>
              <UFormField label="Email" name="email"><UInput color="secondary" v-model="formState.uz.email" class="w-full" /></UFormField>
              <UFormField label="Qabul kunlari" name="receptionDays"><UInput color="secondary" v-model="formState.uz.receptionDays" class="w-full" placeholder="Dushanba - Juma" /></UFormField>
              <UFormField label="Ish boshlanish vaqti" name="workStartTime"><UInput color="secondary" v-model="formState.uz.workStartTime" class="w-full" placeholder="8:00" /></UFormField>
              <UFormField label="Ish tugash vaqti" name="workEndTime"><UInput color="secondary" v-model="formState.uz.workEndTime" class="w-full" placeholder="17:00" /></UFormField>
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

            <UFormField label="Asosiy Rasm (Ingliz)" name="mainImgURL">
              <div class="flex items-center gap-4">
                <UInput color="secondary" v-model="formState.en.mainImgURL" class="flex-grow" placeholder="Rasm URL (Fayl menejeridan tanlang)" readonly />
                <UButton @click="openFileManager('en')" color="primary" variant="soft" icon="i-heroicons-folder-open">
                  Menejerni ochish
                </UButton>
              </div>
              <div v-if="formState.en.mainImgURL" class="mt-3 relative w-32 h-32 rounded-lg overflow-hidden border">
                <img :src="ENV_BASE + formState.en.mainImgURL" class="w-full h-full object-cover" />
                <UButton @click="formState.en.mainImgURL = ''" color="error" variant="solid" size="2xs" icon="i-heroicons-trash" class="absolute top-1 right-1 rounded-full px-1" />
              </div>
            </UFormField>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <UFormField label="Lavozimi" name="position"><UInput color="secondary" v-model="formState.en.position" class="w-full" /></UFormField>
              <UFormField label="Ismi" name="firstName"><UInput color="secondary" v-model="formState.en.firstName" class="w-full" /></UFormField>
              <UFormField label="Familiyasi" name="lastName"><UInput color="secondary" v-model="formState.en.lastName" class="w-full" /></UFormField>
              <UFormField label="Otasining ismi" name="fathersName"><UInput color="secondary" v-model="formState.en.fathersName" class="w-full" /></UFormField>
              <UFormField label="Tug'ilgan sanasi" name="dateOfBirth"><UInput color="secondary" v-model="formState.en.dateOfBirth" class="w-full" /></UFormField>
              <UFormField label="Manzil" name="address"><UInput color="secondary" v-model="formState.en.address" class="w-full" /></UFormField>
              <UFormField label="Telefon raqami" name="phoneNumber"><UInput color="secondary" v-model="formState.en.phoneNumber" class="w-full" /></UFormField>
              <UFormField label="Email" name="email"><UInput color="secondary" v-model="formState.en.email" class="w-full" /></UFormField>
              <UFormField label="Qabul kunlari" name="receptionDays"><UInput color="secondary" v-model="formState.en.receptionDays" class="w-full" /></UFormField>
              <UFormField label="Ish boshlanish vaqti" name="workStartTime"><UInput color="secondary" v-model="formState.en.workStartTime" class="w-full" /></UFormField>
              <UFormField label="Ish tugash vaqti" name="workEndTime"><UInput color="secondary" v-model="formState.en.workEndTime" class="w-full" /></UFormField>
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

            <UFormField label="Asosiy Rasm (Rus)" name="mainImgURL">
              <div class="flex items-center gap-4">
                <UInput color="secondary" v-model="formState.ru.mainImgURL" class="flex-grow" placeholder="Rasm URL (Fayl menejeridan tanlang)" readonly />
                <UButton @click="openFileManager('ru')" color="primary" variant="soft" icon="i-heroicons-folder-open">
                  Menejerni ochish
                </UButton>
              </div>
              <div v-if="formState.ru.mainImgURL" class="mt-3 relative w-32 h-32 rounded-lg overflow-hidden border">
                <img :src="ENV_BASE + formState.ru.mainImgURL" class="w-full h-full object-cover" />
                <UButton @click="formState.ru.mainImgURL = ''" color="error" variant="solid" size="2xs" icon="i-heroicons-trash" class="absolute top-1 right-1 rounded-full px-1" />
              </div>
            </UFormField>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <UFormField label="Lavozimi" name="position"><UInput color="secondary" v-model="formState.ru.position" class="w-full" /></UFormField>
              <UFormField label="Ismi" name="firstName"><UInput color="secondary" v-model="formState.ru.firstName" class="w-full" /></UFormField>
              <UFormField label="Familiyasi" name="lastName"><UInput color="secondary" v-model="formState.ru.lastName" class="w-full" /></UFormField>
              <UFormField label="Otasining ismi" name="fathersName"><UInput color="secondary" v-model="formState.ru.fathersName" class="w-full" /></UFormField>
              <UFormField label="Tug'ilgan sanasi" name="dateOfBirth"><UInput color="secondary" v-model="formState.ru.dateOfBirth" class="w-full" /></UFormField>
              <UFormField label="Manzil" name="address"><UInput color="secondary" v-model="formState.ru.address" class="w-full" /></UFormField>
              <UFormField label="Telefon raqami" name="phoneNumber"><UInput color="secondary" v-model="formState.ru.phoneNumber" class="w-full" /></UFormField>
              <UFormField label="Email" name="email"><UInput color="secondary" v-model="formState.ru.email" class="w-full" /></UFormField>
              <UFormField label="Qabul kunlari" name="receptionDays"><UInput color="secondary" v-model="formState.ru.receptionDays" class="w-full" /></UFormField>
              <UFormField label="Ish boshlanish vaqti" name="workStartTime"><UInput color="secondary" v-model="formState.ru.workStartTime" class="w-full" /></UFormField>
              <UFormField label="Ish tugash vaqti" name="workEndTime"><UInput color="secondary" v-model="formState.ru.workEndTime" class="w-full" /></UFormField>
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

            <UFormField label="Asosiy Rasm (Kiril)" name="mainImgURL">
              <div class="flex items-center gap-4">
                <UInput color="secondary" v-model="formState.kr.mainImgURL" class="flex-grow" placeholder="Rasm URL (Fayl menejeridan tanlang)" readonly />
                <UButton @click="openFileManager('kr')" color="primary" variant="soft" icon="i-heroicons-folder-open">
                  Menejerni ochish
                </UButton>
              </div>
              <div v-if="formState.kr.mainImgURL" class="mt-3 relative w-32 h-32 rounded-lg overflow-hidden border">
                <img :src="ENV_BASE + formState.kr.mainImgURL" class="w-full h-full object-cover" />
                <UButton @click="formState.kr.mainImgURL = ''" color="error" variant="solid" size="2xs" icon="i-heroicons-trash" class="absolute top-1 right-1 rounded-full px-1" />
              </div>
            </UFormField>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <UFormField label="Lavozimi" name="position"><UInput color="secondary" v-model="formState.kr.position" class="w-full" /></UFormField>
              <UFormField label="Ismi" name="firstName"><UInput color="secondary" v-model="formState.kr.firstName" class="w-full" /></UFormField>
              <UFormField label="Familiyasi" name="lastName"><UInput color="secondary" v-model="formState.kr.lastName" class="w-full" /></UFormField>
              <UFormField label="Otasining ismi" name="fathersName"><UInput color="secondary" v-model="formState.kr.fathersName" class="w-full" /></UFormField>
              <UFormField label="Tug'ilgan sanasi" name="dateOfBirth"><UInput color="secondary" v-model="formState.kr.dateOfBirth" class="w-full" /></UFormField>
              <UFormField label="Manzil" name="address"><UInput color="secondary" v-model="formState.kr.address" class="w-full" /></UFormField>
              <UFormField label="Telefon raqami" name="phoneNumber"><UInput color="secondary" v-model="formState.kr.phoneNumber" class="w-full" /></UFormField>
              <UFormField label="Email" name="email"><UInput color="secondary" v-model="formState.kr.email" class="w-full" /></UFormField>
              <UFormField label="Qabul kunlari" name="receptionDays"><UInput color="secondary" v-model="formState.kr.receptionDays" class="w-full" /></UFormField>
              <UFormField label="Ish boshlanish vaqti" name="workStartTime"><UInput color="secondary" v-model="formState.kr.workStartTime" class="w-full" /></UFormField>
              <UFormField label="Ish tugash vaqti" name="workEndTime"><UInput color="secondary" v-model="formState.kr.workEndTime" class="w-full" /></UFormField>
            </div>

            <UFormField label="Batafsil ma'lumot (Kiril)" name="content">
              <TextEditor v-model="formState.kr.content" />
            </UFormField>
          </UForm>
        </template>
      </UTabs>

      <div class="mt-8 flex justify-end">
        <UButton @click="updateFunction" label="O'zgarishlarni saqlash" type="submit" color="secondary" size="lg" icon="material-symbols:save" />
      </div>
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
import type { ContentDetails } from '~~/types/globalTypes'
// Agar FileManagerModal alohida joyda bo'lsa uni import qiling:
// import FileManagerModal from '~/components/FileManagerModal.vue'

definePageMeta({
  layout: 'admin' 
});
useHead({
  title: "Rahbariyat sahifasini tahrirlash"
})

const route = useRoute()
const router = useRouter()
const toast = useToast() 
const { api, ENV_BASE } = useEnv()

const pageId = route.params.id // ID ni URL dan olish
const titleUzRef = ref<any>(null)

// ===== FAYL MENEJERI =====
const isFileManagerOpen = ref(false)
const currentImageLang = ref<keyof typeof formState | null>(null)

const openFileManager = (lang: keyof typeof formState) => {
  currentImageLang.value = lang
  isFileManagerOpen.value = true
}

const handleFileManagerSelect = (url: string) => {
  const relativePath = url.replace(ENV_BASE, '')
  if (currentImageLang.value) {
    formState[currentImageLang.value].mainImgURL = relativePath
  }
}
// ==========================

// JSON ichidagi maydonlar interfeysi


// Boshlang'ich bo'sh qiymatlar funksiyasi (JSON xato bo'lsa formani to'ldirish uchun)
const defaultDetails = (): ContentDetails => ({
  workStartTime: "", workEndTime: "", receptionDays: "", firstName: "",
  lastName: "", phoneNumber: "", email: "", fathersName: "", dateOfBirth: "",
  position: "", address: "", mainImgURL: "", content: ""
})

// Tahrirlanadigan State
const formState = reactive({
  uz: { title: "", ...defaultDetails() } as ContentDetails & { title: string },
  en: { title: "", ...defaultDetails() } as ContentDetails & { title: string },
  ru: { title: "", ...defaultDetails() } as ContentDetails & { title: string },
  kr: { title: "", ...defaultDetails() } as ContentDetails & { title: string },
})

const tabs = [
  { label: "O'zbekcha", description: "O'zbek tilidagi ma'lumotlarni tahrirlang.", slot: 'uz' as const },
  { label: "Inglizcha", description: "Ingliz tilidagi ma'lumotlarni tahrirlang.", slot: 'en' as const },
  { label: "Ruscha", description: "Rus tilidagi ma'lumotlarni tahrirlang.", slot: 'ru' as const },
  { label: "Kirilcha", description: "Kiril alifbosidagi ma'lumotlarni tahrirlang.", slot: 'kr' as const }
] satisfies TabsItem[];


// Ma'lumotlarni API dan olib kelish (Backenddan o'rami yo'q to'g'ridan to'g'ri ob'ekt keladi)
const { pending, data } = await useFetch<any>(`pages/${pageId}/full`, {
  baseURL: api,
  headers: { Authorization: `Bearer ${useCookie("accessToken").value}` },
})

// Yordamchi JSON Parser funksiyasi
const parseJSONContent = (jsonString: string | undefined): ContentDetails => {
  if (!jsonString) return defaultDetails();
  try {
    const parsed = JSON.parse(jsonString);
    // Bazadan kelayotgan ob'ekt ba'zi qatorlarni o'z ichiga olmasligi mumkin, 
    // shuning uchun default qiymatlar bilan birlashtiramiz (merge).
    return { ...defaultDetails(), ...parsed };
  } catch (error) {
    console.warn("JSON Parse xatosi: ", error);
    return defaultDetails();
  }
}

// Ma'lumotlar kelishi bilan formState'ni to'ldirish
watch(data, (newData) => {
  if (newData) {
    // Har bir til uchun sarlavha (title) va Ichki JSON (content...) larini ajratib biriktiramiz
    formState.uz = { title: newData.titleUz || "", ...parseJSONContent(newData.contentUz) }
    formState.en = { title: newData.titleEn || "", ...parseJSONContent(newData.contentEn) }
    formState.ru = { title: newData.titleRu || "", ...parseJSONContent(newData.contentRu) }
    formState.kr = { title: newData.titleKr || "", ...parseJSONContent(newData.contentKr) }
  }
}, { immediate: true })


// Saqlash (PUT) funksiyasi
const updateFunction = async () => {
  if (!formState.uz.title) {
    toast.add({
      color: "warning",
      title: "Diqqat!",
      description: "Iltimos, sahifaning O'zbek tilidagi sarlavhasini kiriting."
    })
    if (titleUzRef.value) titleUzRef.value.inputRef?.focus() 
    return
  }

  // Yordamchi: State dan JSON string yasash
  const createJSONContent = (langState: any) => {
    const { title, ...details } = langState; 
    return JSON.stringify(details);
  }

  // Backend kutayotgan PUT payload
  const payload = {
    pageType: 1, 
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
    await useApi(`pages/${pageId}`, {
      method: 'PUT',
      body: payload
    });

    toast.add({
      title: "Muvaffaqiyatli!",
      description: "Sahifa muvaffaqiyatli yangilandi.",
      color: "success"
    });

    // router.push('/admin/news');

  } catch (error) {
    console.error("Sahifani yangilashda xatolik:", error);
    toast.add({
      title: "Xatolik!",
      description: "Ma'lumotni saqlashda xatolik yuz berdi.",
      color: "error"
    });
  }
}
</script>