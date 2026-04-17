<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'
import { adminNavigation } from '~/constants/admin'

const auth = useAuth()
const { get } = useAdminApi()
const colorMode = useColorMode()
const sidebarOpen = ref(false)

useHead({
  titleTemplate: '%s · SamDU admin',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }]
})

onMounted(async () => {
  if (!auth.user.value) {
    auth.user.value = await get('/auth/me').catch(() => null) as typeof auth.user.value
  }
})

const groups = computed<NavigationMenuItem[][]>(() =>
  adminNavigation.map(group => group.map(item => ({
    ...item,
    onSelect: () => {
      sidebarOpen.value = false
    }
  })))
)

const userMenu = computed<DropdownMenuItem[][]>(() => [
  [{ label: auth.user.value?.fullName ?? 'Administrator', type: 'label' }],
  [
    { label: 'Saytni ochish', icon: 'i-lucide-external-link', to: '/', target: '_blank' },
    { label: 'Parolni o‘zgartirish', icon: 'i-lucide-key-round', to: '/admin/profile' },
    {
      label: colorMode.value === 'dark' ? 'Yorug‘ rejim' : 'Tungi rejim',
      icon: colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon',
      onSelect: () => {
        colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
      }
    }
  ],
  [{ label: 'Chiqish', icon: 'i-lucide-log-out', color: 'error', onSelect: () => auth.logout() }]
])
</script>

<template>
  <UDashboardGroup
    unit="rem"
    storage="local"
    storage-key="samdu-admin"
  >
    <UDashboardSidebar
      v-model:open="sidebarOpen"
      collapsible
      resizable
      :default-size="16"
      :min-size="14"
      :max-size="20"
      class="bg-elevated/40"
      :ui="{ footer: 'border-t border-default' }"
    >
      <template #header="{ collapsed }">
        <NuxtLink
          to="/admin"
          class="flex min-w-0 items-center gap-2.5"
        >
          <img
            src="/pics/logo.webp"
            alt="SamDU"
            width="36"
            height="36"
            class="size-9 shrink-0 rounded-full bg-white p-0.5 ring-1 ring-default"
          >
          <span
            v-if="!collapsed"
            class="min-w-0 leading-tight"
          >
            <span class="font-display block truncate text-sm font-bold text-highlighted">SamDU</span>
            <span class="block truncate text-xs text-muted">Boshqaruv paneli</span>
          </span>
        </NuxtLink>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          v-for="(group, index) in groups"
          :key="index"
          :collapsed="collapsed"
          :items="group"
          orientation="vertical"
          tooltip
          popover
          :class="index > 0 ? 'mt-3 border-t border-default pt-3' : ''"
        />
      </template>

      <template #footer="{ collapsed }">
        <UDropdownMenu
          :items="userMenu"
          :content="{ align: 'start', side: 'top' }"
          :ui="{ content: 'w-60' }"
        >
          <UButton
            color="neutral"
            variant="ghost"
            block
            :square="collapsed"
            class="data-[state=open]:bg-elevated"
            :class="collapsed ? '' : 'justify-start'"
          >
            <UAvatar
              :alt="auth.user.value?.fullName ?? 'A'"
              size="sm"
              class="bg-primary text-inverted"
            />
            <span
              v-if="!collapsed"
              class="min-w-0 flex-1 truncate text-left"
            >
              {{ auth.user.value?.fullName ?? 'Administrator' }}
            </span>
            <UIcon
              v-if="!collapsed"
              name="i-lucide-chevrons-up-down"
              class="size-4 text-dimmed"
            />
          </UButton>
        </UDropdownMenu>
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
