export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('>>> / to:', to)
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated && to.path !== '/login') {
    ElMessage.error('Please login to continue')
    return navigateTo('/login')
  }
})
