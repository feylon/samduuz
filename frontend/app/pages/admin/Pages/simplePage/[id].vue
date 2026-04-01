<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="flex gap-4 items-center mb-6">
      <UButton icon="tabler:arrow-left" color="neutral" variant="soft" @click="$router.push('/admin/news')">
        Orqaga
      </UButton>
      <h1 class="text-2xl font-bold">Sahifani tahrirlash1</h1>
    </div>

    <div v-if="pending" class="space-y-6">
      <USkeleton class="h-10 w-full" />
      <USkeleton class="h-[300px] w-full" />
    </div>

    <div v-else>
      <UTabs color="secondary" :items="tabs" variant="link" :ui="{ trigger: 'grow' }" class="gap-4 w-full">
        
        <template #uz="{ item }">
          <p class="text-gray-500 mb-4">{{ item.description }}</p>

          <UForm :state="simplePage" class="flex flex-col gap-6">
            <UFormField label="Sarlavha (O'zbek)" name="titleUz">
              <UInput ref="titleUzRef" color="secondary" v-model="simplePage.titleUz" class="w-full" placeholder="Sarlavha kiriting" />
            </UFormField>

            <UFormField label="Sahifa matni (O'zbek)" name="contentUz">
              <TextEditor v-model="simplePage.contentUz" />
            </UFormField>
          </UForm>
        </template>

        <template #en="{ item }">
          <p class="text-gray-500 mb-4">{{ item.description }}</p>
          <UForm :state="simplePage" class="flex flex-col gap-6">
            <UFormField label="Sarlavha (Ingliz)" name="titleEn">
              <UInput color="secondary" v-model="simplePage.titleEn" class="w-full" placeholder="Enter title" />
            </UFormField>
            <UFormField label="Sahifa matni (Ingliz)" name="contentEn">
              <TextEditor v-model="simplePage.contentEn" />
            </UFormField>
          </UForm>
        </template>

        <template #ru="{ item }">
          <p class="text-gray-500 mb-4">{{ item.description }}</p>
          <UForm :state="simplePage" class="flex flex-col gap-6">
            <UFormField label="Sarlavha (Rus)" name="titleRu">
              <UInput color="secondary" v-model="simplePage.titleRu" class="w-full" placeholder="Введите заголовок" />
            </UFormField>
            <UFormField label="Sahifa matni (Rus)" name="contentRu">
              <TextEditor v-model="simplePage.contentRu" />
            </UFormField>
          </UForm>
        </template>

        <template #kr="{ item }">
          <p class="text-gray-500 mb-4">{{ item.description }}</p>
          <UForm :state="simplePage" class="flex flex-col gap-6">
            <UFormField label="Sarlavha (Kiril)" name="titleKr">
              <UInput color="secondary" v-model="simplePage.titleKr" class="w-full" placeholder="Сарлавҳа киритинг" />
            </UFormField>
            <UFormField label="Sahifa matni (Kiril)" name="contentKr">
              <TextEditor v-model="simplePage.contentKr" />
            </UFormField>
          </UForm>
        </template>
      </UTabs>

      <div class="mt-8 flex justify-end">
        <UButton @click="updateFunction" label="O'zgarishlarni saqlash" type="submit" color="secondary" size="lg" icon="material-symbols:save" />
      </div>
    </div>
  </div>
 
</template>

<script lang="ts" setup>
import type { TabsItem } from '@nuxt/ui'
import type { SimplePageDashboard } from '~~/types/globalTypes' 

definePageMeta({
  layout: 'admin' 
});
useHead({
  title: "Sahifani tahrirlash"
})

const route = useRoute()
const router = useRouter()
const toast = useToast() 
const { api } = useEnv()

const pageId = route.params.id 
const titleUzRef = ref<any>(null)

// Tahrirlanadigan State
const simplePage = reactive<SimplePageDashboard>({
  contentEn: "",
  contentUz: "",
  contentRu: "",
  contentKr: "",
  titleEn: "",
  titleUz: "",
  titleRu: "",
  titleKr: ""
})

// 1. O'zgarish: Ma'lumot to'g'ridan-to'g'ri (data o'rami bo'lmagan) ko'rinishda kelayotgani uchun 
// turni shunchaki "SimplePageDashboard & { id: number, pageType: number }" deb belgilaymiz.
const { pending, data, error } = await useFetch<SimplePageDashboard & { id: number, pageType: number }>(`pages/${pageId}/full`, {
  baseURL: api,
  headers: { Authorization: `Bearer ${useCookie("accessToken").value}` },
})

// 2. O'zgarish: onResponse o'rniga, data o'zgarganini watch orqali kuzatib state'ni to'ldiramiz.
// Bu usul Nuxt 3 da eng ishonchli usul hisoblanadi.
watch(data, (newData) => {
  if (newData) {
    console.log("Ma'lumotlar API dan keldi:", newData);
    // Null yoki undefined qiymatlar o'rniga bo'sh string ("") qo'yib chiqamiz, 
    // chunki Inputlar null ni yoqtirmaydi.
    simplePage.titleUz = newData.titleUz || "";
    simplePage.titleEn = newData.titleEn || "";
    simplePage.titleRu = newData.titleRu || "";
    simplePage.titleKr = newData.titleKr || "";
    simplePage.contentUz = newData.contentUz || "";
    simplePage.contentEn = newData.contentEn || "";
    simplePage.contentRu = newData.contentRu || "";
    simplePage.contentKr = newData.contentKr || "";
  }
}, { immediate: true }) // immediate: true qilsak, sahifa yuklanganda data allaqachon bo'lsa darhol ishlaydi


const tabs = [
  {
    label: "O'zbekcha",
    description: "Sahifaning O'zbek tilidagi ma'lumotlarini tahrirlang.",
    slot: 'uz' as const
  },
  {
    label: "Inglizcha",
    description: "Sahifaning Ingliz tilidagi ma'lumotlarini tahrirlang.",
    slot: 'en' as const
  },
  {
    label: "Ruscha",
    description: "Sahifaning Rus tilidagi ma'lumotlarini tahrirlang.",
    slot: 'ru' as const,
  },
  {
    label: "Kirilcha",
    description: "Sahifaning Kiril alifbosidagi ma'lumotlarini tahrirlang.",
    slot: 'kr' as const,
  }
] satisfies TabsItem[];


const updateFunction = async () => {
  if (!simplePage.titleUz) {
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

  // Backend kutayotgan payload
  const payload = {
    pageType: 0,
    titleUz: simplePage.titleUz,
    titleEn: simplePage.titleEn,
    titleRu: simplePage.titleRu,
    titleKr: simplePage.titleKr,
    contentUz: simplePage.contentUz,
    contentRu: simplePage.contentRu,
    contentEn: simplePage.contentEn,
    contentKr: simplePage.contentKr
  };

  try {
    // PUT so'rovi orqali yangilash
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
      description: "Ma'lumotni yangilashda xatolik yuz berdi.",
      color: "error"
    });
  }
}
</script>