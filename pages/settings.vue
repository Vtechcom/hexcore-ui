<script lang="ts" setup>
  const authStore = useAuthStore()

  const handleSignOut = () => {
    authStore.signOut()
    navigateTo('/login')
  }
</script>

<template>
  <div class="">
    <el-button type="primary" @click="handleSignOut">Sign Out</el-button>
  </div>
</template>

<style lang="scss" scoped></style>
