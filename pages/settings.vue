<script lang="ts" setup>
  const authStore = useAuthStore()

  const handleSignOut = () => {
    authStore.signOut()
    navigateTo('/login')
  }
</script>

<template>
  <div>
    <base-breadcrumb :items="[{ text: 'Settings', to: '/settings' }]" />
    <el-button type="primary" @click="handleSignOut">Sign Out</el-button>
  </div>
</template>

<style lang="scss" scoped></style>
