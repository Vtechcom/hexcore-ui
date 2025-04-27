export const useAuthStore = defineStore('auth', () => {
  const token = useLocalStorage('token', '', {
    flush: 'sync'
  })
  const isAuthenticated = computed(() => !!token.value)

  async function auth() {
    await $fetch('/api/auth', {
      method: 'GET',
      onResponseError({ response: { _data } }) {
        const { status } = _data
        if (status === 401) {
          signOut()
          navigateTo('/login')
        }
      }
    })
  }

  function signIn(_token: string) {
    token.value = _token
  }

  function signOut() {
    token.value = ''
  }

  return { token, isAuthenticated, signIn, signOut, auth }
})
