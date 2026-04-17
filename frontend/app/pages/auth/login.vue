<script setup lang="ts">
import type { FormError } from '@nuxt/ui'

definePageMeta({ layout: false, i18n: false })
useHead({ title: 'Tizimga kirish', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const auth = useAuth()
const route = useRoute()

const state = reactive({ username: '', password: '' })
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const validate = (value: typeof state): FormError[] => requireFields(value, {
  username: 'Loginni kiriting',
  password: 'Parolni kiriting'
})

const submit = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    await auth.login(state.username.trim(), state.password)
    const redirect = typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/admin')
      ? route.query.redirect
      : '/admin'
    await navigateTo(redirect)
  } catch (error) {
    errorMessage.value = extractErrorMessage(error)
    state.password = ''
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="grid min-h-dvh bg-default lg:grid-cols-2">
    <aside class="relative hidden overflow-hidden bg-brand-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div class="pointer-events-none absolute inset-0 bg-pattern opacity-[0.06] invert" />
      <div class="pointer-events-none absolute -right-24 top-1/4 size-96 rounded-full bg-gold-500/20 blur-3xl" />
      <div class="relative flex items-center gap-3">
        <img
          src="/pics/logo.webp"
          alt=""
          width="48"
          height="48"
          class="size-12 rounded-full bg-white p-0.5"
        >
        <span class="font-display text-lg font-bold">SamDU</span>
      </div>
      <div class="relative max-w-md">
        <h1 class="font-display text-4xl font-extrabold leading-tight">
          Sayt kontentini boshqarish paneli
        </h1>
        <p class="mt-4 text-white/70">
          Yangiliklar, e’lonlar, sahifalar, menyu va fayllarni bir joydan, to‘rt tilda boshqaring.
        </p>
      </div>
      <p class="relative text-sm text-white/50">
        © {{ new Date().getFullYear() }} Sharof Rashidov nomidagi Samarqand davlat universiteti
      </p>
    </aside>

    <main class="flex items-center justify-center p-6 sm:p-10">
      <div class="w-full max-w-sm">
        <div class="mb-8 text-center lg:text-left">
          <img
            src="/pics/logo.webp"
            alt="SamDU"
            width="72"
            height="72"
            class="mx-auto mb-5 size-18 rounded-full bg-white p-1 shadow-md ring-1 ring-default lg:hidden"
          >
          <h2 class="font-display text-2xl font-bold text-highlighted">
            Xush kelibsiz
          </h2>
          <p class="mt-1 text-sm text-muted">
            Davom etish uchun hisobingizga kiring
          </p>
        </div>

        <UAlert
          v-if="errorMessage"
          :description="errorMessage"
          color="error"
          variant="subtle"
          icon="i-lucide-circle-alert"
          class="mb-5"
        />

        <UForm
          :state="state"
          :validate="validate"
          class="space-y-5"
          @submit="submit"
        >
          <UFormField
            label="Login"
            name="username"
          >
            <UInput
              v-model="state.username"
              icon="i-lucide-user"
              size="xl"
              autocomplete="username"
              autofocus
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Parol"
            name="password"
          >
            <UInput
              v-model="state.password"
              :type="showPassword ? 'text' : 'password'"
              icon="i-lucide-lock"
              size="xl"
              autocomplete="current-password"
              class="w-full"
              :ui="{ trailing: 'pe-1' }"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  :aria-label="showPassword ? 'Parolni yashirish' : 'Parolni ko‘rsatish'"
                  @click="showPassword = !showPassword"
                />
              </template>
            </UInput>
          </UFormField>
          <UButton
            type="submit"
            block
            size="xl"
            :loading="loading"
            trailing-icon="i-lucide-arrow-right"
          >
            Kirish
          </UButton>
        </UForm>

        <UButton
          to="/"
          variant="link"
          color="neutral"
          icon="i-lucide-arrow-left"
          class="mt-8 px-0"
        >
          Saytga qaytish
        </UButton>
      </div>
    </main>
  </div>
</template>
