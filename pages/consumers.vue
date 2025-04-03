<script lang="ts" setup>
  const consumers = ref([])
  const loading = ref(false)

  const fetchConsumers = async () => {
    try {
      loading.value = true
      const response = await $fetch('/api/consumer/list')
      consumers.value = response.data
    } catch (error) {
      ElMessage.error('Failed to fetch consumers')
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

    <el-table v-loading="loading" :data="consumers" border stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="address" label="Address">
        <template #default="{ row }">
          <el-tooltip :content="row.address" placement="top">
            <span class="text-sm">
              {{ formatId(row.address, 10, 10) }}
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="Status" width="120" align="center">
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
    @apply p-4;
  }
</style>
