<script lang="ts" setup>
  import { useAccountStore } from '~/stores/account'
  import { useAuthStore } from '~/stores/auth.store'
  import Header from '~/components/layouts/Header.vue'

  const accountStore = useAccountStore()
  const authStore = useAuthStore()
  const config = useRuntimeConfig()
  const isCollapse = useState<boolean>('collapse-sidebar', () => false)

  const isAuthenticated = computed(() => authStore.isAuthenticated)

  onMounted(async () => {
    if (!isAuthenticated.value) {
      navigateTo('/login')
      return
    } else {
      await authStore.auth()
      await accountStore.getListAccount()
      if (config.public.environment !== 'development') {
        await accountStore.syncUtxo()
      }
    }
  })
</script>

<template>
  <el-container class="min-h-100svh">
    <Header />
    <el-container class="z-10 pt-16">
      <sidebar class="!fixed hidden h-full flex-shrink-0 sm:block" />
      <div :class="isCollapse ? 'w-16' : 'w-50'" class="hidden flex-shrink-0 transition-all duration-500 sm:block" />
      <el-main>
        <slot></slot>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped></style>
