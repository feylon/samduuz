<script setup lang="ts">
definePageMeta({ layout: 'admin', i18n: false })
useHead({ title: 'E’lonni tahrirlash' })

const id = Number(useRoute().params.id)
</script>

<template>
  <AdminPage
    title="E’lonni tahrirlash"
    back="/admin/announcements"
  >
    <AdminPublicationForm
      :id="id"
      endpoint="/announcements"
      public-base="/announcements"
      noun="E’lon"
    />
  </AdminPage>
</template>
