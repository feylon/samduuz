export const useDebounced = <T>(source: Ref<T>, delay = 300) => {
  const value = ref(source.value) as Ref<T>
  let timer: ReturnType<typeof setTimeout> | undefined
  watch(source, (next) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      value.value = next
    }, delay)
  })
  onScopeDispose(() => clearTimeout(timer))
  return value
}
