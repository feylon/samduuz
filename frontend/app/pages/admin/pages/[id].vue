<script setup lang="ts">
definePageMeta({ layout: 'admin', i18n: false })
useHead({ title: 'Sahifani tahrirlash' })

const id = Number(useRoute().params.id)
</script>

<template>
  <AdminPage
    title="Sahifani tahrirlash"
    back="/admin/pages"
  >
    <AdminPageForm :id="id" />
  </AdminPage>
</template>
