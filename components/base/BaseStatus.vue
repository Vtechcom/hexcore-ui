<script lang="ts" setup>
  const props = defineProps<{
    status: 'IDLE' | 'ACTIVE' | 'INACTIVE' | 'UNKNOWN'
    statusText?: string
    size?: 'small' | 'default' | 'large'
  }>()

  const statusText = computed(() => {
    if (props.statusText) {
      return props.statusText
    }
    switch (props.status) {
      case 'IDLE':
        return 'Idle'
      case 'ACTIVE':
        return 'Active'
      case 'INACTIVE':
        return 'Inactive'
      default:
        return 'Unknown'
    }
  })
  type StatusScheme = {
    class: string
    tagType: 'info' | 'success' | 'danger' | 'warning'
  }
  const statusScheme = computed<StatusScheme>(() => {
    const sizeClass = props.size === 'small' ? 'size-6px' : props.size === 'large' ? 'size-10px' : ''
    switch (props.status) {
      case 'IDLE':
        return {
          class: `bg-gray-4 ${sizeClass}`,
          tagType: 'info'
        }
      case 'ACTIVE':
        return {
          class: `bg-green-4 ${sizeClass}`,
          tagType: 'success'
        }
      case 'INACTIVE':
        return {
          class: `bg-yellow-4 ${sizeClass}`,
          tagType: 'warning'
        }
      default:
        return {
          class: `bg-blue-4 ${sizeClass}`,
          tagType: 'info'
        }
    }
  })
</script>

<template>
  <el-tag :type="statusScheme.tagType" :size="props.size || 'default'">
    <div class="flex items-center">
      <span class="size-2 rounded-full" :class="[statusScheme.class]"></span>
      <span class="ml-2" :class="{ 'text-10px': props.size === 'small', 'text-12px': props.size === 'large' }">{{
        statusText
      }}</span>
    </div>
  </el-tag>
</template>

<style lang="scss" scoped></style>
