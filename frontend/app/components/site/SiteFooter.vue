<script setup lang="ts">
import type { PublicMenu } from '~/types/api'
import { contacts, socials } from '~/constants/site'

defineProps<{ menus: PublicMenu[] }>()

const year = new Date().getFullYear()
</script>

<template>
  <footer class="relative overflow-hidden bg-brand-950 text-white">
    <div class="pointer-events-none absolute inset-0 bg-pattern opacity-[0.04] invert" />
    <div class="pointer-events-none absolute -right-40 -top-40 size-96 rounded-full bg-gold-500/10 blur-3xl" />

    <div class="container-page relative grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:py-16">
      <div class="space-y-5 lg:col-span-4">
        <SiteAppLogo inverted />
        <p class="max-w-sm text-sm leading-relaxed text-white/65">
          {{ $t('footer.about') }}
        </p>
        <div>
          <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-gold-300">
            {{ $t('footer.social') }}
          </p>
          <div class="flex gap-2">
            <a
              v-for="social in socials"
              :key="social.label"
              :href="social.href"
              target="_blank"
              rel="noopener"
              :aria-label="social.label"
              class="flex size-10 items-center justify-center rounded-full bg-white/10 transition-all hover:-translate-y-0.5 hover:bg-gold-500 hover:text-brand-950"
            >
              <UIcon
                :name="social.icon"
                class="size-4"
              />
            </a>
          </div>
        </div>
      </div>

      <div
        v-if="menus.length"
        class="lg:col-span-3"
      >
        <h2 class="mb-4 text-xs font-semibold uppercase tracking-wider text-gold-300">
          {{ $t('footer.sections') }}
        </h2>
        <ul class="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm sm:grid-cols-1">
          <template
            v-for="menu in menus"
            :key="menu.id"
          >
            <li v-if="menu.link">
              <SiteMenuLink
                :link="menu.link"
                :is-external="menu.isExternal"
                class="text-white/70 transition-colors hover:text-white"
              >
                {{ menu.name }}
              </SiteMenuLink>
            </li>
            <li
              v-for="child in menu.children.slice(0, 4)"
              :key="child.id"
            >
              <SiteMenuLink
                :link="child.link"
                :is-external="child.isExternal"
                class="text-white/70 transition-colors hover:text-white"
              >
                {{ child.name }}
              </SiteMenuLink>
            </li>
          </template>
        </ul>
      </div>

      <div class="space-y-3 text-sm lg:col-span-2">
        <h2 class="mb-4 text-xs font-semibold uppercase tracking-wider text-gold-300">
          {{ $t('footer.contacts') }}
        </h2>
        <p class="flex gap-2.5 text-white/70">
          <UIcon
            name="i-lucide-map-pin"
            class="mt-0.5 size-4 shrink-0 text-gold-400"
          />
          {{ $t('site.address') }}
        </p>
        <a
          :href="`tel:${contacts.helpline.replace(/\s/g, '')}`"
          class="flex gap-2.5 text-white/70 hover:text-white"
        >
          <UIcon
            name="i-lucide-phone-call"
            class="mt-0.5 size-4 shrink-0 text-gold-400"
          />
          <span>{{ $t('footer.helpline') }}<br><span class="text-white">{{ contacts.helpline }}</span></span>
        </a>
        <a
          :href="`tel:${contacts.phone.replace(/\s/g, '')}`"
          class="flex gap-2.5 text-white/70 hover:text-white"
        >
          <UIcon
            name="i-lucide-phone"
            class="mt-0.5 size-4 shrink-0 text-gold-400"
          />
          <span>{{ $t('footer.reception') }}<br><span class="text-white">{{ contacts.phone }}</span></span>
        </a>
        <a
          :href="`mailto:${contacts.email}`"
          class="flex gap-2.5 text-white/70 hover:text-white"
        >
          <UIcon
            name="i-lucide-mail"
            class="mt-0.5 size-4 shrink-0 text-gold-400"
          />
          {{ contacts.email }}
        </a>
      </div>

      <div class="sm:col-span-2 lg:col-span-3">
        <h2 class="mb-4 text-xs font-semibold uppercase tracking-wider text-gold-300">
          {{ $t('footer.map') }}
        </h2>
        <div class="aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-white/10">
          <iframe
            :src="contacts.mapEmbed"
            :title="$t('footer.map')"
            class="size-full grayscale-[35%] transition hover:grayscale-0"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>

    <div class="relative border-t border-white/10">
      <div class="container-page flex flex-col gap-2 py-6 text-center text-xs text-white/55 md:flex-row md:items-center md:justify-between md:text-left">
        <p>© 1927–{{ year }} {{ $t('site.full') }}. {{ $t('footer.rights') }}</p>
        <p>{{ $t('footer.notice') }}</p>
      </div>
    </div>
  </footer>
</template>
