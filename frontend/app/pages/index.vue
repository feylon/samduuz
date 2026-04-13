<script setup lang="ts">
const { t } = useI18n()

useSiteSeo({
  title: () => t('site.full'),
  description: () => t('site.description')
})

useHead({ titleTemplate: '%s' })
</script>

<template>
  <div>
    <HomeHeroSlider />
    <HomeQuickLinks />
    <HomeLatestNews />
    <HomeLatestAnnouncements />
    <HomeStatsCounter />
    <HomeUsefulLinks />
  </div>
</template>
