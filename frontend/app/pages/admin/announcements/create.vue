<script setup lang="ts">
definePageMeta({ layout: 'admin', i18n: false })
useHead({ title: 'E’lon qo‘shish' })
</script>

<template>
  <AdminPage
    title="E’lon qo‘shish"
    back="/admin/announcements"
  >
    <AdminPublicationForm
      endpoint="/announcements"
      public-base="/announcements"
      noun="E’lon"
    />
  </AdminPage>
</template>
