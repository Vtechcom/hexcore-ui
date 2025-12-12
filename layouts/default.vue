<script lang="ts" setup>
  import { useAccountStore } from '~/stores/account'
  import { useAuthStore } from '~/stores/auth.store'
  import Header from '~/components/layouts/Header.vue'

  const accountStore = useAccountStore()
  const authStore = useAuthStore()

  const isAuthenticated = computed(() => authStore.isAuthenticated)

  onMounted(async () => {
    if (!isAuthenticated.value) {
      navigateTo('/login')
      return
    } else {
      await authStore.auth()
      await accountStore.getListAccount()
      await accountStore.syncUtxo()
    }
  })
</script>

<template>
  <el-container class="min-h-100svh">
    <Header />

    <el-container class="z-10 pt-16">
      <el-aside class="hidden sm:block" width="200px">
        <sidebar />
      </el-aside>
      <el-main>
        <slot></slot>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped></style>
