<template>
  <div class="min-h-screen mainSectionBody flex flex-col w-full overflow-x-hidden">
    
    <header class="sticky top-0  z-50">
      <div class="w-full shadow-2xl flex bg-[#f0f4f6]  justify-center h-8 ">
        <div class="flex max-w-[1300px]  justify-between w-full mx-auto items-center gap-4 text-sm px-4">
          <div class="flex items-center gap-6">
            <a href="mailto:devonxona@samdu.uz" class="hidden md:flex items-center gap-1 text-gray-600">
              <Icon name="i-heroicons-envelope" class="size-4" />
              devonxona@samdu.uz
            </a>
            <a href="tel:+998662403847" class="flex items-center gap-1 text-gray-600">
              <Icon name="tabler:phone" class="size-4" />
              +998 66 240 38 47
            </a>
          </div>

          <div class="flex items-center gap-4 text-[16px]">
            <a href="https://www.facebook.com/samdu.uz" target="_blank" class="text-gray-600 hover:text-blue-600 transition-colors">
                <Icon name="tabler:brand-facebook" class="size-5" />
            </a>
            <a href="https://www.instagram.com/samdu.uz/" target="_blank" class="text-gray-600 hover:text-pink-500 transition-colors">
                <Icon name="tabler:brand-instagram" class="size-5" />
            </a>
            <a href="https://t.me/samdu_uz" target="_blank" class="text-gray-600 hover:text-blue-400 transition-colors">
                <Icon name="tabler:brand-telegram" class="size-5" />
            </a>
            <a href="https://t.me/samdu_uz" target="_blank" class="text-gray-600 hover:text-red-400 transition-colors">
                <Icon name="tabler:brand-youtube" class="size-5" />
            </a>
          </div>
        </div>
      </div>
      
      <div class="w-full shadow bg-white sticky top-0  relative z-40">
        <div class="max-w-[1300px] mx-auto items-center flex justify-between h-20 px-4">
          
          <NuxtLink to="/" class="items-center flex gap-2">
            <img src="/pics/logo.png" alt="Logo" class="w-16 h-16 object-contain" />
            <span class="text-[15px]" v-html="$t('samdu_title')"></span>
          </NuxtLink>

          <div class="hidden md:flex items-center gap-6 text-[15px] font-medium text-gray-800 h-full">
            <div v-if="pending" class="text-sm text-gray-500 animate-pulse">Yuklanmoqda...</div>
            
            <template v-else-if="data?.data">
              <div 
                v-for="menu in data.data" :key="menu.id" 
                class="group h-full flex items-center relative cursor-pointer"
              >
                <div 
                  class="flex items-center gap-1 hover:text-blue-700 transition-colors"
                  @click="!menu.children?.length && handleMenuClick(menu)"
                >
                  {{ menu.name }}
                  <Icon 
                    v-if="menu.children?.length" 
                    name="tabler:chevron-down" 
                    class="size-4 text-gray-500 group-hover:text-blue-700 transition-transform duration-300 group-hover:-rotate-180" 
                  />
                </div>

                <div 
                  v-if="menu.children && menu.children.length > 0"
                  class="absolute top-20 left-0 min-w-[240px] bg-white shadow-lg border-t-2 border-blue-800 opacity-0 invisible translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 flex flex-col py-2"
                >
                  <div 
                    v-for="child in menu.children" :key="child.id"
                    class="relative group/sub w-full cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div 
                      class="px-4 py-2.5 flex justify-between items-center text-gray-700"
                      @click="!child.children?.length && handleMenuClick(child)"
                    >
                      <span>{{ child.name }}</span>
                      <Icon 
                        v-if="child.children?.length" 
                        name="tabler:chevron-right" 
                        class="size-4 text-gray-400 group-hover/sub:translate-x-1 transition-transform duration-200" 
                      />
                    </div>

                    <div 
                      v-if="child.children && child.children.length > 0"
                      class="absolute top-0 left-full min-w-[250px] bg-white shadow-lg border-l border-gray-100 opacity-0 invisible -translate-x-2 group-hover/sub:translate-x-0 group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-300 z-50 flex flex-col py-2"
                    >
                      <div 
                        v-for="subChild in child.children" :key="subChild.id"
                        class="px-4 py-2.5 text-gray-700 hover:bg-gray-100 hover:text-blue-700 transition-colors"
                        @click="handleMenuClick(subChild)"
                      >
                        {{ subChild.name }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <div class="flex items-center gap-3">
            <LangSwitch/>
            <Icon 
              name="tabler:menu-2" 
              class="size-6 cursor-pointer md:hidden"
              @click="isMenuOpen = true"
            />
          </div>
        </div>
      </div>
    </header>

    <slot></slot>
  </div>

  <div class="relative z-50">
    <div 
      v-if="isMenuOpen"
      class="fixed inset-0 bg-black/50 transition-opacity md:hidden"
      @click="isMenuOpen = false"
    ></div>

    <div 
      class="fixed top-0 left-0 z-50 h-screen w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col"
      :class="isMenuOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex items-center justify-between p-4 border-b">
        <span class="font-bold text-lg">Menyu</span>
        <Icon 
          name="tabler:x" 
          class="size-6 cursor-pointer hover:text-red-600 transition-colors"
          @click="isMenuOpen = false"
        />
      </div>

      <div class="flex flex-col flex-1 p-4 gap-2 overflow-y-auto pb-20">
        <div v-if="pending" class="text-gray-500 text-sm animate-pulse">
          Yuklanmoqda...
        </div>
        
        <template v-else-if="data?.data">
          <template v-for="menu in data.data" :key="menu.id">
            
            <UAccordion 
              :key="locale"
              v-if="menu.children && menu.children.length > 0" 
              :items="[{ label: menu.name, value: String(menu.id), raw: menu }]"
              :ui="{ trigger: 'py-2 font-medium text-gray-800 hover:text-blue-600 transition-colors border-b border-gray-100' }"
            >
              <template #body="{ item }">
                <div class="pl-4 flex flex-col gap-1 border-l border-gray-100 ml-2 mt-1">
                  
                  <template v-for="child in item.raw.children" :key="child.id">
                    
                    <UAccordion type="single"
                      v-if="child.children && child.children.length > 0" 
                      :items="[{ label: child.name, value: String(child.id), raw: child }]"
                      :ui="{ trigger: 'py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors' }"
                    >
                      <template #body="{ item: subItem }">
                        <div class="pl-4 flex flex-col gap-1 border-l border-gray-100 ml-2 mt-1 mb-2">
                          
                          <template v-for="subChild in subItem.raw.children" :key="subChild.id">
                            <button 
                              @click="handleMenuClick(subChild)" 
                              class="text-left text-[13px] text-gray-500 hover:text-blue-600 py-1"
                            >
                              - {{ subChild.name }}
                            </button>
                          </template>

                        </div>
                      </template>
                    </UAccordion>

                    <button 
                      v-else 
                      @click="handleMenuClick(child)" 
                      class="text-left text-sm text-gray-600 hover:text-blue-600 py-1.5"
                    >
                      {{ child.name }}
                    </button>

                  </template>

                </div>
              </template>
            </UAccordion>

            <button 
              v-else 
              @click="handleMenuClick(menu)" 
              class="text-left font-medium text-gray-800 hover:text-blue-600 py-2 border-b border-gray-100"
            >
              {{ menu.name }}
            </button>

          </template>
        </template>
      </div>

    </div>

  
  
  
  
   <footer class="relative bg-[#001d3f] text-white w-full pt-12 pb-6 mt-auto ">
    <div class="absolute inset-0 z-0 opacity-3">
      <img :src="`/pics/background.png`" class="w-full h-full object-cover" alt="" />
    </div>

    <div class="relative z-10 max-w-[1300px] mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <div class="flex flex-col items-center lg:items-start lg:flex gap-4">
          <img src="/pics/logo.png" alt="SamDU Logo" class="w-32 h-32 object-contain" />
          <h2 class="text-lg font-bold text-center lg:text-left leading-snug">
            {{ $t('samdu_line1') }} <br />
            {{ $t('samdu_line2') }}
          </h2>
        </div>

        <div class="flex flex-col gap-5">
          <h3 class="text-xl font-semibold">{{ $t('social_networks') }}</h3>
          <ul class="flex flex-col gap-4">
            <li>
              <a href="https://t.me/samdu_uz" target="_blank" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#1a4484]">
                  <Icon name="tabler:brand-telegram" class="size-5" />
                </span>
                <span class="font-medium">Telegram</span>
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/" target="_blank" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#1a4484]">
                  <Icon name="tabler:brand-youtube" class="size-5" />
                </span>
                <span class="font-medium">Youtube</span>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/samdu.uz/" target="_blank" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#1a4484]">
                  <Icon name="tabler:brand-instagram" class="size-5" />
                </span>
                <span class="font-medium">Instagram</span>
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/samdu.uz" target="_blank" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <span class="flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#1a4484]">
                  <Icon name="tabler:brand-facebook" class="size-5" />
                </span>
                <span class="font-medium">Facebook</span>
              </a>
            </li>
          </ul>
        </div>

        <div class="flex flex-col gap-5">
          <h3 class="text-xl font-semibold">{{ $t('our_address') }}</h3>
          <ul class="flex flex-col gap-4">
            <li class="flex items-start gap-3">
              <span class="flex flex-shrink-0 items-center justify-center w-8 h-8 rounded-full bg-white text-[#1a4484]">
                <Icon name="tabler:map-pin" class="size-5" />
              </span>
              <span class="font-medium pt-1">{{ $t('address_text') }}</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="flex flex-shrink-0 items-center justify-center w-8 h-8 rounded-full bg-white text-[#1a4484]">
                <Icon name="tabler:phone" class="size-5" />
              </span>
              <span class="font-medium pt-1">{{ $t('helpline') }} +998 66 240 38 40</span>
            </li>
            <li class="flex items-center gap-3">
              <span class="flex flex-shrink-0 items-center justify-center w-8 h-8 rounded-full bg-white text-[#1a4484]">
                <Icon name="tabler:phone" class="size-5" />
              </span>
              <span class="font-medium">+998 66 239 17 00</span>
            </li>
            <li class="flex items-center gap-3">
              <span class="flex flex-shrink-0 items-center justify-center w-8 h-8 rounded-full bg-white text-[#1a4484]">
                <Icon name="tabler:phone" class="size-5" />
              </span>
              <span class="font-medium">+998 66 240 38 47</span>
            </li>
            <li class="flex items-center gap-3">
              <span class="flex flex-shrink-0 items-center justify-center w-8 h-8 rounded-full bg-white text-[#1a4484]">
                <Icon name="tabler:phone" class="size-5" />
              </span>
              <span class="font-medium">+998 66 239 10 83</span>
            </li>
            <li class="flex items-center gap-3">
              <span class="flex flex-shrink-0 items-center justify-center w-8 h-8 rounded-full bg-white text-[#1a4484]">
                <Icon name="tabler:mail" class="size-5" />
              </span>
              <span class="font-medium">devonxona@samdu.uz</span>
            </li>
          </ul>
        </div>

        <div class="flex flex-col gap-5">
          <h3 class="text-xl font-semibold">{{ $t('map') }}</h3>
          <div class="w-full h-[250px] rounded overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3072.046395353046!2d61.958221815339235!3d39.64868207946142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f4c97eb6b5fb4e3%3A0x6b1db9eb52fcb026!2sSamarkand%20State%20University!5e0!3m2!1sen!2s!4v1680123456789!5m2!1sen!2s"
              width="100%"
              height="100%"
              style="border:0;"
              allowfullscreen="false"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

      </div>

      <div class="mt-12 pt-6 border-t border-white/30 flex flex-col lg:flex-row justify-between items-center gap-6 text-center lg:text-left">
        <p class="text-sm text-white/90">
          {{ $t('copyright') }} <br class="lg:hidden" />
          {{ $t('rights_reserved') }}
        </p>

        <div class="flex flex-wrap items-center justify-center gap-2">
         
        </div>
      </div>
    </div>
  </footer>
  
  
  </div>




</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Res } from '~~/types/globalTypes';
import type { IMenuItem } from '~~/types/mainPageGlobalTypes';

const isMenuOpen = ref<boolean>(false);
const { locale } = useI18n();
const { ENV_BASE, api } = useEnv();

const { data, pending, error, refresh } = useFetch<Res<IMenuItem[]>>('menus', {
    baseURL: api,
    method: 'get',
    watch: [locale], 
    headers: {
      get 'Accept-Language'() {
        return locale.value;
      }
    }
});

const handleMenuClick = (menuItem: IMenuItem) => {
  isMenuOpen.value = false;
};
</script>

<style>
.mainSectionBody {
    background: url('/pics/background.png') repeat-y center center fixed;
    background-size: cover;
}
</style>