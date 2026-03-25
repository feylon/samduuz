<template>
  <div class="dark w-full bg-white/70 p-6  min-h- relative z-10 rounded-2xl px-10 md:px-20">

    <div v-if="mainPagePending" class="text-white text-center py-10">
      Ma'lumotlar yuklanmoqda...
    </div>

    <div v-else-if="errorMainPageSlide" class="text-red-500 text-center py-10">
      Xatolik yuz berdi: {{ errorMainPageSlide.message }}
    </div>

    <UCarousel v-else-if="mainPageData?.data?.items && mainPageData.data.items.length > 0" v-slot="{ item }"
      :items="mainPageData.data.items" :ui="{
        item: 'basis-full md:basis-[65%] lg:basis-[70%] pe-4 md:pe-8',
        container: 'flex items-start'
      }" :autoplay="{ delay: 4000 }" loop arrows
      :prev="{ class: '!bg-white !text-black hover:!bg-gray-100 dark:!bg-white dark:!text-black hidden md:block' }"
      :next="{ class: '!bg-white !text-black hover:!bg-gray-100 dark:!bg-white dark:!text-black hidden md:block' }"
      class="w-full">
      <div class="flex flex-col group w-full cursor-pointer h-full">

        <div class="relative w-full h-[220px] md:h-[300px] lg:h-[350px] rounded-2xl overflow-hidden mb-5 bg-gray-800">
          <img :src="`${ENV_BASE}${item.mainImagePath}`" :alt="getLocalizedField(item, 'title')"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
        </div>

        <div class="flex flex-col flex-grow px-1 md:px-2">
          <h3 class=" font-bold text-lg md:text-2xl mb-2 group-hover:text-[#4b6383] transition-colors line-clamp-1">
            {{ getLocalizedField(item, 'title') }}
          </h3>

          <div class="text-gray-500 text-sm md:text-base line-clamp-3 leading-relaxed">{{ item.description }}</div>
        </div>

      </div>
    </UCarousel>

    <div v-else class="text-gray-400 text-center py-10">
      Slaydlar topilmadi.
    </div>

  </div>
</template>

<script lang="ts" setup>
import type { Res } from '~~/types/globalTypes';
import type { SlideMainPage } from '../../../types/mainPageGlobalTypes';

export interface PaginatedData<T> {
  items: T[];
  meta: {
    totalCount: number;
    page: number;
    totalPages: number;
    pageSize: number;
  };
}

const { ENV_BASE, api } = useEnv();

const { locale } = useI18n();

const { data: mainPageData, pending: mainPagePending, error: errorMainPageSlide } = await useFetch<Res<PaginatedData<SlideMainPage>>>('slides', {
  method: 'GET',
  baseURL: api,
  watch: [locale],
  headers: {
    get 'Accept-Language'() {
      return locale.value;
    }
  },
  query: {
    Page: 1,
    PageSize: 500
  }
});

const getLocalizedField = (item: SlideMainPage, fieldType: 'title' | 'content'): string => {
  let currentLang = 'Uz';
  const langCode = locale.value?.toLowerCase();

  if (langCode === 'ru') {
    currentLang = 'Ru';
  } else if (langCode === 'en') {
    currentLang = 'En';
  } else if (langCode === 'uz-cyrl' || langCode === 'kr') {
    currentLang = 'Kr';
  }

  const objectKey = `${fieldType}${currentLang}`;
  const relatedPage = item.relatedPage as any;

  if (fieldType === 'title') {
    return (relatedPage && relatedPage[objectKey]) ? String(relatedPage[objectKey]) : item.title;
  }

  if (fieldType === 'content') {
    const content = (relatedPage && relatedPage[objectKey]) ? String(relatedPage[objectKey]) : item.description;
    if (!content) return '';

    try {
      const parsed = JSON.parse(content);
      return parsed.content || content;
    } catch (e) {
      return content;
    }
  }

  return '';
}
</script>