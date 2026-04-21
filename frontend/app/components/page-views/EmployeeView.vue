<script setup lang="ts">
import type { EmployeeDetails } from '~/types/api'

const props = defineProps<{ details: Partial<EmployeeDetails>, title: string }>()

const media = useMedia()
const { locale } = useI18n()

const fullName = computed(() =>
  [props.details.lastName, props.details.firstName, props.details.fathersName].filter(Boolean).join(' ') || props.title
)

const facts = computed(() => {
  const d = props.details
  const hours = d.workStartTime && d.workEndTime ? `${d.workStartTime} – ${d.workEndTime}` : ''
  return [
    { icon: 'i-lucide-mail', label: 'employee.email', value: d.email, href: d.email ? `mailto:${d.email}` : undefined },
    { icon: 'i-lucide-phone', label: 'employee.phone', value: d.phoneNumber, href: d.phoneNumber ? `tel:${d.phoneNumber.replace(/\s/g, '')}` : undefined },
    { icon: 'i-lucide-calendar-days', label: 'employee.reception', value: d.receptionDays },
    { icon: 'i-lucide-clock', label: 'employee.work_hours', value: hours },
    { icon: 'i-lucide-map-pin', label: 'employee.address', value: d.address },
    { icon: 'i-lucide-cake', label: 'employee.birth_date', value: d.dateOfBirth ? formatDate(d.dateOfBirth, locale.value) : '' }
  ].filter(item => item.value)
})
</script>

<template>
  <div class="grid gap-8 lg:grid-cols-12">
    <aside class="lg:col-span-4">
      <div class="overflow-hidden rounded-2xl border border-default bg-default shadow-sm lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]">
        <div class="relative aspect-[4/5] bg-gradient-to-br from-brand-800 to-brand-950">
          <img
            v-if="details.mainImgURL"
            :src="media(details.mainImgURL)"
            :alt="fullName"
            class="size-full object-cover"
            width="480"
            height="600"
          >
          <div
            v-else
            class="flex size-full items-center justify-center"
          >
            <UIcon
              name="i-lucide-user-round"
              class="size-24 text-white/30"
            />
          </div>
        </div>
        <div class="p-6">
          <h2 class="font-display text-xl font-bold text-highlighted">
            {{ fullName }}
          </h2>
          <p
            v-if="details.position"
            class="mt-1.5 text-sm leading-relaxed text-muted"
          >
            {{ details.position }}
          </p>
        </div>
      </div>
    </aside>

    <div class="space-y-8 lg:col-span-8">
      <section
        v-if="facts.length"
        class="rounded-2xl border border-default bg-default p-6 sm:p-8"
      >
        <h2 class="font-display mb-6 flex items-center gap-2 text-lg font-bold text-highlighted">
          <span class="h-5 w-1 rounded-full bg-secondary" />
          {{ $t('employee.contacts') }}
        </h2>
        <dl class="grid gap-5 sm:grid-cols-2">
          <div
            v-for="fact in facts"
            :key="fact.label"
            class="flex gap-3"
          >
            <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UIcon
                :name="fact.icon"
                class="size-5"
              />
            </span>
            <div class="min-w-0">
              <dt class="text-xs uppercase tracking-wide text-dimmed">
                {{ $t(fact.label) }}
              </dt>
              <dd class="mt-0.5 break-words font-medium text-highlighted">
                <a
                  v-if="fact.href"
                  :href="fact.href"
                  class="hover:text-primary"
                >{{ fact.value }}</a>
                <template v-else>
                  {{ fact.value }}
                </template>
              </dd>
            </div>
          </div>
        </dl>
      </section>

      <section
        v-if="details.content"
        class="rounded-2xl border border-default bg-default p-6 sm:p-8"
      >
        <h2 class="font-display mb-5 flex items-center gap-2 text-lg font-bold text-highlighted">
          <span class="h-5 w-1 rounded-full bg-secondary" />
          {{ $t('employee.biography') }}
        </h2>
        <div
          class="rich-content"
          v-html="details.content"
        />
      </section>
    </div>
  </div>
</template>
