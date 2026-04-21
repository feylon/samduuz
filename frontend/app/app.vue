<script setup lang="ts">
const head = useLocaleHead({ seo: true })
const { t } = useI18n()

useHead({
  htmlAttrs: { lang: () => head.value.htmlAttrs?.lang },
  link: () => head.value.link ?? [],
  meta: () => head.value.meta ?? []
})

useSeoMeta({
  description: () => t('site.description')
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
