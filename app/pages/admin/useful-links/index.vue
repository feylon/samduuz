<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Foydali havolalar</h1>
      <UButton icon="i-heroicons-plus" color="secondary" class="cursor-pointer" @click="$router.push('/admin/useful-links/create')">
        Yangi qo'shish
      </UButton>
    </div>

    <UCard>
      <div v-if="pending" class="flex justify-center p-8">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-500" />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rasm</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomi (UZ)</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Havola</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yaratilgan sana</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amallar</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
            <tr v-if="links.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-sm text-gray-500">
                Ma'lumot topilmadi
              </td>
            </tr>
            
            <tr v-for="row in links" :key="row.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ row.id }}
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="w-16 h-12 rounded overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img v-if="row.imagePath" :src="ENV_BASE + row.imagePath" class="w-full h-full object-cover" alt="Rasm" />
                  <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">Yo'q</div>
                </div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ row.nameUz }}
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-500 hover:underline">
                <a v-if="row.externalLink" :href="row.externalLink.startsWith('http') ? row.externalLink : `https://${row.externalLink}`" target="_blank">
                  {{ row.externalLink }}
                </a>
                <span v-else class="text-gray-500 no-underline">-</span>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ new Date(row.createdAt).toLocaleDateString('uz-UZ') }}
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex gap-2">
                  <UButton
                    icon="i-heroicons-pencil-square"
                    size="sm"
                    color="secondary"
                    variant="soft"
                    @click="$router.push(`/admin/useful-links/${row.id}`)"
                  />
                  <UButton
                    icon="i-heroicons-trash"
                    size="sm"
                    color="error"
                    variant="soft"
                    @click="openDeleteModal(row.id)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>

    <UModal 
      :title="`Haqiqatan ham bu havolani o'chirmoqchimisiz?`"
      :description="`Bu amalni ortga qaytarib bo'lmaydi.`"
      v-model:open="isDeleteModalOpen"
    >
      <template #body>
        <div class="flex justify-end gap-4">
          <UButton 
            color="neutral" 
            variant="soft" 
            @click="isDeleteModalOpen = false; selectedId = null;"
          >
            Bekor qilish
          </UButton>
          <UButton 
            color="error" 
            variant="solid" 
            :loading="isDeleting" 
            @click="deleteItem"
          >
            O'chirish
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'admin'
})
useHead({
  title: "Foydali havolalar",
})

const { ENV_BASE, api } = useEnv()
const toast = useToast()

const isDeleteModalOpen = ref(false)
const isDeleting = ref(false)
const selectedId = ref<number | null>(null)

const { data: fetchResult, pending, refresh } = await useFetch<any>('useful-links/full', {
  baseURL: api,
  method: 'GET',
  headers: { Authorization: `Bearer ${useCookie("accessToken").value}` }
})

const links = computed(() => {
  if (fetchResult.value && Array.isArray(fetchResult.value.data)) {
    return fetchResult.value.data;
  }
  return [];
})

const openDeleteModal = (id: number) => {
  selectedId.value = id
  isDeleteModalOpen.value = true
}

const deleteItem = async () => {
  if (!selectedId.value) return

  isDeleting.value = true
  try {
    await useApi(`useful-links/${selectedId.value}`, {
      method: 'DELETE'
    })

    toast.add({
      title: "Muvaffaqiyatli!",
      description: "Havola o'chirildi.",
      color: "success"
    })

    isDeleteModalOpen.value = false
    selectedId.value = null
    refresh()
  } catch (error) {
    toast.add({
      title: "Xatolik!",
      description: "O'chirishda xatolik yuz berdi.",
      color: "error"
    })
  } finally {
    isDeleting.value = false
  }
}
</script>