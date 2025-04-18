<script lang="ts" setup>
  const props = withDefaults(
    defineProps<{
      title?: string
      value?: string | number
      size?: 'small' | 'default' | 'large'
      bodyClass?: string
    }>(),
    {
      title: 'Active nodes',
      value: '0',
      size: 'default',
      bodyClass: ''
    }
  )

  const sizeClasses = computed(() => {
    switch (props.size) {
      case 'small':
        return {
          title: 'text-sm',
          value: 'text-xs'
        }
      case 'large':
        return {
          title: 'text-lg',
          value: 'text-3xl'
        }
      default:
        return {
          title: 'text-lg',
          value: 'text-2xl'
        }
    }
  })
</script>

<template>
  <el-card :body-class>
    <div class="text-left">
      <div :class="[sizeClasses.title]">{{ title }}</div>
      <div :class="[sizeClasses.value]">{{ value }}</div>
    </div>
  </el-card>
</template>

<style lang="scss" scoped></style>
