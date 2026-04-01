<template>
  <div class="min-h-screen bg-gray-50 flex">

    <aside class="hidden lg:flex flex-col w-64 fixed inset-y-0 bg-white border-r border-gray-200 z-20 shadow-sm">
      
      <NuxtLink to="'/admin/stat" class="flex flex-col items-center py-6 border-b border-gray-200">
        <div class="mb-3">
            <img src="/pics/logo.png" class="w-20 h-20 object-contain" alt="SamDU Logo">
        </div>
        <h1 class="text-center font-bold text-gray-800 text-sm px-2 leading-tight">
            Sharof Rashidov nomidagi <br>
            <span class="text-secondary-500">Samarqand davlat universiteti</span>
        </h1>
        <p class="text-gray-500 text-xs mt-1.5 font-medium">Boshqaruv paneli</p>
      </NuxtLink>

      <nav class="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200',
            isActive(link.to)
              ? 'bg-secondary-50 text-secondary-500'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          ]"
        >
          <UIcon
            :name="link.icon"
            class="w-5 h-5"
            :class="isActive(link.to) ? 'text-secondary-500' : 'text-gray-400'"
          />
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="p-4 border-t">
        <UButton @click="logOut()" block icon="i-heroicons-arrow-right-on-rectangle" color="error" variant="ghost">
          Tizimdan chiqish
        </UButton>
      </div>
    </aside>

    <header class="lg:hidden fixed top-0 w-full h-16 bg-white border-b z-30 flex items-center justify-between px-4 shadow-sm">
      <div class="flex items-center gap-2">
        <img src="/pics/logo.png" class="w-8 h-8 object-contain" alt="SamDU Logo">
        <h1 class="text-[15px] font-black text-gray-800 leading-tight">SamDU <span class="text-secondary-500">Admin</span></h1>
      </div>

      <UButton
        icon="i-heroicons-bars-3"
        color="gray"
        variant="ghost"
        @click="openMenu"
      />
    </header>

    <Transition name="fade">
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
        @click="closeMenu"
      />
    </Transition>

    <Transition name="slide">
      <aside
        v-if="isMobileMenuOpen"
        class="fixed inset-y-0 left-0 w-72 bg-white z-40 shadow-xl flex flex-col lg:hidden"
      >
        <div class="relative flex flex-col items-center py-6 border-b border-gray-200">
          <UButton icon="i-heroicons-x-mark" variant="ghost" class="absolute top-2 right-2" @click="closeMenu" />
          <div class="mb-3">
              <img src="/pics/logo.png" class="w-20 h-20 object-contain" alt="SamDU Logo">
          </div>
          <h1 class="text-center font-bold text-gray-800 text-sm px-2 leading-tight">
              Sharof Rashidov nomidagi <br>
              <span class="text-secondary-500">Samarqand davlat universiteti</span>
          </h1>
          <p class="text-gray-500 text-xs mt-1.5 font-medium">Boshqaruv paneli</p>
        </div>

        <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            @click="closeMenu"
            :class="[
              'flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all duration-200',
              isActive(link.to)
                ? 'bg-secondary-50 text-secondary-500'
                : 'text-gray-600 hover:bg-gray-100'
            ]"
          >
            <UIcon
              :name="link.icon"
              class="w-5 h-5"
              :class="isActive(link.to) ? 'text-secondary-500' : 'text-gray-400'"
            />
            {{ link.label }}
          </NuxtLink>
        </nav>

        <div class="p-4 border-t">
          <UButton @click="logOut()" block icon="i-heroicons-arrow-right-on-rectangle" color="gray" variant="ghost">
            Chiqish
          </UButton>
        </div>
      </aside>
    </Transition>

    <main class="flex-1 lg:ml-64 pt-16 lg:pt-0 min-w-0">
      <slot />
    </main>

  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const isMobileMenuOpen = ref(false)
const router = useRouter();

const openMenu = () => {
  isMobileMenuOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeMenu = () => {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const links = [
  { label: "Dashboard", icon: "i-heroicons-home", to: "/admin/stat" },
  { label: "Yangiliklar", icon: "i-heroicons-newspaper", to: "/admin/news" },
  { label: "E'lonlar", icon: "i-heroicons-megaphone", to: "/admin/announcements" },
  { label: "Sahifalar", icon: "i-heroicons-document-duplicate", to: "/admin/pages" },
  { label: "Slaydlar", icon: "i-heroicons-photo", to: "/admin/sliders" },
  { label: "Fayllar", icon: "i-heroicons-folder", to: "/admin/files" },
  { label: "Menyu", icon: "i-heroicons-bars-3", to: "/admin/menu" },
  { label: "Foydali havolalar", icon: "i-heroicons-link", to: "/admin/useful-links" }

];

const logOut = ()=>{
  router.push('/auth/login');
  useCookie("accessToken").value = null;
  useCookie("refreshToken").value = null;
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active {
  transition: transform 0.25s ease;
}
.slide-leave-active {
  transition: transform 0.2s ease;
}
.slide-enter-from {
  transform: translateX(-100%);
}
.slide-leave-to {
  transform: translateX(-100%);
}
</style>