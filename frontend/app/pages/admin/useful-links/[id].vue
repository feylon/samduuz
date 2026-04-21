<script setup lang="ts">
definePageMeta({ layout: 'admin', i18n: false })
useHead({ title: 'Havolani tahrirlash' })

const id = Number(useRoute().params.id)
</script>

<template>
  <AdminPage
    title="Havolani tahrirlash"
    back="/admin/useful-links"
  >
    <AdminUsefulLinkForm :id="id" />
  </AdminPage>
</template>
