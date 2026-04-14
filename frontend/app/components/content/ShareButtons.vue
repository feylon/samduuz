<script setup lang="ts">
const props = defineProps<{ title: string, url: string }>()

const toast = useToast()
const { t } = useI18n()

const encoded = computed(() => ({
  url: encodeURIComponent(props.url),
  title: encodeURIComponent(props.title)
}))

const targets = computed(() => [
  { label: 'Telegram', icon: 'i-simple-icons-telegram', href: `https://t.me/share/url?url=${encoded.value.url}&text=${encoded.value.title}` },
  { label: 'Facebook', icon: 'i-simple-icons-facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encoded.value.url}` },
  { label: 'X', icon: 'i-simple-icons-x', href: `https://x.com/intent/post?url=${encoded.value.url}&text=${encoded.value.title}` }
])

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(props.url)
    toast.add({ title: t('content.link_copied'), icon: 'i-lucide-check', color: 'success' })
  } catch {
    window.prompt(t('content.copy_link'), props.url)
  }
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <span class="mr-1 text-sm font-medium text-muted">{{ $t('content.share') }}:</span>
    <UButton
      v-for="target in targets"
      :key="target.label"
      :to="target.href"
      target="_blank"
      :icon="target.icon"
      color="neutral"
      variant="soft"
      size="sm"
      :aria-label="target.label"
    />
    <UButton
      icon="i-lucide-link"
      color="neutral"
      variant="soft"
      size="sm"
      :aria-label="$t('content.copy_link')"
      @click="copyLink"
    />
  </div>
</template>
