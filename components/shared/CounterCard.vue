<script lang="ts" setup>
  const props = withDefaults(
    defineProps<{
      title?: string
      value?: string | number
    }>(),
    {
      title: 'Active nodes',
      value: '0'
    }
  )
</script>

<template>
  <el-card>
    <div class="text-left">
      <div class="text-lg">{{ title }}</div>
      <div class="text-2xl">{{ value }}</div>
    </div>
  </el-card>
</template>

<style lang="scss" scoped></style>
