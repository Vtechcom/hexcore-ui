<script lang="ts" setup>
  const menuItems = ref([
    {
      id: 1,
      title: 'Dashboard',
      icon: 'ic:round-dashboard',
      route: '/dashboard'
    },
    {
      id: 2,
      title: 'Wallet Accounts',
      icon: 'ic:baseline-account-balance-wallet',
      route: '/wallet-accounts'
    },
    {
      id: 3,
      title: 'Hydra Nodes',
      icon: 'ic:round-bubble-chart',
      route: '/hydra-nodes'
    },
    {
      id: 4,
      title: 'Hydra Parties',
      icon: 'ic:round-account-tree',
      route: '/hydra-parties'
    },
    {
      id: 5,
      title: 'Consumers',
      icon: 'ic:round-person',
      route: '/consumers'
    },
    {
      id: 6,
      title: 'Settings',
      icon: 'ic:round-settings',
      route: '/settings'
    }
  ])

  const isCollapse = ref(false)
  const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }
  const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }

  const defaultActive = computed(() => {
    return menuItems.value.find(item => item.route === useRoute().path)?.title
  })
</script>

<template>
  <el-menu
    :default-active="defaultActive"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    router
    @open="handleOpen"
    @close="handleClose"
  >
    <!-- <el-sub-menu index="1">
      <template #title>
        <el-icon><location /></el-icon>
        <span>Navigator One</span>
      </template>
      <el-menu-item-group>
        <template #title><span>Group One</span></template>
        <el-menu-item index="1-1">item one</el-menu-item>
        <el-menu-item index="1-2">item two</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="Group Two">
        <el-menu-item index="1-3">item three</el-menu-item>
      </el-menu-item-group>
      <el-sub-menu index="1-4">
        <template #title><span>item four</span></template>
        <el-menu-item index="1-4-1">item one</el-menu-item>
      </el-sub-menu>
    </el-sub-menu> -->
    <el-menu-item v-for="item in menuItems" :key="item.id" :index="item.title" :route="item.route">
      <icon :name="item.icon" size="24" class="mr-2" />
      <template #title>{{ item.title }}</template>
    </el-menu-item>
  </el-menu>
</template>

<style lang="scss" scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
    height: 100%;
  }
</style>
