<script lang="ts" setup>
  import { ArrowRight } from '@element-plus/icons-vue'

  interface Props {
    items?: Array<{ text: string; to?: string }>
  }

  defineProps<Props>()
</script>

<template>
  <div class="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: 'dashboard' }">Dashboard</el-breadcrumb-item>
      <template v-if="items && Array.isArray(items)">
        <el-breadcrumb-item v-for="(item, index) in items" :key="index" :to="item.to ? { path: item.to } : undefined">{{
          item.text
        }}</el-breadcrumb-item>
      </template>
    </el-breadcrumb>

    <div>
      <slot name="right-content" />
    </div>
  </div>
</template>
