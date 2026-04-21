<script setup lang="ts">
import type { DepartmentDetails } from '~/types/api'

const props = defineProps<{ details: Partial<DepartmentDetails>, title: string }>()

const media = useMedia()

const contactItems = computed(() => {
  const d = props.details
  return [
    { icon: 'i-lucide-map-pin', value: d.address },
    { icon: 'i-lucide-phone', value: d.phone, href: d.phone ? `tel:${d.phone.replace(/\s/g, '')}` : undefined },
    { icon: 'i-lucide-mail', value: d.email, href: d.email ? `mailto:${d.email}` : undefined }
  ].filter(item => item.value)
})

const socialItems = computed(() => {
  const d = props.details
  return [
    { icon: 'i-simple-icons-telegram', label: 'Telegram', href: d.telegram },
    { icon: 'i-simple-icons-facebook', label: 'Facebook', href: d.facebook },
    { icon: 'i-simple-icons-linkedin', label: 'LinkedIn', href: d.linkedin }
  ].filter(item => item.href)
})
</script>

<template>
  <div class="space-y-8">
    <figure
      v-if="details.mainPicture"
      class="overflow-hidden rounded-2xl bg-elevated shadow-sm"
    >
      <img
        :src="media(details.mainPicture)"
        :alt="details.name || title"
        width="1280"
        height="540"
        class="aspect-[21/9] w-full object-cover"
      >
    </figure>

    <div class="grid gap-8 lg:grid-cols-12">
      <section
        v-if="details.content"
        class="rounded-2xl border border-default bg-default p-6 sm:p-8 lg:col-span-8"
      >
        <h2 class="font-display mb-5 flex items-center gap-2 text-lg font-bold text-highlighted">
          <span class="h-5 w-1 rounded-full bg-secondary" />
          {{ $t('department.about') }}
        </h2>
        <div
          class="rich-content"
          v-html="details.content"
        />
      </section>

      <aside class="space-y-6 lg:col-span-4">
        <div
          v-if="contactItems.length"
          class="rounded-2xl bg-gradient-to-br from-brand-900 to-brand-950 p-6 text-white sm:p-8"
        >
          <h2 class="font-display mb-5 text-lg font-bold">
            {{ $t('department.contacts') }}
          </h2>
          <ul class="space-y-4 text-sm">
            <li
              v-for="contact in contactItems"
              :key="contact.icon"
              class="flex gap-3"
            >
              <UIcon
                :name="contact.icon"
                class="mt-0.5 size-5 shrink-0 text-gold-400"
              />
              <a
                v-if="contact.href"
                :href="contact.href"
                class="break-all hover:text-gold-300"
              >{{ contact.value }}</a>
              <span v-else>{{ contact.value }}</span>
            </li>
          </ul>
          <div
            v-if="socialItems.length"
            class="mt-6 border-t border-white/10 pt-5"
          >
            <p class="mb-3 text-xs uppercase tracking-wider text-white/60">
              {{ $t('department.socials') }}
            </p>
            <div class="flex gap-2">
              <a
                v-for="social in socialItems"
                :key="social.label"
                :href="social.href"
                target="_blank"
                rel="noopener"
                :aria-label="social.label"
                class="flex size-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-gold-500 hover:text-brand-950"
              >
                <UIcon
                  :name="social.icon"
                  class="size-4"
                />
              </a>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
