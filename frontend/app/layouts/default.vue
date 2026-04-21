<script setup lang="ts">
import type { PublicMenu } from '~/types/api'
import { contacts, socials } from '~/constants/site'

const { data: menus, pending } = await usePublicFetch<PublicMenu[]>('/menus', {
  default: () => []
})

const { t } = useI18n()
const { siteUrl } = useRuntimeConfig().public

useJsonLd(() => ({
  '@type': 'CollegeOrUniversity',
  'name': t('site.full'),
  'alternateName': t('site.short'),
  'url': siteUrl,
  'logo': `${siteUrl}/icon-512.png`,
  'foundingDate': '1927',
  'email': contacts.email,
  'telephone': contacts.phone,
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': 'Universitet xiyoboni, 15',
    'addressLocality': 'Samarqand',
    'postalCode': '140104',
    'addressCountry': 'UZ'
  },
  'sameAs': socials.map(item => item.href)
}), 'organization')
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-default">
    <SiteHeader
      :menus="menus ?? []"
      :pending="pending"
    />
    <main
      id="main"
      class="flex-1"
    >
      <slot />
    </main>
    <SiteFooter :menus="menus ?? []" />
  </div>
</template>
