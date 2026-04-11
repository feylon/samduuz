export const useJsonLd = (schema: MaybeRefOrGetter<Record<string, unknown> | null | undefined>, key = 'json-ld') => {
  useHead({
    script: [
      {
        key,
        type: 'application/ld+json',
        innerHTML: computed(() => {
          const value = toValue(schema)
          return value ? JSON.stringify({ '@context': 'https://schema.org', ...value }) : ''
        })
      }
    ]
  })
}
