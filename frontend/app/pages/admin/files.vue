<template>
  <div class="">
    <span class="text-[20px] font-bold"> Fayllar </span>

    <div v-if="folderPending || filePending" class="flex gap-4 max-w-full flex-wrap mt-4">
      Yuklanmoqda
    </div>

    <div v-else class="flex">
      <div class="flex gap-4 max-w-full flex-wrap mt-4">
        <div v-if="path !== '/'" @click="goBackFunction" class="hover:bg-gray-200 duration-500 cursor-pointer rounded-md p-3 pb-1 flex flex-col" title="Orqaga qaytish">
          <Icon name="tabler:arrow-back-up" class="text-8xl text-gray-600" />
          <span class="text-center font-medium">Orqaga</span>
        </div>

        <div @click="fileUploadModal = true" class="hover:bg-blue-100 duration-500 cursor-pointer rounded-md p-3 pb-1 flex flex-col" title="Fayl yaratish">
          <Icon name="tabler:file-plus" class="text-8xl" />
          <span class="text-center">{{ "Fayl qo'shish" }}</span>
        </div>

        <div @click="folderCreaterModal = true" class="hover:bg-blue-100 duration-500 cursor-pointer rounded-md p-3 pb-1 flex flex-col" title="Papka yaratish">
          <Icon name="tabler:folder-plus" class="text-8xl" />
          <span class="text-center">{{ "Papka qo'shish" }}</span>
        </div>

        <UContextMenu
          v-for="(value, index) in folders?.data.folders"
          :key="`folder-${index}`"
          :items="getFolderContextMenuItems(value)"
        >
          <div @click="enterFolderFunction(value)" class="hover:bg-blue-100 duration-500 cursor-pointer rounded-md p-3 pb-1 flex flex-col" title="Papka">
            <Icon name="tabler:folder-filled" class="text-8xl" />
            <span class="text-center">{{ value }}</span>
          </div>
        </UContextMenu>

        <UContextMenu 
          v-for="(value, index) in files?.data" 
          :key="`file-${index}`" 
          :items="getContextMenuItems(value.name)"
        >
          <div :title="value.name" class="hover:bg-blue-100 relative duration-500 cursor-pointer rounded-md p-3 pb-1 flex flex-col">
            <img :src="`${ENV_BASE}${route.query.path ? route.query.path + '/' : ''}${value.name}`" class="w-32 h-32 mx-auto object-cover rounded-md" />
            <span class="text-center">{{ shortName(value.name) }}</span>
          </div>
        </UContextMenu>
      </div>
    </div>
  </div>

  <UModal v-model:open="fileUploadModal" title="Fayl yuklash" description="Faqat rasmli fayllar." @close="closeUploadModal">
    <template #body>
      <div class="flex flex-col gap-4">
        <UInput type="file" accept="image/*" @change="onFileSelected" />
        
        <div v-if="imageUrl" class="w-full max-h-[400px] overflow-hidden bg-gray-100 rounded-md border flex justify-center items-center">
          <img :src="imageUrl" alt="Tanlangan rasm" class="max-h-[400px] object-contain" />
        </div>

        <div class="flex mt-4 justify-end gap-3">
          <UButton @click="closeUploadModal" variant="soft" color="error">Bekor qilish</UButton>
          <UButton @click="uploadImage" :loading="isUploading" :disabled="!selectedFile" color="primary">Yuklash</UButton>
        </div>
      </div>
    </template>
  </UModal>

  <UModal v-model:open="folderCreaterModal" title="Papka yaratish" description="Yangi papka yaratish.">
    <template #body>
      <UInput v-model="newFolderName" placeholder="Papka nomi" size="lg" class="w-full" color="secondary" />
      <div class="flex mt-4 justify-end">
        <UButton @click="createFolderFunction" class="w-60" block size="md" color="secondary">Yaratish</UButton>
      </div>
    </template>
  </UModal>

  <UModal v-model:open="folderRenameModal" title="Papkani o'zgartirish">
    <template #body>
      <UInput v-model="folderNewName" placeholder="Yangi nom" size="lg" class="w-full" color="secondary" />
      <div class="flex mt-4 justify-end gap-3">
        <UButton @click="folderRenameModal = false" variant="soft" color="error">Bekor qilish</UButton>
        <UButton @click="renameFolderFunction" :loading="isRenamingFolder" color="primary">Saqlash</UButton>
      </div>
    </template>
  </UModal>

  <UModal v-model:open="folderDeleteModal" title="Papkani o'chirish">
    <template #body>
      <div class="py-4">
        <p>O'chirilayotgan papka: <span class="font-bold">{{ folderToDelete }}</span></p>
      </div>
      <div class="flex mt-4 justify-end gap-3">
        <UButton @click="folderDeleteModal = false" variant="soft" color="error">Bekor qilish</UButton>
        <UButton @click="deleteFolderFunction" :loading="isDeletingFolder" color="error">O'chirish</UButton>
      </div>
    </template>
  </UModal>

  <UModal v-model:open="fileDeleteModal" title="Faylni o'chirish" description="Haqiqatan ham bu faylni o'chirmoqchimisiz?">
    <template #body>
      <div class="py-4">
        <p>O'chirilayotgan fayl: <span class="font-bold">{{ fileToDelete }}</span></p>
      </div>
      <div class="flex mt-4 justify-end gap-3">
        <UButton @click="fileDeleteModal = false" variant="soft" color="error">Bekor qilish</UButton>
        <UButton @click="deleteFileFunction" :loading="isDeleting" color="error">O'chirish</UButton>
      </div>
    </template>
  </UModal>

