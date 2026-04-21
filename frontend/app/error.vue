<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const { t } = useI18n()
const localePath = useLocalePath()
const isNotFound = computed(() => props.error?.statusCode === 404)

useHead({
  title: () => (isNotFound.value ? t('error.not_found') : t('error.server')),
  meta: [{ name: 'robots', content: 'noindex' }]
})

const goHome = () => clearError({ redirect: localePath('/') })
const goBack = () => {
  clearError()
  useRouter().back()
}
</script>

<template>
  <UApp>
    <div class="relative flex min-h-dvh items-center justify-center overflow-hidden bg-default px-6 py-24">
      <div class="pointer-events-none absolute inset-0 bg-pattern opacity-70" />
      <div class="pointer-events-none absolute left-1/2 top-1/3 size-[32rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div class="relative max-w-xl text-center">
        <img
          src="/pics/logo.webp"
          alt=""
          width="80"
          height="80"
          class="mx-auto mb-8 size-20 rounded-full bg-white p-1 shadow-lg"
        >
        <p class="font-display bg-gradient-to-br from-brand-700 to-brand-950 bg-clip-text text-8xl font-extrabold text-transparent sm:text-9xl dark:from-brand-200 dark:to-brand-400">
          {{ error?.statusCode || 404 }}
        </p>
        <h1 class="font-display mt-4 text-2xl font-bold text-highlighted sm:text-3xl">
          {{ isNotFound ? t('error.not_found') : t('error.server') }}
        </h1>
        <p class="mx-auto mt-3 max-w-md text-muted">
          {{ isNotFound ? t('error.not_found_text') : t('error.server_text') }}
        </p>
        <div class="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <UButton
            size="xl"
            icon="i-lucide-house"
            class="justify-center rounded-full px-6"
            @click="goHome"
          >
            {{ t('error.home') }}
          </UButton>
          <UButton
            size="xl"
            color="neutral"
            variant="outline"
            icon="i-lucide-arrow-left"
            class="justify-center rounded-full px-6"
            @click="goBack"
          >
            {{ t('error.back') }}
          </UButton>
        </div>
      </div>
    </div>
  </UApp>
</template>
