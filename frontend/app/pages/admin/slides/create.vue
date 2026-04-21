<script setup lang="ts">
definePageMeta({ layout: 'admin', i18n: false })
useHead({ title: 'Slayd qo‘shish' })
</script>

<template>
  <AdminPage
    title="Slayd qo‘shish"
    back="/admin/slides"
  >
    <AdminSlideForm />
  </AdminPage>
</template>
