<script lang="ts" setup>
  import type { HydraHead } from '~/interfaces/api/hydra-nodes/hydra-heads.type'
  import HeadVisualizeClient from './HeadVisualize.client.vue'

  const props = defineProps<{
    head: HydraHead
  }>()

  const emits = defineEmits<{
    refresh: []
  }>()

  const activating = ref(false)
  const handleActivate = async () => {
    if (disableAction.value) {
      ElMessage.warning('Please add more nodes to the head')
      return
    }

    try {
      activating.value = true
      await $fetch('/api/nodes/active-party', {
        method: 'POST',
        body: { id: props.head.id }
      })
    } catch (err: any) {
      console.log('>>> / err:', err)

      ElMessage.error('Failed to activate Hydra head')
      activating.value = false
    } finally {
      setTimeout(() => {
        ElMessage.success('Hydra head activated successfully')
        activating.value = false
        emits('refresh')
      }, 8000)
    }
  }

  const onDeactivating = ref(false)
  const handleDeactivateHead = async () => {
    try {
      onDeactivating.value = true
      await $fetch('/api/nodes/deactive-head', {
        method: 'POST',
        body: { id: props.head.id }
      })
      setTimeout(() => {
        ElMessage.success('Hydra head deactivated successfully')
        onDeactivating.value = false
        emits('refresh')
      }, 3000)
    } catch (error) {
      console.log('>>> / error:', error)
      ElMessage.error('Failed to deactivate Hydra head')
      onDeactivating.value = false
    }
  }

  const onClearing = ref(false)
  const handleClearPersistence = async () => {
    try {
      onClearing.value = true
      await $fetch('/api/nodes/clear-head-persistences', {
        method: 'POST',
        body: { ids: [props.head.id] }
      })
      setTimeout(() => {
        ElMessage.success('Hydra head cleared successfully')
        onClearing.value = false
        emits('refresh')
      }, 3000)
    } catch (error) {
      console.log('>>> / error:', error)
      ElMessage.error('Failed to deactivate Hydra head')
      onClearing.value = false
    }
  }

  const disableAction = computed(() => {
    return props.head.hydraNodes.length < props.head.nodes || activating.value
  })

  const status = computed(() => {
    if (activating.value) {
      return 'UNKNOWN'
    }
    if (props.head.status === 'ACTIVE') {
      return 'ACTIVE'
    }
    return 'IDLE'
  })
</script>

<template>
  <el-card class="!overflow-unset relative w-full">
    <div class="rounded-1 bg-blue-2 absolute -top-3 left-1 min-w-10 shadow-sm">
      <p class="m-0 px-1 text-center text-base">#{{ head.id }}</p>
    </div>
    <div class="flex items-center justify-between">
      <base-status :status="status" />
      <div class="flex space-x-1">
        <div
          class="border-gray-3 rounded-1 flex items-center border border-solid"
          :class="{ 'opacity-50': disableAction }"
        >
          <el-button
            text
            plain
            :disabled="disableAction"
            size="small"
            class="hover:text-gray-6 !m-0 !px-2 hover:cursor-pointer"
            @click="handleActivate"
          >
            <icon name="ic:round-refresh" class="" :class="{ 'animate-spin': activating }" />
          </el-button>
          <el-button
            text
            plain
            :disabled="disableAction || head.status === 'ACTIVE'"
            size="small"
            class="!m-0 !px-2 hover:cursor-pointer"
            :class="[head.status === 'ACTIVE' ? 'hover:!text-error-400' : 'hover:!text-green-400']"
            @click="handleActivate"
          >
            <icon name="ic:round-play-arrow" class="text-inherit" />
          </el-button>
        </div>
        <div
          class="border-gray-3 rounded-1 flex items-center border border-solid"
          :class="{ 'opacity-50': disableAction }"
        >
          <el-popover
            placement="bottom-end"
            title=""
            width="auto"
            trigger="hover"
            popper-class="!p-2 !rounded-2 !min-w-unset"
          >
            <template #reference>
              <el-button
                text
                plain
                :disabled="disableAction"
                size="small"
                class="hover:text-gray-6 !m-0 !px-2 hover:cursor-pointer"
                @click="null"
              >
                <icon name="ic:round-more-vert" class="" />
              </el-button>
            </template>
            <div class="flex flex-col gap-2">
              <div class="text-xs font-semibold">More actions</div>
              <el-button
                type="danger"
                plain
                :disabled="disableAction || onDeactivating || head.status !== 'ACTIVE'"
                size="small"
                class="hover:text-gray-6 !m-0 !px-2 hover:cursor-pointer"
                :loading="onDeactivating"
                @click="handleDeactivateHead"
              >
                <div class="w-25 mr-1">Stop</div>
                <icon name="ic:round-stop-circle" class="" v-if="!onDeactivating" />
              </el-button>
              <el-button
                type="danger"
                plain
                :disabled="disableAction"
                size="small"
                class="hover:text-gray-6 !m-0 !px-2 hover:cursor-pointer"
                :loading="onClearing"
                @click="handleClearPersistence"
              >
                <div class="w-25 mr-1">Clear persistences</div>
                <icon name="ic:round-cleaning-services" class="" v-if="!onClearing" />
              </el-button>
            </div>
          </el-popover>
        </div>
      </div>
    </div>

    <div class="text-gray-7 mt-4 flex items-center justify-between">
      <div class="flex items-center space-x-1 text-sm">
        <icon name="ic:round-bubble-chart" class="size-4" />

        <div class="font-600">{{ head.nodes }}</div>
      </div>
      <div class="flex items-center space-x-1 text-sm">
        <icon name="ic:round-timelapse" class="size-4" />
        <el-tooltip>
          <template #content>
            <div class="text-sm">Created at: {{ useDateFormat(head.createdAt, 'DD/MM/YYYY hh:mm:ss A') }}</div>
          </template>
          <div class="font-600 underline-dashed underline-gray-7 underline hover:cursor-pointer">
            {{ useTimeAgo(head.createdAt, { showSecond: false }) }}
          </div>
        </el-tooltip>
      </div>
    </div>
    <div class="text-gray-7 mb-2 text-sm">Hydra Nodes</div>
    <el-tabs type="border-card" model-value="visualize">
      <el-tab-pane label="Visualize" class="!p-0" name="visualize" lazy>
        <div v-if="head.hydraNodes?.length">
          <HeadVisualizeClient :head="head" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="Ports" name="ports">
        <div class="h-60 space-y-2 p-3">
          <div
            v-for="node in head.hydraNodes"
            :key="node.id"
            class="text-md-semibold bg-blue-1 rounded-1 flex items-center justify-between px-2 py-1 font-mono"
          >
            <div class="flex items-center justify-center gap-4">
              <span class="">#{{ node.id }}</span>
              <icon name="ic:sharp-settings-ethernet" class="size-5" />
              <span class="">{{ getHydraNodeEndpoint(node.port).ws }}</span>
            </div>

            <el-popover placement="top-start" title="" :width="400" trigger="hover" popper-class="!p-0 !rounded-2">
              <template #reference>
                <icon name="ic:round-info" class="size-5" />
              </template>
              <template #default>
                <HydraNodeCard :node="{ ...node, status: head.status }" readonly />
              </template>
            </el-popover>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Detail" name="detail">
        <div class="h-60">
          <pre class="bg-gray-1 m-0 h-full overflow-auto rounded p-2 text-xs">{{ JSON.stringify(head, null, 2) }}</pre>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<style lang="scss" scoped>
  .el-card {
    border-radius: 8px;
  }
  :deep(.el-tabs--border-card > .el-tabs__content) {
    padding: 0;
  }
</style>
