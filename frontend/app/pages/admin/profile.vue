<script setup lang="ts">
import type { FormError } from '@nuxt/ui'

definePageMeta({ layout: 'admin', i18n: false })
useHead({ title: 'Parolni o‘zgartirish' })

const api = useAdminApi()
const auth = useAuth()

const state = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' })
const saving = ref(false)

const validate = (value: typeof state): FormError[] => {
  const errors = requireFields(value, {
    currentPassword: 'Joriy parolni kiriting',
    newPassword: 'Yangi parolni kiriting'
  })
  if (value.newPassword && value.newPassword.length < 8) errors.push({ name: 'newPassword', message: 'Kamida 8 ta belgi' })
  if (value.confirmPassword !== value.newPassword) errors.push({ name: 'confirmPassword', message: 'Parollar mos kelmadi' })
  return errors
}

const submit = async () => {
  saving.value = true
  try {
    await api.save('/auth/password', { currentPassword: state.currentPassword, newPassword: state.newPassword }, 'PUT')
    await auth.logout()
  } catch {
    saving.value = false
  }
}
</script>

<template>
  <AdminPage title="Parolni o‘zgartirish">
    <div class="max-w-lg">
      <AdminFormCard
        title="Xavfsizlik"
        description="Parol o‘zgargach tizimdan chiqasiz va yangi parol bilan qayta kirasiz."
      >
        <UForm
          :state="state"
          :validate="validate"
          class="space-y-4"
          @submit="submit"
        >
          <UFormField
            label="Joriy parol"
            name="currentPassword"
          >
            <UInput
              v-model="state.currentPassword"
              type="password"
              autocomplete="current-password"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Yangi parol"
            name="newPassword"
          >
            <UInput
              v-model="state.newPassword"
              type="password"
              autocomplete="new-password"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Yangi parolni takrorlang"
            name="confirmPassword"
          >
            <UInput
              v-model="state.confirmPassword"
              type="password"
              autocomplete="new-password"
              class="w-full"
            />
          </UFormField>
          <UButton
            type="submit"
            :loading="saving"
            icon="i-lucide-key-round"
          >
            Parolni yangilash
          </UButton>
        </UForm>
      </AdminFormCard>
    </div>
  </AdminPage>
</template>
