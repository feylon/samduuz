<template>
  <div v-if="pending" class="flex items-center justify-center min-h-screen">
    <Icon name="heroicons:arrow-path" class="w-8 h-8 animate-spin text-gray-500" />
    <span class="ml-2 text-gray-500">Yuklanmoqda...</span>
  </div>

  <div v-else class="p-6 mx-auto min-h-screen bg-gray-50 max-w-7xl">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Menyular boshqaruvi</h1>
      <UButton icon="i-heroicons-plus" color="primary" @click="handleAdd(null, null)">
        Asosiy menyu qo'shish
      </UButton>
    </div>

    <nav class="flex flex-wrap items-center gap-6 bg-white px-6 py-2 shadow-sm border border-gray-200 rounded-md">
      <div v-for="menu in data?.data" :key="menu.id" class="relative group">
        <div class="flex items-center gap-1">
          <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click="handleEdit(menu)" class="text-blue-500 hover:text-blue-700 p-1 rounded" title="Tahrirlash">
              <Icon name="heroicons:pencil-square" class="w-4 h-4" />
            </button>
            <button @click="handleDelete(menu)" class="text-red-500 hover:text-red-700 p-1 rounded" title="O'chirish">
              <Icon name="heroicons:trash" class="w-4 h-4" />
            </button>
          </div>

          <button class="flex items-center gap-1 px-2 py-3 text-gray-800 font-medium hover:text-blue-600 transition-colors">
            {{ menu.nameUz }}
            <Icon name="heroicons:chevron-down" class="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div class="absolute left-0 top-full min-w-[250px] bg-white shadow-xl border border-gray-100 opacity-0 invisible translate-y-3 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out z-40 rounded-b-md">
          <ul class="py-2">
            <li>
              <button @click="handleAdd(menu.id, menu.nameUz)" class="w-full flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors border-b border-gray-100 mb-1">
                <Icon name="heroicons:plus" class="w-4 h-4" />
                Yangi element qo'shish
              </button>
            </li>

            <li v-for="child in menu.children" :key="child.id" class="relative group/sub flex items-center justify-between px-2 hover:bg-gray-50 transition-colors">
              <div class="flex items-center w-full">
                <div class="flex gap-1 opacity-0 group-hover/sub:opacity-100 transition-opacity pl-2">
                  <button @click="handleEdit(child)" class="text-blue-500 hover:text-blue-700 p-1" title="Tahrirlash">
                    <Icon name="heroicons:pencil-square" class="w-3 h-3" />
                  </button>
                  <button @click="handleDelete(child)" class="text-red-500 hover:text-red-700 p-1" title="O'chirish">
                    <Icon name="heroicons:trash" class="w-3 h-3" />
                  </button>
                </div>
                <a href="#" class="flex-1 flex items-center justify-between py-2 pl-2 text-sm text-gray-700">
                  {{ child.nameUz }}
                  <Icon name="heroicons:chevron-right" class="w-4 h-4 text-gray-400 mr-2" />
                </a>
              </div>

              <div class="absolute left-full top-0 min-w-[250px] bg-white shadow-xl border border-gray-100 opacity-0 invisible -translate-x-3 group-hover/sub:opacity-100 group-hover/sub:visible group-hover/sub:translate-x-0 transition-all duration-300 ease-out z-50 rounded-md">
                <ul class="py-2">
                  <li>
                    <button @click="handleAdd(child.id, child.nameUz)" class="w-full flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors border-b border-gray-100 mb-1">
                      <Icon name="heroicons:plus" class="w-4 h-4" />
                      Yangi element qo'shish
                    </button>
                  </li>

                  <li v-for="subChild in child.children" :key="subChild.id" class="group/item flex items-center hover:bg-gray-50 px-2 transition-colors">
                    <div class="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity pl-2">
                      <button @click="handleEdit(subChild)" class="text-blue-500 hover:text-blue-700 p-1" title="Tahrirlash">
                        <Icon name="heroicons:pencil-square" class="w-3 h-3" />
                      </button>
                      <button @click="handleDelete(subChild)" class="text-red-500 hover:text-red-700 p-1" title="O'chirish">
                        <Icon name="heroicons:trash" class="w-3 h-3" />
                      </button>
                    </div>

                    <a href="#" class="block flex-1 py-2 pl-2 pr-5 text-sm text-gray-700">
                      {{ subChild.nameUz }}
                    </a>
                  </li>
                </ul>
              </div>

            </li>
          </ul>
        </div>
      </div>
    </nav>

    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-4 opacity-0"
    >
      <div v-if="isFormOpen" class="mt-8">
        <UCard :ui="{ ring: 'ring-1 ring-gray-200', divide: 'divide-y divide-gray-100', rounded: 'rounded-2xl', shadow: 'shadow-md' }">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold">{{ isEditMode ? 'Menyuni tahrirlash' : "Menyu qo'shish" }}</h2>
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeForm" />
            </div>
          </template>

          <div class="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <UFormField label="Tegishli sahifani biriktirish" name="relatedPageId">
              <USelectMenu
                v-model="formState.relatedPageId"
                :items="pageOptions"
                value-key="id"
                label-key="label"
                placeholder="Sahifani tanlang"
                class="w-full"
                :loading="pagesPending"
                icon="i-heroicons-link"
              />
            </UFormField>

            <UFormField label="Tashqi havola (Ixtiyoriy)" name="externalLink">
              <UInput color="secondary" v-model="formState.externalLink" class="w-full" placeholder="https://..." icon="i-heroicons-globe-alt" />
            </UFormField>

            <UFormField label="Ota menyu" name="parentName" v-if="parentNameDisplay">
              <UInput color="secondary" v-model="parentNameDisplay" class="w-full" disabled icon="i-heroicons-folder" />
            </UFormField>

            <UFormField label="Navbat (Priority)" name="priority">
              <UInput type="number" color="secondary" v-model.number="formState.priority" class="w-full" placeholder="1" icon="i-heroicons-bars-3-bottom-left" />
            </UFormField>
          </div>

          <UTabs color="secondary" :items="tabs" variant="link" :ui="{ trigger: 'grow' }" class="gap-4 w-full">
            <template #uz>
              <UForm :state="formState" class="flex flex-col gap-6 mt-4">
                <UFormField label="Menyu nomi (O'zbek)" name="nameUz">
                  <UInput ref="nameUzRef" color="secondary" v-model="formState.nameUz" class="w-full" placeholder="Menyu nomini kiriting" />
                </UFormField>
              </UForm>
            </template>

            <template #en>
              <UForm :state="formState" class="flex flex-col gap-6 mt-4">
                <UFormField label="Menyu nomi (Ingliz)" name="nameEn">
                  <UInput color="secondary" v-model="formState.nameEn" class="w-full" placeholder="Enter menu name" />
                </UFormField>
              </UForm>
            </template>

            <template #ru>
              <UForm :state="formState" class="flex flex-col gap-6 mt-4">
                <UFormField label="Menyu nomi (Rus)" name="nameRu">
                  <UInput color="secondary" v-model="formState.nameRu" class="w-full" placeholder="Введите название меню" />
                </UFormField>
              </UForm>
            </template>

            <template #kr>
              <UForm :state="formState" class="flex flex-col gap-6 mt-4">
                <UFormField label="Menyu nomi (Kiril)" name="nameKr">
                  <UInput color="secondary" v-model="formState.nameKr" class="w-full" placeholder="Меню номини киритинг" />
                </UFormField>
              </UForm>
            </template>
          </UTabs>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton label="Bekor qilish" color="gray" variant="soft" @click="closeForm" />
              <UButton @click="savedFunction" :label="isEditMode ? 'O\'zgarishlarni saqlash' : 'Menyuni saqlash'" color="secondary" icon="material-symbols:save" />
            </div>
          </template>
        </UCard>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, nextTick } from 'vue';
