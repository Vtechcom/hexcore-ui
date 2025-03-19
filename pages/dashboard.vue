<script lang="ts" setup>
  import type { NodeInfoResponse } from '~/interfaces/api/node-info.type'

  const { data: nodeInfo, status, refresh } = useLazyFetch<NodeInfoResponse>('/api/node-info')
</script>

<template>
  <div class="">
    <el-row :gutter="16" class="h-30">
      <el-col :span="8" class="">
        <el-card class="h-full">
          <div class="text-left">
            <div class="text-lg">Active nodes</div>
            <div class="text-2xl">{{ 0 }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" class="">
        <el-card class="h-full">
          <div class="text-left">
            <div class="text-lg">Active parties</div>
            <div class="text-2xl">{{ 0 }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" class="">
        <el-card class="h-full">
          <div class="text-left">
            <div class="text-lg">Total parties</div>
            <div class="text-2xl">{{ 0 }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <NodeTipInfo class="mt-4" :tip="nodeInfo?.data.tip" :loading="status === 'pending'" @refresh="refresh" />
  </div>
</template>

<style lang="scss" scoped></style>
