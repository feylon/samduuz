<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="flex gap-4 items-center mb-6">
      <UButton icon="tabler:arrow-left" color="neutral" variant="soft" @click="$router.push('/admin/announcements')">
        Orqaga
      </UButton>
      <h1 class="text-2xl font-bold">Yangillik qo'shish</h1>
    </div>

    <div class="w-full flex justify-start mb-8">
      <div v-if="state.mainImagePath" class="w-100 relative">
        <div
          class="w-full h-full absolute top-0 left-0 flex items-center justify-center opacity-0 hover:opacity-50 hover:bg-white transition-opacity cursor-pointer"
          @click="state.mainImagePath = ''">
          <Icon name="material-symbols:delete-forever-rounded" class="text-6xl text-red-800" />
        </div>
        <img :src="ENV_BASE + state.mainImagePath" alt="Asosiy rasm">
      </div>

      <div v-else @click="fileManagerModal = true;"
        class="cursor-pointer w-50 h-50 bg-gray-200 rounded flex-col flex items-center justify-center">
        <Icon name="material-symbols:cloud-upload" class="animate-bounce text-5xl" />
        <span class="text-gray-500">Rasm yuklash</span>
      </div>
    </div>

    <UTabs color="secondary" :items="tabs" variant="link" :ui="{ trigger: 'grow' }" class="gap-4 w-full">
      
      <template #uz="{ item }">
        <p class="text-gray-500 mb-4">{{ item.description }}</p>

        <UForm :state="state" class="flex flex-col gap-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField label="Sarlavha (O'zbek)" name="titleUz">
              <UInput ref="titleUzRef" color="secondary" v-model="state.titleUz" class="w-full" placeholder="Sarlavha kiriting" />
            </UFormField>

            <UFormField label="Tavsifi (O'zbek)" name="descriptionUz">
              <UTextarea ref="descUzRef" color="secondary" v-model="state.descriptionUz" class="w-full" placeholder="Qisqacha tavsif" />
            </UFormField>
          </div>

          <UFormField label="Xabar matni (O'zbek)" name="contentUz">
            <TextEditor v-model="state.contentUz" />
          </UFormField>
        </UForm>
      </template>

      <template #en="{ item }">
        <p class="text-gray-500 mb-4">{{ item.description }}</p>
        <UForm :state="state" class="flex flex-col gap-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField label="Sarlavha (Ingliz)" name="titleEn">
              <UInput color="secondary" v-model="state.titleEn" class="w-full" placeholder="Enter title" />
            </UFormField>
            <UFormField label="Tavsifi (Ingliz)" name="descriptionEn">
              <UTextarea color="secondary" v-model="state.descriptionEn" class="w-full" placeholder="Short description" />
            </UFormField>
          </div>
          <UFormField label="Xabar matni (Ingliz)" name="contentEn">
            <TextEditor v-model="state.contentEn" />
          </UFormField>
        </UForm>
      </template>

      <template #ru="{ item }">
        <p class="text-gray-500 mb-4">{{ item.description }}</p>
        <UForm :state="state" class="flex flex-col gap-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField label="Sarlavha (Rus)" name="titleRu">
              <UInput color="secondary" v-model="state.titleRu" class="w-full" placeholder="Введите заголовок" />
            </UFormField>
            <UFormField label="Tavsifi (Rus)" name="descriptionRu">
              <UTextarea color="secondary" v-model="state.descriptionRu" class="w-full" placeholder="Краткое описание" />
            </UFormField>
          </div>
          <UFormField label="Xabar matni (Rus)" name="contentRu">
            <TextEditor v-model="state.contentRu" />
          </UFormField>
        </UForm>
      </template>

      <template #kr="{ item }">
        <p class="text-gray-500 mb-4">{{ item.description }}</p>
        <UForm :state="state" class="flex flex-col gap-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField label="Sarlavha (Kiril)" name="titleKr">
              <UInput color="secondary" v-model="state.titleKr" class="w-full" placeholder="Сарлавҳа киритинг" />
            </UFormField>
            <UFormField label="Tavsifi (Kiril)" name="descriptionKr">
              <UTextarea color="secondary" v-model="state.descriptionKr" class="w-full" placeholder="Қисқача тавсиф" />
            </UFormField>
          </div>
          <UFormField label="Xabar matni (Kiril)" name="contentKr">
            <TextEditor v-model="state.contentKr" />
          </UFormField>
        </UForm>
      </template>
    </UTabs>

    <div class="mt-8 flex justify-end">
      <UButton @click="savedFunction" label="Yangillikni saqlash" type="submit" color="secondary" size="lg" icon="material-symbols:save" />
    </div>
  </div>

  <UModal v-model:open="fileManagerModal" title="Fayl menejeri" :ui="{ width: 'sm:max-w-4xl; lg:max-w-6xl' }">
    <template #body>
      <FileManagerModal @select="handleImageSelection" @close="fileManagerModal = false" />
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { TabsItem } from '@nuxt/ui'
import type { CreateNews } from '~~/types/globalTypes'

definePageMeta({
  layout: 'admin' 
});
useHead({
  title: "Yangillik qo'shish"
})

const { ENV_BASE } = useEnv()
const toast = useToast() 
const fileManagerModal = ref<boolean>(false)

const titleUzRef = ref<any>(null)
const descUzRef = ref<any>(null)
const router = useRouter();

const state = reactive<CreateNews>({
  contentEn: "",
  contentUz: "",
  contentRu: "",
  contentKr: "",
  titleEn: "",
  titleUz: "",
  titleRu: "",
  titleKr: "",
  descriptionEn: "",
  descriptionUz: "",
  descriptionRu: "",
  descriptionKr: "",
  mainImagePath: ""
})

const handleImageSelection = (url: string) => {
  const relativePath = url.replace(ENV_BASE, '')
  state.mainImagePath = relativePath
}

const tabs = [
  {
    label: "O'zbekcha",
    description: "Yangillikning O'zbek tilidagi ma'lumotlarini kiriting.",
    slot: 'uz' as const
  },
  {
    label: "Inglizcha",
    description: "Yangillikning Ingliz tilidagi ma'lumotlarini kiriting.",
    slot: 'en' as const
  },
  {
    label: "Ruscha",
    description: "Yangillikning Rus tilidagi ma'lumotlarini kiriting.",
    slot: 'ru' as const,
  },
  {
    label: "Kirilcha",
    description: "Yangillikning Kiril alifbosidagi ma'lumotlarini kiriting.",
    slot: 'kr' as const,
  }
] satisfies TabsItem[];


const savedFunction = async () => {
  if (!state.titleUz) {
    toast.add({
      color: "warning",
      title: "Diqqat!",
      description: "Iltimos, Yangillikning O'zbek tilidagi sarlavhasini kiriting."
    })
    
    if (titleUzRef.value) {
       titleUzRef.value.inputRef?.focus() 
    }
    return
  }

  if (!state.mainImagePath) {
    toast.add({
      color: "warning",
      title: "Diqqat!",
      description: "Iltimos, Yangillikning asosiy rasmini tanlang."
    })
    return
  }

  if (!state.descriptionUz) {
    toast.add({
      color: "warning",
      title: "Diqqat!",
      description: "Iltimos, Yangillikning O'zbek tilidagi qisqacha tavsifini kiriting."
    })

    if (descUzRef.value) {
       descUzRef.value.textareaRef?.focus() 
    }
    return
  }

  console.log("Hamma ma'lumotlar to'g'ri. API ga jo'natish mumkin:", state);


  try {
    const data = await useApi('news', {
      method: 'POST',
      body: state
    });

    const fields = [
  "contentEn", "contentUz", "contentRu", "contentKr",
  "titleEn", "titleUz", "titleRu", "titleKr",
  "descriptionEn", "descriptionUz", "descriptionRu", "descriptionKr",
  "mainImagePath"
] as const;



    toast.add({
      title: "Muvaffaqiyatli!",
      description: "Yangillik muvaffaqiyatli yaratildi.",
      color: "success"
    });

    router.push('/admin/news');

  } catch (error) {
    console.error("Yangillik yaratishda xatolik:", error);
    toast.add({
      title: "Xatolik!",
      description: "Ma'lumotni saqlashda xatolik yuz berdi.",
      color: "error"
    });
  }
}
</script>