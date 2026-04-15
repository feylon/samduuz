<script setup lang="ts">
import { PageType } from '~/types/api'
import type { DepartmentDetails, EmployeeDetails, PublicPage } from '~/types/api'

const route = useRoute()
const { locale } = useI18n()
const media = useMedia()

const { data: page, error } = await usePublicFetch<PublicPage>(() => `/pages/${String(route.params.slug)}`)

if (error.value || !page.value) {
  throw createError({ statusCode: error.value?.statusCode ?? 404, statusMessage: 'Not Found', fatal: true })
}

const employee = computed(() =>
  page.value?.pageType === PageType.Employee ? parseJson<EmployeeDetails>(page.value.content) ?? {} : null
)
const department = computed(() =>
  page.value?.pageType === PageType.Department ? parseJson<DepartmentDetails>(page.value.content) ?? {} : null
)

const heading = computed(() => {
  if (department.value?.name) return department.value.name
  return page.value?.title ?? ''
})

const shareImage = computed(() => media(employee.value?.mainImgURL || department.value?.mainPicture))

useSiteSeo({
  title: heading,
  description: () => page.value?.excerpt,
  image: shareImage,
  modifiedTime: () => page.value?.updatedAt
})

useJsonLd(() => {
  if (!page.value) return null
  if (employee.value) {
    return {
      '@type': 'Person',
      'name': [employee.value.lastName, employee.value.firstName, employee.value.fathersName].filter(Boolean).join(' ') || page.value.title,
      'jobTitle': employee.value.position,
      'email': employee.value.email,
      'telephone': employee.value.phoneNumber,
      'image': shareImage.value,
      'worksFor': { '@type': 'CollegeOrUniversity', 'name': 'Samarqand davlat universiteti' }
    }
  }
  return {
    '@type': 'WebPage',
    'name': heading.value,
    'description': page.value.excerpt,
    'dateModified': page.value.updatedAt,
    'inLanguage': locale.value
  }
}, 'page')
</script>

<template>
  <div v-if="page">
    <ContentPageHero :title="heading" :breadcrumbs="[{ label: heading }]">
      <p class="mt-5 flex items-center gap-2 text-sm text-white/60">
        <UIcon name="i-lucide-refresh-cw" class="size-4 text-gold-400" />
        {{ $t('content.updated') }}: <time :datetime="page.updatedAt">{{ formatDate(page.updatedAt, locale) }}</time>
      </p>
    </ContentPageHero>

    <div class="container-page py-10 sm:py-14">
      <PageViewsEmployeeView v-if="employee" :details="employee" :title="page.title" />
      <PageViewsDepartmentView v-else-if="department" :details="department" :title="page.title" />
      <article v-else class="mx-auto max-w-4xl">
        <div class="rich-content" v-html="page.content" />
      </article>
    </div>
  </div>
</template>
