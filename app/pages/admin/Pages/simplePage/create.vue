<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="flex gap-4 items-center mb-6">
      <UButton icon="tabler:arrow-left" color="neutral" variant="soft" @click="$router.push('/admin/news')">
        Orqaga
      </UButton>
      <h1 class="text-2xl font-bold">Sahifa qo'shish</h1>
    </div>

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
      <UButton @click="savedFunction" label="Sahifani saqlash" type="submit" color="secondary" size="lg" icon="material-symbols:save" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { TabsItem } from '@nuxt/ui'
// globalTypes faylidagi interfeys nomi ham endi SimplePage bo'lishi kerak
import type { SimplePageDashboard } from '~~/types/globalTypes' 

definePageMeta({
  layout: 'admin' 
});
useHead({
  title: "Sahifa qo'shish"
})

const toast = useToast() 
const titleUzRef = ref<any>(null)
const router = useRouter();

// Yangi formatdagi State, faqat title va contentlar mavjud
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

const tabs = [
  {
    label: "O'zbekcha",
    description: "Sahifaning O'zbek tilidagi ma'lumotlarini kiriting.",
    slot: 'uz' as const
  },
  {
    label: "Inglizcha",
    description: "Sahifaning Ingliz tilidagi ma'lumotlarini kiriting.",
    slot: 'en' as const
  },
  {
    label: "Ruscha",
    description: "Sahifaning Rus tilidagi ma'lumotlarini kiriting.",
    slot: 'ru' as const,
  },
  {
    label: "Kirilcha",
    description: "Sahifaning Kiril alifbosidagi ma'lumotlarini kiriting.",
    slot: 'kr' as const,
  }
] satisfies TabsItem[];


const savedFunction = async () => {
  // 1. Validatsiya: Faqat O'zbekcha sarlavhani tekshiramiz
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

  // 2. Payload tayyorlash (Backendga faqat state o'zi va pageType ketadi)
  const payload = {
    pageType: 0,
    ...simplePage
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

    // router.push('/admin/news');

  } catch (error) {
    console.error("Sahifa yaratishda xatolik:", error);
    toast.add({
      title: "Xatolik!",
      description: "Ma'lumotni saqlashda xatolik yuz berdi.",
      color: "error"
    });
  }
}
</script>