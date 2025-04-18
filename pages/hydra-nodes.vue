<script lang="ts" setup>
  import CounterCard from '~/components/shared/CounterCard.vue'
  import PopupCreateHydraNode from '~/components/shared/PopupCreateHydraNode.vue'
  import PopupMonitorHydraNode from '~/components/shared/PopupMonitorHydraNode.vue'
  import type { HydraNode } from '~/interfaces/api/hydra-nodes/hydra-node.type'

  const { data, status, refresh } = useLazyFetch<{ data: { data: HydraNode[]; hasNextpage: boolean } }>(
    '/api/nodes/list',
    {
      query: {
        page: 1,
        limit: 50
      }
    }
  )
  const nodes = computed(() => data.value?.data.data ?? [])

  const totalNodes = computed(() => nodes.value.length)
  const runningNodes = computed(() => nodes.value.filter(node => node.status === 'ACTIVE').length)
  const availableNodes = computed(() => nodes.value.filter(node => node.status === 'INACTIVE').length)

  function handleCreateSuccess() {
    refresh()
  }
</script>

<template>
  <div class="">
    <PopupCreateHydraNode @success="handleCreateSuccess" />
    <PopupMonitorHydraNode />
    <el-row :gutter="16" class="h-30">
      <el-col :span="8" class="">
        <CounterCard title="Total nodes" :value="totalNodes" />
      </el-col>
      <el-col :span="8" class="">
        <CounterCard title="Running nodes" :value="runningNodes" />
      </el-col>
      <el-col :span="8" class="">
        <CounterCard title="Available nodes" :value="availableNodes" />
      </el-col>
    </el-row>
    <div class="mt-8">
      <div class="flex justify-between">
        <div class=""></div>
        <div class="flex">
          <el-button type="primary" @click="usePopupState(Popup.POPUP_CREATE_HYDRA_NODE, 'open')"> Create </el-button>
        </div>
      </div>
    </div>
    <div v-loading="status === 'pending'" class="min-h-320px mt-4 grid grid-cols-2 gap-4 xl:grid-cols-3">
      <HydraNodeCard v-for="node in nodes" :key="node.id" :node="node" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
