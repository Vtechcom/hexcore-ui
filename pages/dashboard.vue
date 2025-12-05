<script lang="ts" setup>
  import type { NodeInfoResponse } from '~/interfaces/api/node-info.type'

  const { data: nodeInfo, status, refresh } = useLazyFetch<NodeInfoResponse>('/api/node-info')

  const hydraNodeStore = useHydraNodeStore()
  const { runningNodes, hydraHeads } = storeToRefs(hydraNodeStore)

  const runningHeads = computed(() => {
    return hydraHeads.value.filter(head => head.status === 'ACTIVE').length
  })
</script>

<template>
  <div class="">
    <base-breadcrumb />

    <el-row :gutter="16" align="top" class="h-30 gap-y-3">
      <el-col :sm="12" :lg="8">
        <el-card class="h-full">
          <div class="text-left">
            <div class="flex items-center text-lg">
              <Icon name="bitcoin-icons:node-hardware-filled" class="mr-2 inline-block" />
              <span> Running nodes</span>
            </div>
            <div class="text-2xl">{{ runningNodes }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :sm="12" :lg="8">
        <el-card class="h-full">
          <div class="text-left">
            <div class="flex items-center text-lg">
              <Icon name="ph:network-bold" class="mr-2 inline-block" />
              <span> Running heads</span>
            </div>
            <div class="text-2xl">{{ runningHeads }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :sm="12" :lg="8">
        <el-card class="h-full">
          <div class="text-left">
            <div class="flex items-center text-lg">
              <Icon name="akar-icons:network" class="mr-2 inline-block" />
              <span> Total heads</span>
            </div>
            <div class="text-2xl">{{ hydraHeads.length }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :md="12" :lg="8">
        <NodeTipInfo :tip="nodeInfo?.data.tip" :loading="status === 'pending'" @refresh="refresh" />
      </el-col>
    </el-row>
    <!-- <HeadStats class="mt-4" /> -->
  </div>
</template>

<style lang="scss" scoped></style>
