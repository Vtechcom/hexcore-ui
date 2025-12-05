<script lang="ts" setup>
  const authStore = useAuthStore()
  const modelValue = defineModel<boolean>({ default: false })

  const handleSignOut = () => {
    authStore.signOut()
    navigateTo('/login')
  }
</script>

<template>
  <el-drawer v-model="modelValue" class="relative" size="auto" show-close :with-header="false">
    <div class="flex flex-col gap-3">
      <div class="flex items-center gap-2">
        <nuxt-img
          sizes="32"
          src="/images/default-avatar.png"
          alt="User Avatar"
          class="rounded-full border border-gray-300"
        />
        <span>Quoc Huy</span>
      </div>
      <sidebar @click-item="modelValue = false" />
      <div class="text-center">
        <el-button type="danger" @click="handleSignOut">Sign Out</el-button>
      </div>
    </div>
    <icon
      name="ic:round-close"
      size="18"
      class="absolute right-3 top-3 text-gray-500 hover:cursor-pointer"
      @click.stop="modelValue = false"
    />
  </el-drawer>
</template>

<style lang="scss" scoped>
  :deep(.el-drawer__header) {
    margin-bottom: 0 !important;
  }
</style>
