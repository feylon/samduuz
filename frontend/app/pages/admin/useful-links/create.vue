<script setup lang="ts">
definePageMeta({ layout: 'admin', i18n: false })
useHead({ title: 'Havola qo‘shish' })
</script>

<template>
  <AdminPage
    title="Havola qo‘shish"
    back="/admin/useful-links"
  >
    <AdminUsefulLinkForm />
  </AdminPage>
</template>
