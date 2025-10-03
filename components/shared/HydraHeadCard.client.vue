<script lang="ts" setup>
  import type { HydraHead } from '~/interfaces/api/hydra-nodes/hydra-heads.type'

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

    activating.value = true
    await $fetch('/api/nodes/active-party', {
      method: 'POST',
      body: { id: props.head.id }
    })
    setTimeout(() => {
      ElMessage.success('Hydra head activated successfully')
      activating.value = false
      emits('refresh')
    }, 8000)
  }

  const handleDeactivate = async () => {
    ElMessage.warning('This feature is not available yet')
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
    <div class="rounded-1 bg-blue-2 absolute -top-3 left-0 min-w-10 shadow-sm">
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
            :disabled="disableAction"
            size="small"
            class="!m-0 !px-2 hover:cursor-pointer"
            :class="[head.status === 'ACTIVE' ? 'hover:!text-error-400' : 'hover:!text-green-400']"
            @click="handleActivate"
          >
            <icon v-if="head.status === 'INACTIVE'" name="ic:round-play-arrow" class="text-inherit" />
            <icon v-else name="ic:round-stop" class="text-inherit" @click="handleDeactivate" />
          </el-button>
        </div>
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
            @click="null"
          >
            <icon name="ic:round-more-vert" class="" />
          </el-button>
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

    <div v-if="head.hydraNodes?.length" class="mt-4">
      <div class="text-gray-7 mb-2 text-sm">Hydra Nodes</div>
      <div class="bg-gray-1 min-h-60 w-full rounded">
        <div class="grid grid-cols-3 gap-4 p-4">
          <div
            v-for="node in head.hydraNodes"
            :key="node.id"
            class="border-gray-3 relative flex flex-col items-center justify-center rounded border border-solid p-2 shadow"
          >
            <icon name="ic:round-layers" class="text-gray-7 size-10" />
            <!-- <div class="flex items-center">
              <div>#{{ node.id }}</div>
              <div class="text-gray-7 ml-4">{{ '' }}</div>
            </div> -->
            <div>#{{ node.id }}</div>
            <div class="text-gray-7 text-sm-bold flex items-center space-x-1">
              <icon name="ic:round-route" class="mr-1 size-4" />
              {{ node.port }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
  .el-card {
    border-radius: 8px;
  }
</style>
