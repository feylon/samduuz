<script setup lang="ts">
definePageMeta({ layout: 'admin', i18n: false })
useHead({ title: 'Yangilikni tahrirlash' })

const id = Number(useRoute().params.id)
</script>

<template>
  <AdminPage
    title="Yangilikni tahrirlash"
    back="/admin/news"
  >
    <AdminPublicationForm
      :id="id"
      endpoint="/news"
      public-base="/news"
      noun="Yangilik"
    />
  </AdminPage>
</template>
