<script setup lang="ts">
  import { useAccountStore } from '~/stores/account'
  import DrawerSidebar from '~/components/drawers/DrawerSidebar.vue'

  const accountStore = useAccountStore()
  const appVersion = useRuntimeConfig().public.appVersion
  const isOpenSidebar = ref<boolean>(false)
</script>

<template>
  <el-header height="64px" class="fixed left-0 right-0 top-0 z-20 bg-white shadow shadow-md">
    <div class="flex h-full items-center justify-between">
      <div class="flex items-center">
        <img src="/images/logo-hexcore-600x600.png" alt="logo" width="32" height="32" />
        <div class="font-600 ml-2 flex flex-col text-xl">
          <span>Hexcore</span>
          <span class="text-xs text-gray-500">v{{ appVersion }}</span>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <el-button
          :disabled="accountStore.syncingUtxo"
          type="default"
          size="small"
          plain
          @click="accountStore.syncUtxo"
        >
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
        <nuxt-img
          src="/images/default-avatar.png"
          alt="User Avatar"
          width="32"
          height="32"
          class="hidden rounded-full border border-gray-300 sm:block"
        />

        <el-button type="default" class="!sm:hidden !border-none" circle @click.stop="isOpenSidebar = true">
          <icon name="ci:hamburger-md" size="20" />
        </el-button>
      </div>
    </div>
    <DrawerSidebar v-model="isOpenSidebar" class="sm:hidden" />
  </el-header>
</template>

<style lang="scss" scoped></style>
