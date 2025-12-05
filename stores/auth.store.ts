export const useAuthStore = defineStore('auth', () => {
  const token = useLocalStorage('token', '', {
    flush: 'sync'
  })
  const isAuthenticated = computed(() => !!token.value)
  const userInfo = ref(null)

  async function auth() {
    await $fetch('/api/auth', {
      method: 'GET',
      onResponseError({ response: { _data } }) {
        const { status } = _data
        if (status === 401) {
          signOut()
          navigateTo('/login')
        }
      },
      onResponse({ response: { _data } }) {
        if (_data.data) {
          userInfo.value = _data.data
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
