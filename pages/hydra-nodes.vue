<script lang="ts" setup>
  import CounterCard from '~/components/shared/CounterCard.vue'
  import PopupMonitorHydraNode from '~/components/shared/PopupMonitorHydraNode.vue'
  import type { HydraNode } from '~/interfaces/api/hydra-nodes/hydra-node.type'

  const { data, status } = useLazyFetch<{ data: { data: HydraNode[]; hasNextpage: boolean } }>('/api/nodes', {
    query: {
      page: 1,
      limit: 50
    }
  })
  const nodes = computed(() => data.value?.data.data ?? [])

  const totalNodes = computed(() => nodes.value.length)
  const runningNodes = computed(() => nodes.value.filter(node => node.status === 'ACTIVE').length)
  const availableNodes = computed(() => nodes.value.filter(node => node.status === 'INACTIVE').length)
</script>

<template>
  <div class="">
    <base-breadcrumb :items="[{ text: 'Hydra Nodes', to: '/hydra-nodes' }]" />
    <PopupMonitorHydraNode />
    <el-row :gutter="16" class="gap-y-3">
      <el-col :xs="24" :sm="12" :md="8">
        <CounterCard title="Total nodes" :value="totalNodes" />
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <CounterCard title="Running nodes" :value="runningNodes" />
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <CounterCard title="Available nodes" :value="availableNodes" />
      </el-col>
    </el-row>

    <div v-loading="status === 'pending'" class="min-h-320px mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <HydraNodeCard v-for="node in nodes" :key="node.id" :node="node" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
