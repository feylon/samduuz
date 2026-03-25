<template>
  <section ref="sectionRef" class="relative w-full py-20 bg-[#001c3e] overflow-hidden">
    <div class="absolute inset-0 z-0 opacity-20">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#004b90] rounded-full blur-[200px]"></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-4 flex flex-col items-center">
      
      <div class="relative flex flex-col md:flex-row items-center justify-center -space-y-6 md:-space-y-0 md:-space-x-8">
        
        <div 
          v-for="stat in statistics" 
          :key="stat.id"
          class="relative group flex flex-col items-center justify-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-full shadow-2xl cursor-pointer transition-all duration-500 ease-out hover:scale-110 hover:z-50 w-56 h-56 md:w-60 md:h-60 lg:w-64 lg:h-64"
        >
          <div class="mb-4 text-[#86bfef] group-hover:text-cyan-200 transition-colors duration-300">
            <component :is="stat.icon" :size="48" stroke-width="1.5" />
          </div>
          
          <p class="text-xs md:text-sm text-gray-300 font-medium text-center px-8 leading-tight mb-2 uppercase tracking-wider">
            {{ $t(stat.titleKey) }}
          </p>

          <h3 class="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter">
            {{ stat.displayValue }}
          </h3>
        </div>

      </div>

      <div class="mt-24">
        <h2 class="text-3xl md:text-5xl font-extrabold text-white text-center animate-pulse-custom">
          {{ $t('bizning_erishgan_yutuqlarimiz') }}
        </h2>
      </div>
      
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { BookOpen, GraduationCap, Library, Award } from 'lucide-vue-next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const sectionRef = ref(null);

interface IStatistic {
  id: number;
  titleKey: string;
  icon: any;
  realValue: number;      // Haqiqiy raqam (hisoblash uchun)
  displayValue: string;   // Ekranda ko'rinadigan matn
}

// reactive orqali displayValue o'zgarganda ekran ham yangilanadi
const statistics = reactive<IStatistic[]>([
  { 
    id: 1, 
    titleKey: 'stat_professors', 
    icon: BookOpen, 
    realValue: 825,
    displayValue: '0'
  },
  { 
    id: 2, 
    titleKey: 'stat_students', 
    icon: GraduationCap, 
    realValue: 12100,
    displayValue: '0'
  },
  { 
    id: 3, 
    titleKey: 'stat_library', 
    icon: Library, 
    realValue: 3794575,
    displayValue: '0'
  },
  { 
    id: 4, 
    titleKey: 'stat_bachelors', 
    icon: Award, 
    realValue: 76,
    displayValue: '0'
  }
]);

onMounted(() => {
  statistics.forEach((stat) => {
    // Har bir stat uchun vaqtinchalik hisoblagich ob'ekti
    const counter = { val: 0 };

    gsap.to(counter, {
      val: stat.realValue,
      duration: 2.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.value,
        start: "top 85%", // Section ko'rinishi bilan sanash boshlanadi
        once: true        // Faqat bir marta ishlaydi
      },
      onUpdate: () => {
        // Raqamni formatlash (bo'sh joylar bilan: 12 100)
        stat.displayValue = Math.floor(counter.val).toLocaleString().replace(/,/g, ' ');
      }
    });
  });
});
</script>

<style scoped>
h3 {
  background: linear-gradient(135deg, #aad2f3 0%, #3182ce 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@keyframes pulse-custom {
  0% { transform: translateY(0); opacity: 0.9; }
  50% { transform: translateY(-5px); opacity: 1; }
  100% { transform: translateY(0); opacity: 0.9; }
}

.animate-pulse-custom {
  animation: pulse-custom 4s infinite ease-in-out;
}

.group {
  box-shadow: 0 0 20px rgba(0, 75, 144, 0.2);
}
</style>