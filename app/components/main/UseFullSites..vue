<template>
  <section ref="sectionRef" class="relative w-full py-16 bg-gray-50 overflow-hidden">
    <h2 class="title-el text-3xl md:text-5xl font-bold text-[#1a202c] text-center mb-12">
      {{ $t('foydali_saytlar') }}
    </h2>

    <div 
      class="carousel-el relative w-full flex overflow-hidden"
      @mouseenter="pauseAnim"
      @mouseleave="playAnim"
    >
      <div ref="trackRef" class="flex space-x-6 whitespace-nowrap">
        <div v-for="n in 2" :key="n" class="flex space-x-6 items-center">
          <a 
            v-for="site in usefulSites" 
            :key="site.id" 
            :href="site.link"
            target="_blank"
            class="site-card flex flex-col items-center justify-between p-6 w-52 h-64 bg-white rounded-2xl shadow-sm border border-gray-100 transition-shadow hover:shadow-xl group"
          >
            <div class="flex-1 flex items-center justify-center mb-4">
              <img 
                :src="site.logo" 
                :alt="$t(site.titleKey)" 
                class="max-w-full max-h-24 object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <p class="text-xs md:text-sm font-bold text-gray-800 text-center leading-tight whitespace-normal line-clamp-3">
              {{ $t(site.titleKey) }}
            </p>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ISite {
  id: number;
  titleKey: string;
  logo: string;
  link: string;
}

const sectionRef = ref(null);
const trackRef = ref(null);
let infiniteAnim: gsap.core.Tween | null = null;

const usefulSites: ISite[] = [
  { id: 1, titleKey: 'site_constitution', logo: '/pics/gerb.jpg', link: 'https://constitution.uz' },
  { id: 2, titleKey: 'site_ministry', logo: '/pics/gerb.jpg', link: 'https://edu.uz' },
  { id: 3, titleKey: 'site_government', logo: '/pics/gerb.jpg', link: 'https://gov.uz' },
  { id: 4, titleKey: 'site_mygov', logo: '/pics/mygov.png', link: 'https://my.gov.uz' },
  { id: 5, titleKey: 'site_uza', logo: '/pics/uza.png', link: 'https://uza.uz' },
];

onMounted(() => {
  const track = trackRef.value;
  const scrollWidth = track.scrollWidth / 2;

  gsap.from(".title-el", {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: sectionRef.value,
      start: "top 85%",
    }
  });

  gsap.from(".carousel-el", {
    y: 80,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
    delay: 0.2,
    scrollTrigger: {
      trigger: sectionRef.value,
      start: "top 80%",
    }
  });

  infiniteAnim = gsap.to(track, {
    x: -scrollWidth,
    duration: 25,
    ease: "none",
    repeat: -1,
  });
});

const pauseAnim = () => infiniteAnim?.pause();
const playAnim = () => infiniteAnim?.play();
</script>

<style scoped>
.site-card {
  flex-shrink: 0;
  user-select: none;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>