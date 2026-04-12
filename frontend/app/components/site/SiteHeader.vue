<script setup lang="ts">
import type { PublicMenu } from '~/types/api'
import { contacts, quickLinks, socials } from '~/constants/site'

defineProps<{ menus: PublicMenu[], pending?: boolean }>()

const mobileOpen = ref(false)
const scrolled = ref(false)
const route = useRoute()

watch(() => route.fullPath, () => {
  mobileOpen.value = false
})

onMounted(() => {
  const onScroll = () => {
    scrolled.value = window.scrollY > 24
  }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
})
</script>

<template>
  <a
    href="#main"
    class="sr-only z-[60] rounded-md bg-primary px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
  >
    {{ $t('nav.skip') }}
  </a>

  <div class="hidden bg-brand-950 text-white/80 md:block">
    <div class="container-page flex h-10 items-center justify-between gap-6 text-[13px]">
      <div class="flex items-center gap-5">
        <a :href="`mailto:${contacts.email}`" class="flex items-center gap-1.5 transition-colors hover:text-white">
          <UIcon name="i-lucide-mail" class="size-3.5" />
          {{ contacts.email }}
        </a>
        <a :href="`tel:${contacts.phone.replace(/\s/g, '')}`" class="flex items-center gap-1.5 transition-colors hover:text-white">
          <UIcon name="i-lucide-phone" class="size-3.5" />
          {{ contacts.phone }}
        </a>
      </div>
      <div class="flex items-center gap-5">
        <a
          v-for="link in quickLinks.slice(0, 3)"
          :key="link.key"
          :href="link.href"
          target="_blank"
          rel="noopener"
          class="hidden items-center gap-1.5 transition-colors hover:text-gold-300 xl:flex"
        >
          <UIcon :name="link.icon" class="size-3.5" />
          {{ $t(link.key) }}
        </a>
        <span class="hidden h-4 w-px bg-white/20 xl:block" />
        <div class="flex items-center gap-3">
          <a
            v-for="social in socials"
            :key="social.label"
            :href="social.href"
            target="_blank"
            rel="noopener"
            :aria-label="social.label"
            class="transition-colors hover:text-gold-300"
          >
            <UIcon :name="social.icon" class="size-3.5" />
          </a>
        </div>
      </div>
    </div>
  </div>

  <header
    class="sticky top-0 z-40 border-b transition-all duration-300"
    :class="scrolled
      ? 'border-default bg-default/85 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-default/75'
      : 'border-transparent bg-default'"
  >
    <div class="container-page flex h-[var(--header-height)] items-center justify-between gap-4">
      <SiteAppLogo class="max-w-[70%] lg:max-w-xs xl:max-w-sm" />

      <SiteDesktopNav v-if="menus.length" :items="menus" class="h-full" />
      <div v-else-if="pending" class="hidden gap-3 lg:flex">
        <USkeleton v-for="n in 5" :key="n" class="h-5 w-20" />
      </div>

      <div class="flex shrink-0 items-center gap-1">
        <SiteLangSwitch class="hidden sm:flex" />
        <ClientOnly>
          <UColorModeButton color="neutral" variant="ghost" />
          <template #fallback>
            <div class="size-8" />
          </template>
        </ClientOnly>
        <UButton
          icon="i-lucide-menu"
          color="neutral"
          variant="ghost"
          size="lg"
          class="lg:hidden"
          :aria-label="$t('nav.open_menu')"
          @click="mobileOpen = true"
        />
      </div>
    </div>
  </header>

  <USlideover
    v-model:open="mobileOpen"
    side="left"
    :title="$t('nav.menu')"
    :close="{ 'aria-label': $t('nav.close_menu') }"
    :ui="{ content: 'max-w-sm', body: 'p-3 sm:p-4' }"
  >
    <template #title>
      <SiteAppLogo />
    </template>
    <template #body>
      <div class="flex h-full flex-col gap-6">
        <ul class="space-y-0.5">
          <li>
            <NuxtLinkLocale
              to="/"
              class="block rounded-lg px-3 py-2.5 text-base font-semibold text-highlighted hover:bg-elevated"
              @click="mobileOpen = false"
            >
              {{ $t('nav.home') }}
            </NuxtLinkLocale>
          </li>
          <SiteMobileNavItem
            v-for="menu in menus"
            :key="menu.id"
            :item="menu"
            @navigate="mobileOpen = false"
          />
        </ul>

        <div class="grid grid-cols-2 gap-2">
          <a
            v-for="link in quickLinks"
            :key="link.key"
            :href="link.href"
            target="_blank"
            rel="noopener"
            class="flex items-center gap-2 rounded-xl border border-default p-3 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
          >
            <UIcon :name="link.icon" class="size-4 shrink-0 text-secondary" />
            {{ $t(link.key) }}
          </a>
        </div>

        <div class="mt-auto space-y-4 border-t border-default pt-4">
          <SiteLangSwitch block class="sm:hidden" />
          <div class="flex flex-col gap-2 text-sm text-muted">
            <a :href="`tel:${contacts.phone.replace(/\s/g, '')}`" class="flex items-center gap-2">
              <UIcon name="i-lucide-phone" class="size-4" /> {{ contacts.phone }}
            </a>
            <a :href="`mailto:${contacts.email}`" class="flex items-center gap-2">
              <UIcon name="i-lucide-mail" class="size-4" /> {{ contacts.email }}
            </a>
          </div>
          <div class="flex gap-2">
            <UButton
              v-for="social in socials"
              :key="social.label"
              :to="social.href"
              target="_blank"
              :icon="social.icon"
              color="neutral"
              variant="soft"
              :aria-label="social.label"
            />
          </div>
        </div>
      </div>
    </template>
  </USlideover>
</template>
