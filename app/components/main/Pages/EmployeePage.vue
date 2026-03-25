<template>
  <div class="w-full min-h-screen bg-[#f6f8fb] py-8 md:py-12 px-4 md:px-6">
    <div v-if="staffData" class="max-w-5xl mx-auto space-y-6">

      <!-- Main Card -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-5 md:p-8">
          <div class="flex flex-col md:flex-row gap-6 md:gap-8">

            <!-- Image -->
            <div class="shrink-0 mx-auto md:mx-0">
              <div class="w-36 h-36 md:w-52 md:h-52 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  v-if="staffData.mainImgURL"
                  :src="getImageUrl(staffData.mainImgURL)"
                  :alt="fullName"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center"
                >
                  <UIcon name="i-heroicons-user" class="w-14 h-14 text-slate-400" />
                </div>
              </div>
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <div class="text-center md:text-left border-b border-slate-200 pb-5">
                <h1 class="text-2xl md:text-3xl font-semibold text-slate-900 leading-tight">
                  {{ fullName }}
                </h1>

                <p class="mt-2 text-sm md:text-base text-slate-600">
                  {{ staffData.position || props.title || "Lavozim ko‘rsatilmagan" }}
                </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 pt-5">
                <div v-if="staffData.email" class="flex items-start gap-3">
                  <div class="mt-0.5 text-slate-500">
                    <UIcon name="i-heroicons-envelope" class="w-5 h-5" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm text-slate-500">Elektron pochta</p>
                    <a
                      :href="`mailto:${staffData.email}`"
                      class="text-slate-900 font-medium break-all hover:text-blue-700 transition-colors"
                    >
                      {{ staffData.email }}
                    </a>
                  </div>
                </div>

                <div v-if="staffData.phoneNumber" class="flex items-start gap-3">
                  <div class="mt-0.5 text-slate-500">
                    <UIcon name="i-heroicons-phone" class="w-5 h-5" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm text-slate-500">Telefon</p>
                    <a
                      :href="`tel:${staffData.phoneNumber}`"
                      class="text-slate-900 font-medium hover:text-blue-700 transition-colors"
                    >
                      {{ staffData.phoneNumber }}
                    </a>
                  </div>
                </div>

                <div
                  v-if="staffData.workStartTime || staffData.workEndTime || staffData.receptionDays"
                  class="flex items-start gap-3"
                >
                  <div class="mt-0.5 text-slate-500">
                    <UIcon name="i-heroicons-clock" class="w-5 h-5" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm text-slate-500">Ish vaqti / Qabul kunlari</p>
                    <p class="text-slate-900 font-medium leading-relaxed">
                      <span v-if="staffData.workStartTime && staffData.workEndTime">
                        {{ staffData.workStartTime }} - {{ staffData.workEndTime }}
                      </span>
                      <span v-if="staffData.receptionDays">
                        <template v-if="staffData.workStartTime || staffData.workEndTime"> / </template>
                        {{ staffData.receptionDays }}
                      </span>
                    </p>
                  </div>
                </div>

                <div v-if="staffData.address" class="flex items-start gap-3">
                  <div class="mt-0.5 text-slate-500">
                    <UIcon name="i-heroicons-map-pin" class="w-5 h-5" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm text-slate-500">Manzil</p>
                    <p class="text-slate-900 font-medium leading-relaxed">
                      {{ staffData.address }}
                    </p>
                  </div>
                </div>

                <div v-if="staffData.dateOfBirth" class="flex items-start gap-3 md:col-span-2">
                  <div class="mt-0.5 text-slate-500">
                    <UIcon name="i-heroicons-cake" class="w-5 h-5" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm text-slate-500">Tug‘ilgan sana</p>
                    <p class="text-slate-900 font-medium">
                      {{ staffData.dateOfBirth }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <!-- /Info -->

          </div>
        </div>
      </div>

      <!-- Biography -->
      <div
        v-if="staffData?.content"
        class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div class="px-5 md:px-8 py-4 border-b border-slate-200 bg-slate-50">
          <h2 class="text-lg md:text-xl font-semibold text-slate-900">
            Batafsil ma’lumot
          </h2>
        </div>

        <div class="px-5 md:px-8 py-6 md:py-8">
          <div
            class="biography-content text-slate-700 text-[15px] leading-7"
            v-html="staffData.content"
          ></div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm py-16 px-6 text-center text-slate-500"
    >
      Ma'lumot topilmadi yoki yuklashda xatolik yuz berdi...
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

export interface ContentDetails {
  firstName?: string;
  lastName?: string;
  fathersName?: string;
  position?: string;
  dateOfBirth?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  receptionDays?: string;
  workStartTime?: string;
  workEndTime?: string;
  mainImgURL?: string;
  content?: string;
}

const props = defineProps<{
  title: string;
  content: string;
  createdAt?: string;
}>();

const { ENV_BASE } = useEnv();

const staffData = computed<Partial<ContentDetails> | null>(() => {
  if (!props.content) return null;

  try {
    return JSON.parse(props.content) as ContentDetails;
  } catch (e) {
    console.error("Content JSON qilib o‘qilmadi:", e);
    return { content: props.content };
  }
});

const fullName = computed(() => {
  const parts = [
    staffData.value?.lastName,
    staffData.value?.firstName,
    staffData.value?.fathersName
  ].filter(Boolean);

  return parts.length ? parts.join(" ") : props.title || "Xodim";
});

const getImageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;

  const cleanBase = ENV_BASE.replace(/\/$/, '');
  const cleanPath = path.replace(/^\//, '');
  return `${cleanBase}/${cleanPath}`;
};
</script>

<style scoped>
.biography-content :deep(p) {
  margin-bottom: 1rem;
}

.biography-content :deep(ul),
.biography-content :deep(ol) {
  margin-left: 1.25rem;
  margin-bottom: 1rem;
}

.biography-content :deep(ul) {
  list-style-type: disc;
}

.biography-content :deep(ol) {
  list-style-type: decimal;
}

.biography-content :deep(img) {
  max-width: 100%;
  height: auto !important;
  border-radius: 0.75rem;
  margin: 1.25rem 0;
}

.biography-content :deep(h1),
.biography-content :deep(h2),
.biography-content :deep(h3),
.biography-content :deep(h4) {
  color: #0f172a;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.75rem;
}

.biography-content :deep(a) {
  color: #1d4ed8;
  text-decoration: none;
}

.biography-content :deep(a:hover) {
  text-decoration: underline;
}
</style>