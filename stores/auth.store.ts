export const useAuthStore = defineStore('auth', () => {
  const token = useLocalStorage('token', '', {
    flush: 'sync'
  })
  const isAuthenticated = computed(() => !!token.value)

  async function auth() {
    const rs = await $fetch('/api/auth', {
      method: 'GET'
    })
    console.log('>>> / rs:', rs)
  }

  function signIn(_token: string) {
    token.value = _token
  }

  function signOut() {
    token.value = ''
  }

  return { token, isAuthenticated, signIn, signOut, auth }
})
