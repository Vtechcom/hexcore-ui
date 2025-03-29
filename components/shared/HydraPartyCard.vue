<script lang="ts" setup>
  import type { HydraParty } from '~/interfaces/api/hydra-nodes/parties.type'

  const props = defineProps<{
    party: HydraParty
  }>()

  const activating = ref(false)
  const handleActivate = async () => {
    if (disableAction.value) {
      ElMessage.warning('Please add more nodes to the party')
      return
    }

    activating.value = true
    await $fetch('/api/nodes/active-party', {
      method: 'POST',
      body: { id: props.party.id }
    })
    ElMessage.success('Hydra party activated successfully')
    activating.value = false
  }

  const handleDeactivate = async () => {
    ElMessage.warning('This feature is not available yet')
  }

  const disableAction = computed(() => {
    return props.party.hydraNodes.length < props.party.nodes || activating.value
  })

  const status = computed(() => {
    if (activating.value) {
      return 'UNKNOWN'
    }
    if (props.party.status === 'ACTIVE') {
      return 'ACTIVE'
    }
    return 'IDLE'
  })
</script>

<template>
  <el-card class="w-full">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <div class="flex items-center">
          <div class="text-lg font-medium">#{{ party.id }}</div>
          <div
            class="border-gray-3 rounded-1 ml-4 flex items-center border border-solid"
            :class="{ 'opacity-50': disableAction }"
          >
            <el-button text plain :disabled="disableAction" size="small" class="!m-0 !px-2" @click="handleActivate">
              <icon
                name="ic:round-refresh"
                class="hover:text-gray-6 hover:cursor-pointer"
                :class="{ 'animate-spin': activating }"
              />
            </el-button>
            <el-button text plain :disabled="disableAction" size="small" class="!m-0 !px-2">
              <icon
                v-if="party.status === 'INACTIVE'"
                name="ic:round-play-arrow"
                class="hover:text-green-4 hover:cursor-pointer"
                @click="handleActivate"
              />
              <icon v-else name="ic:round-stop" class="text-error-400 hover:cursor-pointer" @click="handleDeactivate" />
            </el-button>
          </div>
        </div>
        <div class="text-gray-7 ml-4">{{ party.description }}</div>
      </div>
      <base-status :status="status" />
    </div>

    <div class="text-gray-7 mt-4 flex items-center justify-between">
      <div class="mr-6 flex flex-col items-center">
        <div class="text-sm">Nodes</div>
        <div class="mt-1">{{ party.nodes }}</div>
      </div>
      <div class="flex flex-col items-end">
        <div class="text-sm">Created At</div>
        <div class="mt-1">{{ useDateFormat(party.createdAt, 'DD/MM/YYYY HH:mm:ss') }}</div>
      </div>
    </div>

    <div v-if="party.hydraNodes?.length" class="mt-4">
      <div class="text-gray-7 mb-2 text-sm">Hydra Nodes</div>
      <div class="space-y-2">
        <div
          v-for="node in party.hydraNodes"
          :key="node.id"
          class="bg-gray-1 flex items-center justify-between rounded p-2"
        >
          <div class="flex items-center">
            <div>#{{ node.id }}</div>
            <div class="text-gray-7 ml-4">{{ '' }}</div>
          </div>
          <div class="flex items-center">
            <div class="text-gray-7 text-sm-bold mr-4">Port: {{ node.port }}</div>
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
