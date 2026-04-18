<script setup lang="ts">
definePageMeta({ layout: 'admin', i18n: false })
useHead({ title: 'Fayllar' })
</script>

<template>
  <AdminPage
    title="Fayllar"
    description="Saytda ishlatiladigan rasmlar va hujjatlar. Fayllarni sudrab tashlab ham yuklash mumkin."
  >
    <AdminFileManager sync-route />
  </AdminPage>
</template>
