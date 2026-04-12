<script setup lang="ts">
const props = defineProps<{
  link: string | null
  isExternal?: boolean
}>()

const localePath = useLocalePath()

const target = computed(() => {
  if (!props.link) return null
  if (props.isExternal || /^https?:\/\//.test(props.link)) return { href: props.link, external: true }
  return { href: localePath(props.link), external: false }
})
</script>

<template>
  <a
    v-if="target?.external"
    :href="target.href"
    target="_blank"
    rel="noopener noreferrer"
  >
    <slot />
  </a>
  <NuxtLink v-else-if="target" :to="target.href">
    <slot />
  </NuxtLink>
  <span v-else>
    <slot />
  </span>
</template>
