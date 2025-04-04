<script lang="ts" setup>
  import type { Consumer } from '~/interfaces/api/consumer/consumer.type'

  const consumers = ref<Consumer[]>([])
  const loading = ref(false)
  const statusFilterOptions = ref<{ text: string; value: string }[]>([
    { text: 'All', value: 'all' },
    { text: 'Active', value: 'ACTIVE' },
    { text: 'Inactive', value: 'INACTIVE' },
    { text: 'Blocked', value: 'BLOCKED' },
    { text: 'Requested', value: 'REQUESTED' },
    { text: 'Rejected', value: 'REJECTED' }
  ])

  const filterStatusMethod = (value: string, row: Consumer) => {
    return row.status === value
  }

  const fetchConsumers = async () => {
    try {
      loading.value = true
      const response = await $fetch<{ data: Consumer[] }>('/api/consumer/list')
      consumers.value = response.data
    } catch (error: any) {
      ElMessage.error(error?.data?.message || 'Failed to fetch consumers')
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchConsumers()
  })
</script>

<template>
  <div class="consumers-page">
    <div class="mb-4 flex items-center justify-between">
      <h1 class="m0 text-2xl font-semibold">Consumers</h1>
      <el-button type="primary" size="small" @click="fetchConsumers">
        <icon name="ic:refresh" class="mr-1" />
        Refresh
      </el-button>
    </div>

    <el-table v-loading="loading" :data="consumers" stripe row-key="id" lazy>
      <el-table-column width="80" type="expand">
        <template #default="{ row }">
          <consumer-expand-row :consumer="row" />
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="address" label="Address">
        <template #default="{ row }">
          <el-tooltip :content="row.address" placement="top">
            <span class="text-sm">
              {{ formatId(row.address, 14, 18) }}
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="Status"
        width="120"
        align="center"
        :filters="statusFilterOptions"
        :filter-method="filterStatusMethod"
      >
        <template #default="{ row }">
          <consumer-status :status="row.status" />
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="Created At" align="right" width="160">
        <template #default="{ row }">
          <span class="text-sm">
            {{ useDateFormat(row.createdAt, 'YYYY-MM-DD HH:mm:ss').value }}
          </span>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="No consumers found" />
      </template>
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
  .consumers-page {
    @apply p-0;
  }
</style>
