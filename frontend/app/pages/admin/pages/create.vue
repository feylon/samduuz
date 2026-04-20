<script setup lang="ts">
import type { PageType } from '~/types/api'

definePageMeta({ layout: 'admin', i18n: false })
useHead({ title: 'Sahifa yaratish' })

const type = Number(useRoute().query.type)
const initialType = ([0, 1, 2].includes(type) ? type : 0) as PageType
</script>

<template>
  <AdminPage
    title="Sahifa yaratish"
    back="/admin/pages"
  >
    <AdminPageForm :initial-type="initialType" />
  </AdminPage>
</template>
