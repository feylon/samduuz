export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | null = null

  if (import.meta.client && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('reveal-ready')
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-visible')
        observer?.unobserve(entry.target)
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
  }

  nuxtApp.vueApp.directive<HTMLElement, number | undefined>('reveal', {
    getSSRProps: () => ({ 'data-reveal': '' }),
    mounted(el, binding) {
      el.dataset.reveal = ''
      if (binding.value) el.style.setProperty('--reveal-delay', `${binding.value}ms`)
      if (observer) observer.observe(el)
      else el.classList.add('is-visible')
    },
    unmounted(el) {
      observer?.unobserve(el)
    }
  })
})
