<script lang="ts" setup>
  const props = defineProps<{
    status: 'IDLE' | 'ACTIVE' | 'INACTIVE'
  }>()

  const statusText = computed(() => {
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
    switch (props.status) {
      case 'IDLE':
        return {
          class: 'bg-gray-4',
          tagType: 'info'
        }
      case 'ACTIVE':
        return {
          class: 'bg-green-4',
          tagType: 'success'
        }
      case 'INACTIVE':
        return {
          class: 'bg-yellow-4',
          tagType: 'warning'
        }
      default:
        return {
          class: 'bg-blue-4',
          tagType: 'info'
        }
    }
  })
</script>

<template>
  <el-tag :type="statusScheme.tagType">
    <div class="flex items-center">
      <span class="size-2 rounded-full" :class="[statusScheme.class]"></span>
      <span class="ml-2">{{ statusText }}</span>
    </div>
  </el-tag>
</template>

<style lang="scss" scoped></style>
