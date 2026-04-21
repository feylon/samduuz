<script setup lang="ts">
definePageMeta({ layout: 'admin', i18n: false })
useHead({ title: 'Slaydni tahrirlash' })

const id = Number(useRoute().params.id)
</script>

<template>
  <AdminPage
    title="Slaydni tahrirlash"
    back="/admin/slides"
  >
    <AdminSlideForm :id="id" />
  </AdminPage>
</template>
