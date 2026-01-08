<script lang="ts" setup>
  import type { NodeInfoResponse } from '~/interfaces/api/node-info.type'

  const { data: nodeInfo, status, refresh } = useLazyFetch<NodeInfoResponse>('/api/node-info')

  const hydraNodeStore = useHydraNodeStore()
  const { totalNodes, runningNodes, totalHeads, activeHeads } = storeToRefs(hydraNodeStore)

  const series = ref([
    {
      name: 'uat-server (asia-southeast1-b)',
      data: [
        [new Date('2025-12-17T10:30:00').getTime(), 7.5],
        [new Date('2025-12-17T10:35:00').getTime(), 8.2],
        [new Date('2025-12-17T10:40:00').getTime(), 7.8],
        [new Date('2025-12-17T10:45:00').getTime(), 9.1],
        [new Date('2025-12-17T10:50:00').getTime(), 11.5],
        [new Date('2025-12-17T10:55:00').getTime(), 10.8],
        [new Date('2025-12-17T11:00:00').getTime(), 8.9],
        [new Date('2025-12-17T11:05:00').getTime(), 7.2],
        [new Date('2025-12-17T11:10:00').getTime(), 8.0]
      ]
    }
  ])

  const seriesNetwork = ref([
    {
      ...series.value[0]
    },
    {
      name: 'uat-server (asia-southeast1-b) - Sent',
      data: [
        [new Date('2025-12-17T10:30:00').getTime(), 6.4],
        [new Date('2025-12-17T10:35:00').getTime(), 7.9],
        [new Date('2025-12-17T10:40:00').getTime(), 9.6],
        [new Date('2025-12-17T10:45:00').getTime(), 8.2],
        [new Date('2025-12-17T10:50:00').getTime(), 10.1],
        [new Date('2025-12-17T10:55:00').getTime(), 11.7],
        [new Date('2025-12-17T11:00:00').getTime(), 10.4],
        [new Date('2025-12-17T11:05:00').getTime(), 8.8],
        [new Date('2025-12-17T11:10:00').getTime(), 7.5]
      ]
    }
  ])
</script>

<template>
  <base-breadcrumb />
  <div class="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
    <div class="order-last col-span-1 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:order-first lg:col-span-2">
      <base-line-chart title="CPU Utilization (Top 5 VMs)" :series="series" class="col-span-2 lg:col-span-1" />
      <base-line-chart title="Memory Utilization (Top 5 VMs)" :series="series" class="col-span-2 lg:col-span-1" />
      <base-line-chart title="Disk Utilization (Top 5 VMs)" :series="series" class="col-span-2 lg:col-span-1" />
      <base-line-chart
        title="Network Traffic (Top 3 Sent/Received)"
        :series="seriesNetwork"
        class="col-span-2 lg:col-span-1"
      />
    </div>
    <el-row :gutter="16" align="top" class="col-span-1 gap-y-3">
      <el-col :sm="12" :md="24" :lg="12">
        <el-card class="h-full">
          <div class="text-left">
            <div class="text-md-medium flex items-center">
              <Icon name="bitcoin-icons:node-hardware-filled" class="mr-1 inline-block" />
              <span> Total nodes</span>
            </div>
            <div class="text-2xl">{{ totalNodes }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :sm="12" :md="24" :lg="12">
        <el-card class="h-full">
          <div class="text-left">
            <div class="text-md-medium flex items-center">
              <Icon name="bitcoin-icons:node-hardware-filled" class="mr-1 inline-block" />
              <span> Running nodes</span>
            </div>
            <div class="text-2xl">{{ runningNodes }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :sm="12" :md="24" :lg="12">
        <el-card class="h-full">
          <div class="text-left">
            <div class="text-md-medium flex items-center">
              <Icon name="ph:network-bold" class="mr-1 inline-block" />
              <span> Running heads</span>
            </div>
            <div class="text-2xl">{{ activeHeads }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :sm="12" :md="24" :lg="12">
        <el-card class="h-full">
          <div class="text-left">
            <div class="text-md-medium flex items-center">
              <Icon name="akar-icons:network" class="mr-1 inline-block" />
              <span> Total heads</span>
            </div>
            <div class="text-2xl">{{ totalHeads }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :md="24" :lg="24">
        <NodeTipInfo :tip="nodeInfo?.data.tip" :loading="status === 'pending'" @refresh="refresh" />
      </el-col>
    </el-row>
    <!-- <HeadStats class="mt-4" /> -->
  </div>
</template>

<style lang="scss" scoped></style>
