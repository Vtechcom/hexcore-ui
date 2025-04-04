export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.directive('copy', {
    mounted(el: HTMLElement, binding) {
      el.addEventListener('click', () => {
        const text = binding.value
        navigator.clipboard.writeText(text).then(
          () => {
            ElMessage({
              message: 'Copied to clipboard',
              type: 'success',
              duration: 1000
            })
          },
          err => {
            console.warn('Directive error:', err)

            // Error callback (optional)
          }
        )
      })
    },
    getSSRProps(binding, vnode) {
      // you can provide SSR-specific props here
      return {}
    }
  })
})
