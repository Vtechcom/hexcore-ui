<script lang="ts" setup>
  import type { HydraNode } from '~/interfaces/api/hydra-nodes/hydra-node.type'

  const props = withDefaults(
    defineProps<{
      node: HydraNode
      readonly?: boolean
    }>(),
    {
      readonly: false
    }
  )

  const hydraMonitoringStore = useHydraMonitoringStore()

  const onClickMonitoringNode = () => {
    hydraMonitoringStore.currentNode = props.node
    usePopupState(Popup.POPUP_MONITORING_HYDRA_NODE, 'open')
  }
</script>

<template>
  <el-card>
    <div class="flex justify-between">
      <BaseStatus :status="node?.status || 'UNKNOWN'" />
      <!-- <icon v-if="!readonly" name="ic:round-delete-sweep" size="24" /> -->
      <el-button plain type="info" size="small" @click="onClickMonitoringNode">
        <icon name="ic:round-monitor" size="20" />
      </el-button>
    </div>
    <div class="mt-4">
      <div class="flex items-center">
        <span class="text-gray-6 text-sm-bold">Port:</span>
        <span class="ml-2 text-sm">{{ node.port }}</span>
      </div>
      <div class="mt-2 flex items-center">
        <span class="text-gray-6 text-sm-bold">Endpoint:</span>
        <span class="text-blue-4 ml-2 text-sm">{{ getHydraNodeEndpoint(node.port).ws }}</span>
      </div>
      <div class="mt-2 flex items-center">
        <span class="text-gray-6 text-sm-bold">Description:</span>
        <span class="ml-2 text-sm">{{ node.description }}</span>
      </div>
      <div class="mt-2 flex items-center justify-between">
        <el-popover placement="top-start" width="auto" trigger="click">
          <div class="text-xs">
            <div class="flex items-center">
              <span class="text-gray-6 font-500">Pointer addr:</span>
              <span class="ml-2">{{ formatId(node.cardanoAccount.pointerAddress, 12, 12) }}</span>
            </div>
            <div class="mt-2 flex items-center">
              <span class="text-gray-6 font-500">Base addr:</span>
              <span class="ml-2">{{ formatId(node.cardanoAccount.baseAddress, 12, 12) }}</span>
            </div>
            <div class="mt-4 flex justify-end">
              <el-button size="small">
                <span class="mr-2 text-xs">Detail</span>
                <icon name="ic:baseline-account-balance-wallet" size="14" />
              </el-button>
            </div>
          </div>
          <template #reference>
            <div class="inline-flex items-center hover:cursor-pointer">
              <span class="text-gray-6 text-sm-bold flex">
                <icon name="ic:baseline-account-balance-wallet" size="20" />
              </span>
              <span class="text-blue-4 ml-2 text-sm">{{ formatId(node.cardanoAccount.pointerAddress, 4, 8) }}</span>
            </div>
          </template>
        </el-popover>
        <el-popover placement="top-start" width="auto" trigger="click" effect="dark">
          <div class="text-xs">
            <pre class="m-0">{{ node.vkey }}</pre>
          </div>
          <template #reference>
            <div class="inline-flex items-center hover:cursor-pointer">
              <span class="text-gray-6 text-sm-bold flex">
                <icon name="ic:round-key" size="20" />
              </span>
              <span class="text-blue-4 ml-2 text-sm">vkey</span>
            </div>
          </template>
        </el-popover>
      </div>
    </div>
  </el-card>
</template>

<style lang="scss" scoped></style>
