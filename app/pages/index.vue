<template>
<MainSlider />
<NewsComponent />
 <Announcements />
 <Statistics/>
 <UseFullSites/>

</template>
<script lang="ts" setup>
import type { Res } from '~~/types/globalTypes';
import type { SlideMainPage } from '../../types/mainPageGlobalTypes';

definePageMeta({
    layout: "main"
});

useSeoMeta({
  
})
const { data: mainPageData, pending: mainPagePending, error : errorMainPageSlide} = await useFetch<Res<SlideMainPage>>('slides', {
    method: 'GET',
    headers: { Authorization: `Bearer ${useCookie("accessToken").value}` },
    query: {
      Page: 1,
      PageSize: 500
    }
  });
</script>