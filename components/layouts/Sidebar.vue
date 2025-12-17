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
      title: 'Hydra Heads',
      icon: 'ic:round-account-tree',
      route: '/hydra-heads'
    },
    {
      id: 6,
      title: 'Settings',
      icon: 'ic:round-settings',
      route: '/settings'
    }
  ])

  const emit = defineEmits<{
    (event: 'clickItem'): void
  }>()

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
    class="el-menu-vertical-demo !border-none"
    :default-active="defaultActive"
    :collapse="isCollapse"
    router
    @open="handleOpen"
    @close="handleClose"
  >
    <el-menu-item
      v-for="item in menuItems"
      :key="item.id"
      :index="item.title"
      :route="item.route"
      @click="emit('clickItem')"
    >
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
