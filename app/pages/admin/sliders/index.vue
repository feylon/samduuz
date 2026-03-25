<template>
  <div class="p-6 mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Slaydlar ro'yxati</h1>
      <UButton
        color="primary"
        variant="solid"
        icon="i-heroicons-plus"
        @click="$router.push('/admin/sliders/create')"
      >
        Yangi slayd qo'shish
      </UButton>
    </div>

    <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <USkeleton v-for="i in 8" :key="i" class="h-[340px] w-full rounded-2xl" />
    </div>

    <div v-else-if="!data?.data?.items || data.data.items.length === 0" class="flex flex-col items-center justify-center py-20 opacity-50">
      <UIcon name="i-heroicons-photo" class="w-24 h-24 mb-4 text-gray-400" />
      <h2 class="text-xl font-medium text-gray-500">Slaydlar hozirda mavjud emas</h2>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      <div
        v-for="slide in data?.data?.items"
        :key="slide.id"
        class="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full"
      >
        <div class="relative h-40 w-full bg-gray-100 border-b border-gray-100 shrink-0">
          <img v-if="slide.mainImagePath" :src="ENV_BASE + slide.mainImagePath" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
            <UIcon name="i-heroicons-photo" class="w-10 h-10" />
          </div>
          <div class="absolute top-3 right-3">
            <UBadge 
              :color="slide.isActive ? 'success' : 'neutral'" 
              variant="solid" 
              size="sm"
            >
              {{ slide.isActive ? 'Faol' : 'Nofaol' }}
            </UBadge>
          </div>
        </div>

        <div class="p-5 flex flex-col flex-grow">
          <h3 class="text-lg font-bold text-gray-900 line-clamp-2 mb-4 flex-grow">
            {{ slide.titleUz }}
          </h3>

          <div class="flex flex-col gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100 mb-4">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-calendar-days" class="w-4 h-4 text-gray-400" />
              <span>Yaratildi:</span>
              <time class="font-medium text-gray-700">{{ formatDate(slide.createdAt) }}</time>
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-pencil-square" class="w-4 h-4 text-gray-400" />
              <span>Yangilandi:</span>
              <time class="font-medium text-gray-700">{{ formatDate(slide.updatedAt) }}</time>
            </div>
          </div>

          <div class="mt-auto flex gap-2">
            <UButton
              @click="$router.push(`/admin/sliders/${slide.id}`)"
              color="secondary"
              variant="soft"
              icon="i-heroicons-pencil-square-solid"
              class="flex-1 justify-center"
            >
              Tahrirlash
            </UButton>

            <UButton
              @click="selectedSlide = slide.id; isSelectedSlideText = slide.titleUz; isModalOpen = true;"
              color="error"
              variant="soft"
              icon="i-heroicons-trash-solid"
              class="flex-1 justify-center"
            >
              O'chirish
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center lg:justify-end mt-8" v-if="data?.data?.meta && data.data.meta.totalCount > 0">
      <UPagination
        v-model:page="currentPage"
        :total="data.data.meta.totalCount"
        :items-per-page="data.data.meta.pageSize"
        :sibling-count="1"
        show-edges
        color="secondary"
        active-color="secondary"
      />
    </div>

    <UModal v-model:open="isModalOpen" :title="``">
      <template #body>
        <div class="p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Slaydni o'chirish</h3>
          <p class="text-gray-500 mb-6">Haqiqatan ham bu slaydni o'chirmoqchimisiz?</p>
          <span class="block mb-6 font-medium text-gray-700 bg-gray-50 p-3 rounded-lg">
            {{ isSelectedSlideText ? (isSelectedSlideText.length > 100 ? isSelectedSlideText.substring(0, 100) + '...' : isSelectedSlideText) : 'Sarlavha mavjud emas' }}
          </span>
          <div class="flex justify-end gap-3">
            <UButton @click="isModalOpen = false" variant="soft" color="neutral">
              Bekor qilish
            </UButton>
            <UButton @click="deleteFunction(selectedSlide)" variant="solid" color="error">
              O'chirish
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import type { Res, meta, ISlide } from '~~/types/globalTypes'

definePageMeta({
  layout: 'admin' 
});
useHead({
  title: "Slaydlar ro'yxati"
})

const route = useRoute()
const router = useRouter()
const { api, ENV_BASE } = useEnv()
const toast = useToast()

const currentPage = computed({
  get: () => Number(route.query.page) || 1,
  set: (value) => {
    router.push({ query: { ...route.query, page: value } })
  }
})

const { data, pending, refresh } = await useFetch<Res<{ items: ISlide[], meta: meta }>>('slides/full', {
  baseURL: api,
  method: 'GET',
  headers: { Authorization: `Bearer ${useCookie("accessToken").value}` },
  query: {
    Page: currentPage,
    PageSize: 12
  }
})

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

const selectedSlide = ref<number>(-1)
const isModalOpen = ref<boolean>(false)
const isSelectedSlideText = ref<string>('')

const deleteFunction = async (id: number) => {
  try {
    await useApi(`slides/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${useCookie("accessToken").value}` },
      baseURL: api
    })
    
    isModalOpen.value = false
    
    toast.add({
      title: "Slayd o'chirildi",
      description: "Slayd muvaffaqiyatli o'chirildi.",
      color: "success"
    })
    
    selectedSlide.value = -1
    await refresh()
  } catch (error) {
    toast.add({
      title: "Xatolik!",
      description: "O'chirishda xatolik yuz berdi.",
      color: "error"
    })
  }
}
</script>