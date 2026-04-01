<template>
    <div class="max-w-400 min-w-119.75   bg-white py-8 px-4 md:px-10 mx-auto min-h-screen flex flex-col">

        <div v-if="pending" class="text-gray-500 text-center py-20 flex-grow">
             Ma'lumotlar
        Yuklanmoqda...
        </div>
        <SimplePage v-else-if="data && data.data.pageType === 0" :data="data.data" />
        <EmployeePage v-else-if="data && data.data.pageType === 1" :title="data.data.title" :content="data.data.content" :createdAt="data.data.createdAt" />
        <DepartmentCard v-else-if="data && data.data.pageType === 2" :data="data.data" />


    </div>
</template>
<script lang="ts" setup>
import type { Res } from '~~/types/globalTypes';
import type { IPage } from '~~/types/mainPageGlobalTypes';

definePageMeta({
  layout: 'main',
});
const route = useRoute();
const router = useRouter();
const {locale, t} = useI18n();
const {ENV_BASE, api} = useEnv();

const {data, error, pending, refresh, } = useFetch<Res<IPage>>('/pages/' + route.params.id, {
    method: 'GET',
    watch: [locale],
    baseURL: api,
    headers: {
        get 'Accept-Language'() {
            return locale.value;
        }
    }
});


</script>