<template>
  <span class="text-[20px] font-bold"> Slidelar </span>

  <div class="flex gap-4 flex-wrap">
    <div 
      class="min-w-[200px] max-w-[200px] flex flex-col justify-center items-start" 
      @click="$router.push('/admin/slides/create')"
    >
      <div class="w-60 h-36 bg-gray-200 rounded-lg flex-col gap-4 mb-2 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
        <Icon class="text-[40px]" name="tabler:camera-plus" />
        <span>Yangi slide qo'shish</span>
      </div>
    </div>

    <UContextMenu 
      v-for="i in data?.data.items" 
      :key="i.id" 
      :items="menuItems(i)"
    >
      <div class="min-w-[200px] max-w-[200px] flex flex-col justify-center items-start cursor-pointer">
        <img 
          :src="`${ENV_BASE}${i.mainImagePath}`" 
          class="w-60 h-36 object-cover rounded-lg mb-2" 
          alt="Image"
        >
        <span class="w-full block text-center max-w-[80%] bg-red-700 text-[10px] truncate text-white rounded px-1">{{ i.titleUz }}</span>
        <span class="flex item-center gap-1 text-[12px] text-gray-500 items-center mt-1">
          <Icon class="text-[13px]" name="tabler:calendar-event-filled"/>
          {{ new Date(i.createdAt).toLocaleString('uz-UZ', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }) }}
        </span>
      </div>
    </UContextMenu>
  </div>
</template>

<script lang="ts" setup>
import type { ISlide, meta, Res } from '~~/types/globalTypes';
import type { ContextMenuItem } from '@nuxt/ui';
definePageMeta({
  layout: 'admin' 
});
interface IResponse {
  items: ISlide[],
  meta: meta
}

const router = useRouter();
const { api, ENV_BASE } = useEnv();

const { data, refresh, error, pending, status } = useFetch<Res<IResponse>>(`${api}slides/full`, {
  method: "GET",
  headers: { Authorization: `Bearer ${useCookie("accessToken").value}` },
  onResponseError({ response }) {
    if (response.status === 401) {
      useCookie("accessToken").value = null;
      navigateTo("/auth/login");
    }
  },
});

const menuItems = (slide: ISlide): ContextMenuItem[][] => [
  [
    {
      label: 'View (Full)',
      icon: 'i-lucide-eye',
      onSelect: () => {
        router.push(`/admin/slides/${slide.id}`);
      }
    },
    {
      label: 'Edit',
      icon: 'i-lucide-pencil',
      onSelect: () => {
        router.push(`/admin/slides/edit/${slide.id}`);
      }
    }
  ],
  [
    {
      label: 'Delete',
      color: 'error' as const,
      icon: 'i-lucide-trash',
      onSelect: () => {
        deleteSlide(slide.id);
      }
    }
  ]
];

async function deleteSlide(id: number | string) {
  await $fetch(`${api}slides/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${useCookie("accessToken").value}` },
  });
  refresh();
}

function shortName(Filename: string) {
  const name = Filename;
  if (!name) return '';

  const extIndex = name.lastIndexOf('.');
  const extension = name.slice(extIndex);
  const start = name.slice(0, 42);

  return name.length > 45 ? start + '...' + extension : name;
}
</script>