</template>

<script lang="ts" setup>
import type { IFile, IFolder, Res } from '~~/types/globalTypes';
import type { ContextMenuItem } from '@nuxt/ui';

definePageMeta({
  layout: 'admin' 
});

useHead({
  title: "Fayllar",
  meta: [
    {
      name: "description",
      content: "Fayllar sahifasi"
    }
  ]
});


const { api, ENV_BASE } = useEnv();
const fileUploadModal = ref<boolean>(false);
const route = useRoute();
const router = useRouter();

const path = computed<string>(() => (route.query.path as string) || '/');

const { data: files, pending: filePending, refresh: fileRefresh } = useFetch<Res<IFile[]>>(`${api}files`, {
  method: "GET",
  query: { Path: path },
  watch: [path],
  headers: { Authorization: `Bearer ${useCookie("accessToken").value}` },
});

const { data: folders, pending: folderPending, refresh: folderRefresh } = useFetch<Res<IFolder>>(`${api}folders`, {
  method: "GET",
  query: { Path: path },
  watch: [path],
  headers: { Authorization: `Bearer ${useCookie("accessToken").value}` },
});

function shortName(Filename: string) {
  const name = Filename;
  if (!name) return '';

  const extIndex = name.lastIndexOf('.');
  const extension = name.slice(extIndex);
  const start = name.slice(0, 12);

  return name.length > 25 ? start + '...' + extension : name;
}

const selectedFile = ref<File | null>(null);
const imageUrl = ref<string>('');
const isUploading = ref<boolean>(false);

const onFileSelected = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert("Iltimos, faqat rasm faylini (JPG, PNG, WEBP va h.k.) tanlang!");
    input.value = '';
    selectedFile.value = null;
    imageUrl.value = '';
    return;
  }

  selectedFile.value = file;

  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value);
  }
  imageUrl.value = URL.createObjectURL(file);
};

const uploadImage = async () => {
  if (!selectedFile.value) return;
  isUploading.value = true;

  const formData = new FormData();
  formData.append('File', selectedFile.value, selectedFile.value.name);
  formData.append('Path', path.value === '/' ? '/' : path.value);

  try {
    await useApi('files', {
      method: 'POST',
      body: formData,
    });
    fileRefresh();
    closeUploadModal();
  } catch (error) {
    console.error(error);
  } finally {
    isUploading.value = false;
  }
};

const closeUploadModal = () => {
  fileUploadModal.value = false;
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value);
  }
  imageUrl.value = '';
  selectedFile.value = null;
  isUploading.value = false;
};

const newFolderName = ref<string>('');
const folderCreaterModal = ref<boolean>(false);

