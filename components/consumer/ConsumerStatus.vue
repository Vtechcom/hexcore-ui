<script lang="ts" setup>
  const props = withDefaults(
    defineProps<{
      status?: 'ACTIVE' | 'INACTIVE' | 'REQUESTED' | 'BLOCKED' | ''
    }>(),
    {
      status: ''
    }
  )

  const status = computed(() => {
    switch (props.status) {
      case 'ACTIVE':
        return 'ACTIVE'
      case 'INACTIVE':
        return 'INACTIVE'
      case 'REQUESTED':
        return 'IDLE'
      case 'BLOCKED':
        return 'INACTIVE'
      default:
        return 'UNKNOWN'
    }
  })

  const statusText = computed(() => {
    switch (props.status) {
      case 'ACTIVE':
        return 'Active'
      case 'INACTIVE':
        return 'Inactive'
      case 'REQUESTED':
        return 'Requested'
      case 'BLOCKED':
        return 'Blocked'
      default:
        return 'Unknown'
    }
  })
</script>

<template>
  <BaseStatus :status="status" :status-text="statusText" />
</template>
