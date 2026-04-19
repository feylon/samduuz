<script setup lang="ts">
definePageMeta({ layout: 'admin', i18n: false })
useHead({ title: 'E’lonlar' })
</script>

<template>
  <AdminPage title="E’lonlar">
    <template #actions>
      <UButton
        to="/admin/announcements/create"
        icon="i-lucide-plus"
      >
        Qo‘shish
      </UButton>
    </template>
    <AdminPublicationTable
      endpoint="/announcements"
      public-base="/announcements"
      noun="E’lon"
    />
  </AdminPage>
</template>
