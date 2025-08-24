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
    <el-row :gutter="16" class="h-30">
      <el-col :span="8" class="">
        <el-card class="h-full">
          <div class="text-left">
            <div class="text-lg">Running nodes</div>
            <div class="text-2xl">{{ runningNodes }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" class="">
        <el-card class="h-full">
          <div class="text-left">
            <div class="text-lg">Running heads</div>
            <div class="text-2xl">{{ runningHeads }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" class="">
        <el-card class="h-full">
          <div class="text-left">
            <div class="text-lg">Total heads</div>
            <div class="text-2xl">{{ hydraHeads.length }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <NodeTipInfo class="mt-4" :tip="nodeInfo?.data.tip" :loading="status === 'pending'" @refresh="refresh" />
    <!-- <HeadStats class="mt-4" /> -->
  </div>
</template>

<style lang="scss" scoped></style>
