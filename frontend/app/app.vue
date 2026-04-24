<script setup lang="ts">
const { t, locale, locales } = useI18n()

const language = computed(() => locales.value.find(item => item.code === locale.value)?.language ?? 'uz')

useHead({
  htmlAttrs: { lang: language }
})

useSeoMeta({
  description: () => t('site.description'),
  ogLocale: () => language.value.replace(/-/g, '_')
})
</script>

<template>
  <UApp
    :toaster="{ position: 'top-right' }"
    :tooltip="{ delayDuration: 200 }"
  >
    <NuxtLoadingIndicator
      color="var(--ui-color-secondary-400)"
      :height="3"
    />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
