<script lang="ts" setup>
  import { useAccountStore } from '~/stores/account'

  const accountStore = useAccountStore()
  onMounted(() => {
    accountStore.getListAccount()
  })
</script>

<template>
  <el-container class="min-h-100svh">
    <el-header height="64px" class="main-header">
      <div class="flex h-full items-center justify-between">
        <div class="flex items-center">
          <img src="/images/logo-hexcore-600x600.png" alt="logo" width="32" height="32" />
          <div class="font-600 ml-2 text-xl">Hexcore</div>
        </div>
        <div class="flex items-center">
          <span v-if="accountStore.syncingUtxo" class="mr-2 text-xs text-green-500">Syncing UTxO</span>
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
