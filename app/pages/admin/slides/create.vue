<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Yangi slide qo'shish</h1>
      <UButton icon="tabler:arrow-left" color="gray" variant="soft" @click="$router.push('/admin/slides')">
        Orqaga
      </UButton>
    </div>

    <UCard>
      <form @submit.prevent="submitForm" class="space-y-6">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormGroup label="Sarlavha (UZ)">
            <UInput v-model="form.titleUz" placeholder="O'zbekcha sarlavha..." />
          </UFormGroup>
          <UFormGroup label="Sarlavha (RU)">
            <UInput v-model="form.titleRu" placeholder="Ruscha sarlavha..." />
          </UFormGroup>
          <UFormGroup label="Sarlavha (EN)">
            <UInput v-model="form.titleEn" placeholder="Inglizcha sarlavha..." />
          </UFormGroup>
          <UFormGroup label="Sarlavha (KR)">
            <UInput v-model="form.titleKr" placeholder="Kirilcha sarlavha..." />
          </UFormGroup>
        </div>

        <UDivider />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormGroup label="Tavsif (UZ)">
            <UTextarea v-model="form.descriptionUz" placeholder="O'zbekcha tavsif..." autoresize />
          </UFormGroup>
          <UFormGroup label="Tavsif (RU)">
            <UTextarea v-model="form.descriptionRu" placeholder="Ruscha tavsif..." autoresize />
          </UFormGroup>
          <UFormGroup label="Tavsif (EN)">
            <UTextarea v-model="form.descriptionEn" placeholder="Inglizcha tavsif..." autoresize />
          </UFormGroup>
          <UFormGroup label="Tavsif (KR)">
            <UTextarea v-model="form.descriptionKr" placeholder="Kirilcha tavsif..." autoresize />
          </UFormGroup>
        </div>

        <UDivider />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div class="space-y-6">
            <UFormGroup label="Bog'langan sahifa ID (ixtiyoriy)">
              <UInput v-model="form.relatedPageId" type="number" placeholder="Masalan: 12" />
            </UFormGroup>

            <UFormGroup label="Holati (Aktiv / Nofaol)">
              <UToggle v-model="form.isActive" />
            </UFormGroup>
          </div>

          <UFormGroup label="Asosiy Rasm (mainImagePath)">
            <div class="flex flex-col gap-3 items-start">
              <UButton color="gray" icon="tabler:photo" @click="isFileManagerOpen = true">
                Rasm tanlash
              </UButton>
              
              <div v-if="form.mainImagePath" class="relative w-full max-w-[250px] rounded-lg border overflow-hidden">
                <img :src="ENV_BASE + form.mainImagePath" class="w-full h-40 object-cover" alt="Tanlangan rasm" />
                <UButton 
                  icon="tabler:x" 
                  color="red" 
                  size="xs" 
                  class="absolute top-2 right-2 rounded-full" 
                  @click="form.mainImagePath = ''" 
                />
              </div>
            </div>
          </UFormGroup>
        </div>

        <div class="flex justify-end gap-3 mt-8">
          <UButton color="gray" variant="soft" @click="$router.push('/admin/slides')">Bekor qilish</UButton>
          <UButton type="submit" color="primary" :loading="isSubmitting">Saqlash</UButton>
        </div>
      </form>
    </UCard>

    <UModal v-model:open="isFileManagerOpen" title="Fayl menejeri" :ui="{ width: 'sm:max-w-4xl; lg:max-w-6xl' }">
      <template #body>
        <FileManagerModal 
          @select="handleImageSelection" 
          @close="isFileManagerOpen = false" 
        />
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin' 
});
const { ENV_BASE } = useEnv();
const router = useRouter();
const toast = useToast();

const isFileManagerOpen = ref(false);
const isSubmitting = ref(false);

const form = reactive({
  titleUz: null as string | null,
  titleEn: null as string | null,
  titleRu: null as string | null,
  titleKr: null as string | null,
  descriptionUz: null as string | null,
  descriptionRu: null as string | null,
  descriptionEn: null as string | null,
  descriptionKr: null as string | null,
  relatedPageId: null as number | null,
  mainImagePath: '',
  isActive: true
});

// Modal rasm tanlaganda ishlaydi
const handleImageSelection = (url: string) => {
  // Agar modal ENV_BASE qo'shilgan manzil qaytarsa, bazaga faqat relative manzilni yuborish uchun tozalaymiz.
  // Agar shusiz ham relative qaytarayotgan bo'lsa, hech narsa o'zgarmaydi.
  const relativePath = url.replace(ENV_BASE, '');
  form.mainImagePath = relativePath;
};

// Formani yuborish
const submitForm = async () => {
  isSubmitting.value = true;

  try {
    // API ga jo'natish (useApi orqali avtomatik token olinadi)
    await useApi('slides', {
      method: 'POST',
      body: {
        ...form,
        // relatedPageId string bo'lib qolmasligi uchun number ga o'giramiz
        relatedPageId: form.relatedPageId ? Number(form.relatedPageId) : null 
      }
    });

    toast.add({
      title: "Muvaffaqiyatli!",
      description: "Slide muvaffaqiyatli yaratildi.",
      color: "green"
    });

    // Slides ro'yxatiga qaytish
    router.push('/admin/slides');

  } catch (error) {
    console.error("Slide yaratishda xatolik:", error);
    toast.add({
      title: "Xatolik!",
      description: "Ma'lumotni saqlashda xatolik yuz berdi.",
      color: "red"
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>