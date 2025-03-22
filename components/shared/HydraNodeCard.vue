<script lang="ts" setup>
  import type { HydraNode } from '~/interfaces/api/hydra-nodes/hydra-node.type'

  const props = defineProps<{
    node: HydraNode
  }>()
</script>

<template>
  <el-card>
    <div class="flex justify-between">
      <BaseStatus />
      <icon name="ic:round-delete-sweep" size="24" />
    </div>
    <div class="mt-4">
      <div class="flex items-center">
        <span class="text-gray-6 text-sm-bold">Port:</span>
        <span class="text-sm-bold ml-2">{{ props.node.port }}</span>
      </div>
      <div class="mt-2 flex items-center">
        <span class="text-gray-6 text-sm-bold">Host:</span>
        <span class="text-sm-bold ml-2">{{ 'default' }}</span>
      </div>
      <div class="mt-2 flex items-center">
        <span class="text-gray-6 text-sm-bold">Description:</span>
        <span class="text-sm-bold ml-2">{{ props.node.description }}</span>
      </div>
    </div>
  </el-card>
</template>

<style lang="scss" scoped></style>
