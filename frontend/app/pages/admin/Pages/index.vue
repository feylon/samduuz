<template>
  <div class="p-6  mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Sahifalar ro'yxati</h1>
    </div>

    <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <USkeleton v-for="i in 8" :key="i" class="h-[220px] w-full rounded-2xl" />
    </div>

    <div v-else-if="!data?.data?.items || data.data.items.length === 0"
      class="flex flex-col items-center justify-center py-20 opacity-50">
      <UIcon name="i-heroicons-document-magnifying-glass" class="w-24 h-24 mb-4 text-gray-400" />
      <h2 class="text-xl font-medium text-gray-500">Sahifalar hozirda mavjud emas</h2>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      <div v-for="page in data?.data?.items" :key="page.id"
        class="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-5 flex flex-col h-full">
        <div class="mb-3">
          <UBadge :color="getPageTypeInfo(page.pageType).color" variant="subtle" size="sm">
            {{ getPageTypeInfo(page.pageType).label }}
          </UBadge>
        </div>

        <h3 class="text-lg font-bold text-gray-900 line-clamp-2 mb-4 flex-grow">
          {{ page.titleUz }}
        </h3>

        <div class="flex flex-col gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100 mb-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-calendar-days" class="w-4 h-4 text-gray-400" />
            <span>Yaratildi:</span>
            <time class="font-medium text-gray-700">{{ formatDate(page.createdAt) }}</time>
          </div>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-pencil-square" class="w-4 h-4 text-gray-400" />
            <span>Yangilandi:</span>
            <time class="font-medium text-gray-700">{{ formatDate(page.updatedAt) }}</time>
          </div>
        </div>

        <div class="mt-auto flex flex-col gap-2">
          <UButton @click="goToEdit(page.id, page.pageType)" color="secondary" variant="soft"
            icon="i-heroicons-pencil-square-solid" block class="cursor-pointer">
            Tahrirlash
          </UButton>

          <UButton color="error" variant="soft" icon="i-heroicons-trash-solid" block class="cursor-pointer"
            @click="selectedPage = page.id; isSelectedNewsText = page.titleUz; isModalOpen = true;">
            O'chirish
          </UButton>
        </div>
      </div>
    </div>

    <div class="flex justify-center lg:justify-end mt-8" v-if="data?.data?.meta && data.data.meta.totalCount > 0">
      <UPagination v-model:page="currentPage" :total="data.data.meta.totalCount"
        :items-per-page="data.data.meta.pageSize" :sibling-count="1" show-edges color="secondary"
        active-color="secondary" />
    </div>
  </div>

  <UModal v-model:open="isModalOpen" :title="``">
    <template #body>
      <div class="p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Sahifani o'chirish</h3>
        <p class="text-gray-500 mb-6">Haqiqatan ham bu sahifani o'chirmoqchimisiz?</p>
        <span class="block mb-6 font-medium text-gray-700 bg-gray-50 p-3 rounded-lg">
          {{ isSelectedNewsText ? (isSelectedNewsText.length > 100 ? isSelectedNewsText.substring(0, 100) + '...' :
            isSelectedNewsText) : 'Sahifa tavsifi mavjud emas' }}
        </span>
        <div class="flex justify-end gap-3">
          <UButton @click="isModalOpen = false" variant="soft" color="neutral">
            Bekor qilish
          </UButton>
          <UButton @click="deleteFunction(selectedPage)" variant="solid" color="error">
            O'chirish
          </UButton>
        </div>
      </div>
    </template>
  </UModal>

  <FabMenu />
</template>

<script lang="ts" setup>
import type { Res, meta } from '~~/types/globalTypes'

definePageMeta({
  layout: 'admin'
})
useHead({
  title: "Sahifalar ro'yxati",

})

const route = useRoute()
const router = useRouter()
const { api } = useEnv()

type PageListItem = {
  id: number;
  titleUz: string;
  pageType: number;
  createdAt: string;
  updatedAt: string;
}
const toast = useToast();
const currentPage = computed({
  get: () => Number(route.query.page) || 1,
  set: (value) => {
    router.push({ query: { ...route.query, page: value } })
  }
})

const { data, pending, refresh } = await useFetch<Res<{ items: PageListItem[], meta: meta }>>('pages', {
  baseURL: api,
  method: 'GET',
  headers: { Authorization: `Bearer ${useCookie("accessToken").value}` },
  query: {
    Page: currentPage,
    PageSize: 10
  }
})

const goToEdit = (id: number, pageType: number) => {
  if (pageType === 0) {
    router.push(`/admin/Pages/simplePage/${id}`)
  }
  if (pageType === 1) {
    router.push(`/admin/Pages/EmployeePage/${id}`)
  }
  if (pageType === 2) {
    router.push(`/admin/Pages/departmentpage/${id}`)
  }
}

// 📌 Sahifa turiga qarab nom va rang qaytaruvchi funksiya
const getPageTypeInfo = (type: number) => {
  switch (type) {
    case 0:
      return { label: "Oddiy sahifa", color: "primary" as const }
    case 1:
      return { label: "Rahbariyat / Xodim", color: "secondary" as const }
    case 2:
      return { label: "Kafedra", color: "info" as const }
    default:
      return { label: "Noma'lum", color: "gray" as const }
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('uz-UZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Sahifani o'chirish qismi
const selectedPage = ref<number>(-1);
const isModalOpen = ref<boolean>(false);
const isSelectedNewsText = ref<string>('');

const deleteFunction = async (id: number) => {
  try {
    await useApi(`pages/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${useCookie("accessToken").value}` },
      baseURL: api
    });

    isModalOpen.value = false;

    toast.add({
      title: "Sahifa o'chirildi",
      description: "Sahifa muvaffaqiyatli o'chirildi.",
      color: "success"
    });

    selectedPage.value = -1;
    // Sahifani ro'yxatdan o'chirish
    await refresh();
  } catch (error) {
    console.error('Error deleting page:', error);
    toast.add({
      title: "Xatolik!",
      description: "O'chirishda xatolik yuz berdi.",
      color: "error"
    });
  }
}
</script>