const createFolderFunction = async () => {
  try {
    await useApi<any>('folders', {
      method: "POST",
      body: {
        folderName: newFolderName.value,
        path: path.value,
      },
    });
    fileRefresh();
    folderRefresh();
    newFolderName.value = '';
    folderCreaterModal.value = false;
  } catch (error) {
    console.log(error);
  }
};

const enterFolderFunction = (folderName: string) => {
  const currentPath = path.value === '/' ? '' : path.value;
  const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
  router.push({ query: { path: newPath } });
};

const goBackFunction = () => {
  if (path.value === '/') return;
  const segments = path.value.split('/');
  segments.pop();
  const newPath = segments.join('/');
  router.push({ query: { path: newPath || undefined } });
};

const folderRenameModal = ref(false);
const folderDeleteModal = ref(false);
const folderToRename = ref<string>('');
const folderNewName = ref<string>('');
const folderToDelete = ref<string>('');
const isRenamingFolder = ref(false);
const isDeletingFolder = ref(false);

const getFolderContextMenuItems = (folderName: string): ContextMenuItem[] => [
  {
    label: 'Ochish',
    icon: 'i-lucide-folder-open',
    onSelect: () => enterFolderFunction(folderName)
  },
  {
    label: 'O`zgartirish',
    icon: 'i-lucide-edit',
    onSelect: () => {
      folderToRename.value = folderName;
      folderNewName.value = folderName;
      folderRenameModal.value = true;
    }
  },
  {
    type: 'separator'
  },
  {
    label: 'O`chirish',
    color: 'error',
    icon: 'i-lucide-trash',
    onSelect: () => {
      folderToDelete.value = folderName;
      folderDeleteModal.value = true;
    }
  }
];

const renameFolderFunction = async () => {
  if (!folderNewName.value || folderNewName.value === folderToRename.value) return;
  isRenamingFolder.value = true;

  try {
    await useApi('folders', {
      method: 'PUT',
      body: {
        path: path.value === '/' ? '/' : path.value,
        oldName: folderToRename.value,
        newName: folderNewName.value
      }
    });
    folderRenameModal.value = false;
    folderRefresh();
  } catch (error) {
    console.error(error);
  } finally {
    isRenamingFolder.value = false;
  }
};

const deleteFolderFunction = async () => {
  if (!folderToDelete.value) return;
  isDeletingFolder.value = true;

  const currentPath = path.value === '/' ? '' : path.value;
  const fullPathToDelete = currentPath ? `${currentPath}/${folderToDelete.value}` : folderToDelete.value;

  try {
    await useApi('folders', {
      method: 'DELETE',
      body: {
        path: fullPathToDelete
      }
    });
    folderDeleteModal.value = false;
    folderToDelete.value = '';
    folderRefresh();
  } catch (error) {
    console.error(error);
  } finally {
    isDeletingFolder.value = false;
  }
};

const fileDeleteModal = ref(false);
const fileToDelete = ref<string>('');
const isDeleting = ref(false);

const getContextMenuItems = (fileName: string): ContextMenuItem[] => [
  {
    label: 'Ko`rish',
    icon: 'i-lucide-eye',
    onSelect: () => {
      window.open(`${ENV_BASE}${route.query.path ? route.query.path + '/' : ''}${fileName}`, '_blank');
    }
  },
  {
    type: 'separator'
  },
  {
    label: 'O`chirish',
    color: 'error',
    icon: 'i-lucide-trash',
    onSelect: () => {
      fileToDelete.value = fileName;
      fileDeleteModal.value = true;
    }
  }
];

const deleteFileFunction = async () => {
  if (!fileToDelete.value) return;
  isDeleting.value = true;

  const currentPath = path.value === '/' ? '' : path.value;
  const fullPathToDelete = currentPath ? `${currentPath}/${fileToDelete.value}` : fileToDelete.value;

  try {
    await useApi('files', {
      method: 'DELETE',
      body: {
        path: fullPathToDelete
      }
    });
    
    fileDeleteModal.value = false;
    fileToDelete.value = '';
    fileRefresh();
  } catch (error) {
    console.error(error);
  } finally {
    isDeleting.value = false;
  }
};
</script>