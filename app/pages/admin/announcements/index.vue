<template>
  <div>
    <div class="mx-auto px-4 md:px-6 pt-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold">E'lonlar</h1>
    </div>

    <div class="w-full mx-auto p-4 md:p-6">
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        
        <div
          @click="router.push('/admin/announcements/create')"
          class="w-full bg-white border-2 border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col h-full cursor-pointer hover:border-secondary-400"
        >
          <div class="relative aspect-[16/10] bg-gray-50 flex items-center justify-center">
            <div class="flex flex-col items-center justify-center text-gray-400 group-hover:text-secondary-500 transition-colors">
              <div class="text-5xl font-bold mb-2">+</div>
              <div class="opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-sm font-medium">
                E'lon qo‘shish
              </div>
            </div>
          </div>

          <div class="p-5 flex flex-col flex-grow justify-center items-center text-center">
            <h3 class="text-lg font-semibold text-gray-700 group-hover:text-secondary-600 transition-colors">
              Yangi E'lon
            </h3>
            <p class="text-sm text-gray-500 mt-2">
              Yangi maqola yoki E'lon qo‘shish uchun bosing
            </p>
          </div>
        </div>
        
        <AnnouncementsCard 
          v-for="announcements in data?.data?.items" 
          :key="announcements.id" 
          :news="announcements" 
          @deleted="refresh()"
        />
        
      </div>

      <div class="flex justify-center lg:justify-end mt-10 mb-8" v-if="data?.data?.meta && data.data.meta.totalCount > 0">
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

    </div>
  </div>
</template>

<script lang="ts" setup>
import type { NewsItem, Res, meta } from '~~/types/globalTypes';

definePageMeta({
  layout: 'admin' 
});
useHead({
  title: "E'lonlar | Admin panel",
  meta: [
    {
      name: "description",
      content: "E'lonlar sahifasi",
    },
  ],
});

const route = useRoute();
const router = useRouter();
const { ENV_BASE, api } = useEnv();


const currentPage = ref<number>(Number(route.query.page) || 1);


const { data, pending, error, refresh } = useFetch<Res<{ items: NewsItem[], meta: meta }>>("announcements/full", {
  headers: { Authorization: `Bearer ${useCookie("accessToken").value}` },
  method: 'GET',
  baseURL: api,
  query: {
   
    page: currentPage, 
    PageSize: 10
  }
});

watch(currentPage, (newPage) => {
  
  router.replace({ query: { ...route.query, page: newPage } });
});
</script>