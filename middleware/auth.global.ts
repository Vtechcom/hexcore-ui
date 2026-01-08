export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()
  const whitelist = ['/login', '/auth', '/test']
  if (!authStore.isAuthenticated && !whitelist.includes(to.path)) {
    ElMessage.error('Please login to continue')
    return navigateTo('/login')
  }
})