import type { TabsItem } from '@nuxt/ui';
import type { MenuItemDashboard, Res } from '~~/types/globalTypes';

definePageMeta({ layout: 'admin' });
useHead({ title: "Menyu sahifasi" });

const { api } = useEnv();
const toast = useToast();

const { data, refresh, pending } = useFetch<Res<MenuItemDashboard[]>>('/menus/full', {
  method: 'get',
  baseURL: api,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${useCookie("accessToken").value}`
  },
  onResponse({ response }) {
    if (response.status === 401) {
      navigateTo('/auth/login')
    }
  },
});

const isFormOpen = ref(false);
const isEditMode = ref(false);
const editItemId = ref<number | null>(null);
const nameUzRef = ref<any>(null);
const parentNameDisplay = ref<string | null>(null);

const formState = reactive({
  nameUz: "",
  nameRu: "",
  nameEn: "",
  nameKr: "",
  priority: 1,
  parentId: null as number | null,
  relatedPageId: null as number | null,
  externalLink: null as string | null
});

const tabs = [
  { label: "O'zbekcha", slot: 'uz' as const },
  { label: "Inglizcha", slot: 'en' as const },
  { label: "Ruscha", slot: 'ru' as const },
  { label: "Kirilcha", slot: 'kr' as const }
] satisfies TabsItem[];

const { data: pagesData, pending: pagesPending } = await useFetch<any>('pages', {
  baseURL: api,
  method: 'GET',
  headers: { Authorization: `Bearer ${useCookie("accessToken").value}` },
  query: {
    Page: 1,
    PageSize: 500
  }
});

const pageOptions = computed(() => {
  if (!pagesData.value?.data?.items) return [];
  return pagesData.value.data.items.map((page: any) => ({
    label: page.titleUz,
    id: page.id
  }));
});

const findParentName = (items: MenuItemDashboard[], parentId: number | null): string | null => {
  if (!parentId) return null;
  for (const item of items) {
    if (item.id === parentId) return item.nameUz;
    if (item.children && item.children.length > 0) {
      const found = findParentName(item.children, parentId);
      if (found) return found;
    }
  }
  return null;
};

const handleAdd = async (parentId: number | null, parentNameUz: string | null) => {
  isEditMode.value = false;
  editItemId.value = null;
  parentNameDisplay.value = parentNameUz;
  
  Object.assign(formState, {
    nameUz: "",
    nameRu: "",
    nameEn: "",
    nameKr: "",
    priority: 1,
    parentId: parentId,
    relatedPageId: null,
    externalLink: null
  });

  isFormOpen.value = true;
  await nextTick();
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
};

const handleEdit = async (item: any) => {
  isEditMode.value = true;
  editItemId.value = item.id;
  
  parentNameDisplay.value = item.parentId && data.value?.data 
    ? findParentName(data.value.data, item.parentId) 
    : null;

  Object.assign(formState, {
    nameUz: item.nameUz || "",
    nameRu: item.nameRu || "",
    nameEn: item.nameEn || "",
    nameKr: item.nameKr || "",
    priority: item.priority || 1,
    parentId: item.parentId,
    relatedPageId: item.relatedPageId || null,
    externalLink: item.externalLink || null
  });

  isFormOpen.value = true;
  await nextTick();
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
};

const closeForm = () => {
  isFormOpen.value = false;
};

const savedFunction = async () => {
  if (!formState.nameUz) {
    toast.add({
      color: "warning",
      title: "Diqqat!",
      description: "Iltimos, menyuning O'zbek tilidagi nomini kiriting."
    });
    if (nameUzRef.value) nameUzRef.value.inputRef?.focus();
    return;
  }

  try {
    const url = isEditMode.value ? `menus/${editItemId.value}` : 'menus';
    const method = isEditMode.value ? 'PUT' : 'POST';

    await useApi(url, {
      method: method,
      body: formState
    });

    toast.add({
      title: "Muvaffaqiyatli!",
      description: isEditMode.value ? "Menyu muvaffaqiyatli tahrirlandi." : "Menyu muvaffaqiyatli yaratildi.",
      color: "success"
    });

    refresh();
    closeForm();

  } catch (error) {
    toast.add({
      title: "Xatolik!",
      description: "Menyuni saqlashda xatolik yuz berdi.",
      color: "error"
    });
  }
};

const handleDelete = async (item: any) => {
  if (confirm(`"${item.nameUz}" elementini o'chirishni tasdiqlaysizmi?`)) {
    try {
      await useApi(`menus/${item.id}`, {
        method: 'DELETE'
      });
      toast.add({
        title: "O'chirildi",
        description: "Menyu muvaffaqiyatli o'chirildi",
        color: "success"
      });
      refresh();
    } catch (error) {
       toast.add({
        title: "Xatolik!",
        description: "Menyuni o'chirishda xatolik yuz berdi.",
        color: "error"
      });
    }
  }
};


watch(pagesData, (newValue)=>{
console.log(pagesData.value);
})
</script>