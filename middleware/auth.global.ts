export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('>>> / to:', to)
  const authStore = useAuthStore()
  const whitelist = ['/login', '/auth', '/test']
  if (!authStore.isAuthenticated && !whitelist.includes(to.path)) {
    ElMessage.error('Please login to continue')
    return navigateTo('/login')
  }
})
