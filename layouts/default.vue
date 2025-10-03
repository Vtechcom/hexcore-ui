<script lang="ts" setup>
  import { useAccountStore } from '~/stores/account'
  import { useAuthStore } from '~/stores/auth.store'

  const accountStore = useAccountStore()
  const authStore = useAuthStore()

  const isAuthenticated = computed(() => authStore.isAuthenticated)

  const appVersion = useRuntimeConfig().public.appVersion

  onMounted(async () => {
    if (!isAuthenticated.value) {
      navigateTo('/login')
      return
    } else {
      await authStore.auth()

      accountStore.getListAccount()
    }
  })
</script>

<template>
  <el-container class="min-h-100svh">
    <el-header height="64px" class="main-header">
      <div class="flex h-full items-center justify-between">
        <div class="flex items-center">
          <img src="/images/logo-hexcore-600x600.png" alt="logo" width="32" height="32" />
          <div class="font-600 ml-2 flex flex-col text-xl">
            <span>Hexcore</span>
            <span class="text-xs text-gray-500">v{{ appVersion }}</span>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <el-button type="default" size="small" plain @click="accountStore.syncUtxo">
            <icon
              v-if="accountStore.syncingUtxo"
              name="ic:round-refresh"
              size="16"
              class="mr-2 animate-spin text-green-500"
            />
            <span class="text-xs text-green-500">
              {{ accountStore.syncingUtxo ? 'Syncing UTxO' : 'Sync UTxO' }}
            </span>
          </el-button>
          <icon name="ic:round-settings" size="24" />
        </div>
      </div>
    </el-header>
    <el-container class="z-10">
      <el-aside width="200px">
        <sidebar />
      </el-aside>
      <el-main>
        <slot></slot>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
  .main-header {
    @apply z-20 shadow shadow-md;
  }
</style>
