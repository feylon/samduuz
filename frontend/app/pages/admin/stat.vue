<template>
  <div class="p-6 max-w-7xl mx-auto space-y-8">
    
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Xush kelibsiz!</h1>
      <p class="text-gray-500 mt-2">Samarqand davlat universiteti boshqaruv panelining umumiy ko'rsatkichlari.</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="stat in stats"
        :key="stat.id"
        class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-5"
      >
        <div :class="['p-4 rounded-xl flex items-center justify-center', stat.bgClass, stat.textClass]">
          <UIcon :name="stat.icon" class="w-8 h-8" />
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500 mb-1">{{ stat.title }}</p>
          <h3 class="text-2xl font-black text-gray-900">{{ stat.value }}</h3>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-bold text-gray-900">Tezkor amallar</h2>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <NuxtLink
            v-for="action in quickActions"
            :key="action.to"
            :to="action.to"
            class="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-secondary-50 hover:border-secondary-200 transition-colors group"
          >
            <UIcon :name="action.icon" class="w-8 h-8 text-gray-400 group-hover:text-secondary-500 mb-3 transition-colors" />
            <span class="text-sm font-medium text-gray-700 group-hover:text-secondary-600">{{ action.title }}</span>
          </NuxtLink>
        </div>
      </div>

      <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-bold text-gray-900">Tizim ma'lumotlari</h2>
        </div>
        <div class="flex-1 flex flex-col justify-center space-y-6">
          <div class="flex items-center justify-between border-b border-gray-100 pb-4">
            <div class="flex items-center gap-3 text-gray-600">
              <UIcon name="i-heroicons-server" class="w-5 h-5 text-secondary-500" />
              <span class="font-medium">Server holati</span>
            </div>
            <UBadge color="success" variant="subtle">Faol</UBadge>
          </div>
          
          <div class="flex items-center justify-between border-b border-gray-100 pb-4">
            <div class="flex items-center gap-3 text-gray-600">
              <UIcon name="i-heroicons-clock" class="w-5 h-5 text-secondary-500" />
              <span class="font-medium">Tizim vaqti</span>
            </div>
            <span class="text-sm font-bold text-gray-900">{{ currentTime }}</span>
          </div>

          <div class="flex items-center justify-between border-b border-gray-100 pb-4">
            <div class="flex items-center gap-3 text-gray-600">
              <UIcon name="i-heroicons-shield-check" class="w-5 h-5 text-secondary-500" />
              <span class="font-medium">Xavfsizlik darajasi</span>
            </div>
            <span class="text-sm font-bold text-emerald-600">Yuqori</span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3 text-gray-600">
              <UIcon name="i-heroicons-user" class="w-5 h-5 text-secondary-500" />
              <span class="font-medium">Joriy foydalanuvchi</span>
            </div>
            <span class="text-sm font-bold text-gray-900">Admin</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

useHead({
  title: "Boshqaruv paneli"
})

const currentTime = ref('')

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

let timer: ReturnType<typeof setInterval>

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

const stats = [
  {
    id: 1,
    title: "Jami yangiliklar",
    value: "124",
    icon: "i-heroicons-newspaper",
    bgClass: "bg-blue-50",
    textClass: "text-blue-600"
  },
  {
    id: 2,
    title: "Faol slaydlar",
    value: "8",
    icon: "i-heroicons-photo",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-600"
  },
  {
    id: 3,
    title: "Sahifalar soni",
    value: "45",
    icon: "i-heroicons-document-duplicate",
    bgClass: "bg-purple-50",
    textClass: "text-purple-600"
  },
  {
    id: 4,
    title: "Yuklangan fayllar",
    value: "892",
    icon: "i-heroicons-folder",
    bgClass: "bg-orange-50",
    textClass: "text-orange-600"
  }
]

const quickActions = [
  {
    title: "Yangilik qo'shish",
    icon: "i-heroicons-pencil-square",
    to: "/admin/news/create"
  },
  {
    title: "Slayd yaratish",
    icon: "i-heroicons-presentation-chart-line",
    to: "/admin/slides/create"
  },
  {
    title: "Sahifa qo'shish",
    icon: "i-heroicons-document-plus",
    to: "/admin/pages"
  },
  {
    title: "Fayl yuklash",
    icon: "i-heroicons-cloud-arrow-up",
    to: "/admin/files"
  }
]
</script>