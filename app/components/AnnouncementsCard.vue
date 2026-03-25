<template>
    <div
        class="w-full bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group flex flex-col h-full">

        <div class="relative aspect-[16/10] overflow-hidden bg-gray-100 shrink-0 relative">
            <img v-if="news.mainImagePath" :src="ENV_BASE + news.mainImagePath" :alt="news.titleUz"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <UIcon name="i-heroicons-photo" class="w-12 h-12" />
            </div>

            <div
                class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            </div>

            <!-- Buttons -->
            <div class="flex absolute top-2 right-2 gap-2  group transition-opacity duration-300">
                <UButton variant="solid" color="secondary" :to="`/admin/announcements/editannouncements/${news.id}`">
                    <Icon name="i-heroicons-pencil-square-solid" class="w-5 h-5" />
                </UButton>
            <UButton @click="selectedNewsId = news.id; isDeleteModalOpen = true;console.log(`CLICK`)" class="cursor-pointer" variant="solid" color="error">
                <Icon name="i-heroicons-trash-solid" class="w-5 h-5" />
            </UButton>   
                </div>
            <!-- *Buttons -->

        </div>

        <div class="p-5 flex flex-col flex-grow">

            <h3
                class="text-xl font-bold text-gray-900 line-clamp-2 min-h-[3.5rem] mb-2 group-hover:text-secondary-500 transition-colors">
                {{ news.titleUz }}
            </h3>

            <p class="text-gray-600 text-sm line-clamp-3 mb-4" :title="news.descriptionUz ">
                {{ news.descriptionUz ? news.descriptionUz.length > 150 ? news.descriptionUz.substring(0, 150) + '...' : news.descriptionUz : 'Tavsif mavjud emas' }}
            </p>

            <div class="border-t border-gray-100 pt-4 mt-auto">
                <div class="flex items-center justify-between text-sm text-gray-500 mb-3">

                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-1.5 hover:text-red-500 transition-colors cursor-pointer">
                            <UIcon name="i-heroicons-heart" class="w-5 h-5" />
                            <span class="font-medium">{{ news.likes }}</span>
                        </div>

                        <div class="flex items-center gap-1.5 hover:text-secondary-500 transition-colors cursor-pointer">
                            <UIcon name="i-heroicons-eye" class="w-5 h-5" />
                            <span class="font-medium">{{ news.views }}</span>
                        </div>
                    </div>

                    <UButton @click="AnotherAnnouncements" variant="ghost" color="secondary" trailing-icon="i-heroicons-arrow-right-20-solid" size="xs"
                        class="px-0 hover:bg-transparent">
                        Batafsil
                    </UButton>
                </div>

                <div class="flex flex-col gap-1 text-xs text-gray-400 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-calendar-days" class="w-4 h-4 text-gray-400" />
                        <span>Yaratildi:</span>
                        <time :datetime="news.createdAt" class="font-medium text-gray-600">
                            {{ formatDate(news.createdAt) }}
                        </time>
                    </div>

                    <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-pencil-square" class="w-4 h-4 text-gray-400" />
                        <span>Yangilandi:</span>
                        <time :datetime="news.updatedAt" class="font-medium text-gray-600">
                            {{ formatDate(news.updatedAt) }}
                        </time>
                    </div>
                </div>
            </div>
        </div>
    </div>


     <!-- Delete Modal -->
  <UModal  :title="`Haqiqatan ham bu E'lonni o'chirmoqchimisiz?`"
  :description="`${news.descriptionUz ? news.descriptionUz.length > 100 ? news.descriptionUz.substring(0, 100) + '...' : news.descriptionUz : 'Tavsif mavjud emas'}`"
   v-model:open="isDeleteModalOpen">
    
    <template #body>
      <div class ="flex justify-end gap-4">
        <UButton color="neutral" variant="soft" @click="isDeleteModalOpen = false; selectedNewsId = -1;">Bekor qilish</UButton>
        <UButton color="error" variant="solid" @click="isDeleteModalOpen = false; deleteNewsFunction(selectedNewsId); selectedNewsId = -1;">O'chirish</UButton>
    </div>
    </template>
  </UModal>
  <!-- *Delete Modal -->
</template>

<script setup lang="ts">
import type { NewsItem } from '~~/types/globalTypes' 

const props = defineProps<{
    news: NewsItem
}>()
const emit = defineEmits<{
  (e: 'deleted', id: number): void
}>()

const router = useRouter();
const { ENV_BASE } = useEnv()

const formatDate = (dateString: string) => {
    if (!dateString) return 'No'

    const date = new Date(dateString)
    return date.toLocaleDateString('uz-UZ', {
        day: '2-digit',
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
};

const isDeleteModalOpen = ref<boolean>(false);

const selectedNewsId = ref<number>(-1);
const deleteNewsFunction = async (id: number) => {
  try {
    await useApi(`announcements/${id}`, {
      method: 'DELETE',
    });
    useToast().add({
        title: "E'lon o'chirildi",
        description: "E'lon muvaffaqiyatli o'chirildi.",
        color: "success"
        
    });
    emit('deleted', id);
  
  } catch (error) {
    console.error("E'lonni o'chirishda xatolik:", error);
  }
};


const AnotherAnnouncements = ()=>{
window.open(`/announcements/${props.news.id}`, '_blank');
}
</script>