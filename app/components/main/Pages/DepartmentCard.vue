<template>
  <div class="w-full bg-white py-10 px-4 md:px-10 max-w-300 mx-auto">
    
    <div v-if="!data" class="text-center py-10 text-gray-500">
      Kafedra ma'lumotlari topilmadi...
    </div>

    <div v-else-if="parsedContent" class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      
      <div v-if="parsedContent.mainPicture" class="w-full h-64 md:h-96 relative bg-gray-100">
        <img 
          :src="getImageUrl(parsedContent.mainPicture)" 
          :alt="parsedContent.name || data.title"
          class="w-full h-full object-cover"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-10">
          <h2 class="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight drop-shadow-lg">
            {{ parsedContent.name || data.title }}
          </h2>
        </div>
      </div>
      
      <div v-else class="p-6 md:p-10 pb-0 md:pb-0">
        <h2 class="text-3xl md:text-5xl font-bold text-[#0c2a5a] mb-2 leading-tight">
          {{ parsedContent.name || data.title }}
        </h2>
      </div>

      <div class="p-6 md:p-10">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
            <h3 class="col-span-full text-lg font-bold text-[#0c2a5a] mb-2 border-b border-blue-100 pb-2">
              Aloqa ma'lumotlari
            </h3>
            
            <div class="flex items-start gap-3" v-if="parsedContent.address">
              <UIcon name="i-heroicons-map-pin" class="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p class="text-xs text-gray-500 uppercase font-medium">Manzil</p>
                <p class="text-gray-800 font-medium">{{ parsedContent.address }}</p>
              </div>
            </div>

            <div class="flex items-start gap-3" v-if="parsedContent.phone">
              <UIcon name="i-heroicons-phone" class="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p class="text-xs text-gray-500 uppercase font-medium">Telefon</p>
                <a :href="`tel:${parsedContent.phone}`" class="text-gray-800 font-medium hover:text-blue-600 transition-colors">
                  {{ parsedContent.phone }}
                </a>
              </div>
            </div>

            <div class="flex items-start gap-3" v-if="parsedContent.email">
              <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p class="text-xs text-gray-500 uppercase font-medium">Email</p>
                <a :href="`mailto:${parsedContent.email}`" class="text-gray-800 font-medium hover:text-blue-600 transition-colors">
                  {{ parsedContent.email }}
                </a>
              </div>
            </div>
            
            <div v-if="!parsedContent.address && !parsedContent.phone && !parsedContent.email" class="col-span-full text-sm text-gray-400">
              Aloqa ma'lumotlari kiritilmagan
            </div>
          </div>

          <div class="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col justify-center">
            <h3 class="text-lg font-bold text-gray-800 mb-4 text-center">Ijtimoiy tarmoqlar</h3>
            <div class="flex justify-center gap-4">
              
              <a v-if="parsedContent.facebook" :href="parsedContent.facebook" target="_blank" rel="noopener noreferrer" class="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow text-[#1877F2]">
                <UIcon name="i-mdi-facebook" class="w-6 h-6" />
              </a>
              
              <a v-if="parsedContent.telegram" :href="parsedContent.telegram" target="_blank" rel="noopener noreferrer" class="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow text-[#229ED9]">
                <UIcon name="i-mdi-telegram" class="w-6 h-6" />
              </a>
              
              <a v-if="parsedContent.linkedin" :href="parsedContent.linkedin" target="_blank" rel="noopener noreferrer" class="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow text-[#0A66C2]">
                <UIcon name="i-mdi-linkedin" class="w-6 h-6" />
              </a>

            </div>
            <p v-if="!parsedContent.facebook && !parsedContent.telegram && !parsedContent.linkedin" class="text-sm text-center text-gray-400">
              Tarmoqlar ulanmagan
            </p>
          </div>

        </div>

        <div v-if="parsedContent.content" class="mt-8">
          <h3 class="text-2xl font-bold text-[#0c2a5a] mb-6 border-b pb-4">
            Kafedra haqida
          </h3>
          <div 
            class="prose prose-blue max-w-none text-gray-700 leading-relaxed custom-html-content"
            v-html="parsedContent.content"
          ></div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

export interface BackendPageData {
  id: number;
  pageType: number;
  title: string;
  content: string; 
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentDetails {
  name: string;
  address: string;
  phone: string;
  email: string;
  facebook: string;
  telegram: string;
  linkedin: string;
  mainPicture: string;
  content: string; 
}

const props = defineProps<{
  data: BackendPageData | null;
}>();

const { ENV_BASE } = useEnv();


const parsedContent = computed<DepartmentDetails | null>(() => {
  if (!props.data?.content) return null;
  
  try {
    console.log("Kafedra contenti:", JSON.parse(props.data.content)); 
    return JSON.parse(props.data.content) as DepartmentDetails;
  } catch (error) {
    console.error("JSON parse qilishda xatolik:", error);
    return null; 
  }
});


const getImageUrl = (path?: string) => {
  if (!path) return ''; 
  const cleanBase = ENV_BASE.replace(/\/$/, '');
  const cleanPath = path.replace(/^\//, '');
  return `${cleanBase}/${cleanPath}`;
};
</script>

<style scoped>
.custom-html-content :deep(p) {
  margin-bottom: 1em;
}
.custom-html-content :deep(ul) {
  list-style-type: disc;
  margin-left: 1.5em;
  margin-bottom: 1em;
}
.custom-html-content :deep(ol) {
  list-style-type: decimal;
  margin-left: 1.5em;
  margin-bottom: 1em;
}
.custom-html-content :deep(strong) {
  font-weight: 600;
  color: #111827;
}
.custom-html-content :deep(a) {
  color: #2563eb;
  text-decoration: underline;
}
.custom-html-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
}
</style>