<script lang="ts" setup>
  import CounterCard from '~/components/shared/CounterCard.vue'
  import type { HydraNode } from '~/interfaces/api/hydra-nodes/hydra-node.type'

  const { data, status } = useLazyFetch<{ data: { data: HydraNode[]; hasNextpage: boolean } }>('/api/nodes/list', {
    query: {
      page: 1,
      limit: 10
    }
  })
  const nodes = computed(() => data.value?.data.data ?? [])
</script>

<template>
  <div class="">
    <el-row :gutter="16" class="h-30">
      <el-col :span="8" class="">
        <CounterCard title="Total nodes" :value="0" />
      </el-col>
      <el-col :span="8" class="">
        <CounterCard title="Running nodes" :value="0" />
      </el-col>
      <el-col :span="8" class="">
        <CounterCard title="Available nodes" :value="0" />
      </el-col>
    </el-row>
    <div class="mt-8">
      <div class="flex justify-between">
        <div class=""></div>
        <div class="flex">
          <el-button type="primary"> Create </el-button>
        </div>
      </div>
    </div>
    <div v-loading="status === 'pending'" class="min-h-320px mt-4 grid grid-cols-2 gap-4 xl:grid-cols-3">
      <HydraNodeCard v-for="node in nodes" :key="node.id" :node="node" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
