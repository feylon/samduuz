<script setup lang="ts">
definePageMeta({ layout: 'admin', i18n: false })
useHead({ title: 'Yangiliklar' })
</script>

<template>
  <AdminPage title="Yangiliklar">
    <template #actions>
      <UButton
        to="/admin/news/create"
        icon="i-lucide-plus"
      >
        Qo‘shish
      </UButton>
    </template>
    <AdminPublicationTable
      endpoint="/news"
      public-base="/news"
      noun="Yangilik"
    />
  </AdminPage>
</template>
