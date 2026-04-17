<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  back?: string
}>()
</script>

<template>
  <UDashboardPanel :ui="{ body: 'p-4 sm:p-6 lg:p-8' }">
    <template #header>
      <UDashboardNavbar
        :title="title"
        :ui="{ title: 'font-display' }"
      >
        <template #leading>
          <UDashboardSidebarCollapse />
          <UButton
            v-if="back"
            :to="back"
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
            aria-label="Orqaga"
          />
        </template>
        <template #right>
          <slot name="actions" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <p
        v-if="description"
        class="-mt-1 mb-6 text-sm text-muted"
      >
        {{ description }}
      </p>
      <slot />
    </template>
  </UDashboardPanel>
</template>
