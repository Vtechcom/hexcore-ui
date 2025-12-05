<script setup lang="ts">
  const appVersion = useRuntimeConfig().public.appVersion
</script>

<template>
  <div class="h-screen">
    <el-header height="64px" class="main-header fixed left-0 right-0 top-0">
      <div class="flex h-full items-center justify-between">
        <div class="flex items-center">
          <img src="/images/logo-hexcore-600x600.png" alt="logo" width="32" height="32" />
          <div class="font-600 ml-2 flex flex-col text-xl">
            <span>Hexcore</span>
            <span class="text-xs text-gray-500">v{{ appVersion }}</span>
          </div>
        </div>
      </div>
    </el-header>
    <main class="flex h-full items-center justify-center">
      <slot />
    </main>
  </div>
</template>

<style lang="less" scoped></style>
