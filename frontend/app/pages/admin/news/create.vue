<script setup lang="ts">
definePageMeta({ layout: 'admin', i18n: false })
useHead({ title: 'Yangilik qo‘shish' })
</script>

<template>
  <AdminPage
    title="Yangilik qo‘shish"
    back="/admin/news"
  >
    <AdminPublicationForm
      endpoint="/news"
      public-base="/news"
      noun="Yangilik"
    />
  </AdminPage>
</template>
