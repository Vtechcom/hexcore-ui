<script lang="ts" setup>
  import { ConsumerStatus, type Consumer } from '~/interfaces/api/consumer/consumer.type'
  import type { ConsumerInfo } from '~/interfaces/api/consumer/consumer-info.type'
  const props = defineProps<{
    consumer: Consumer
  }>()

  const consumer = ref(props.consumer)

  const { data: consumerInfo, refresh } = useLazyFetch<{ data: ConsumerInfo }>(
    '/api/consumer/info/' + props.consumer.id
  )
  const mappers = computed(() => (consumerInfo.value?.data.mappers || []).sort((a, b) => (b.isActive == true ? 1 : -1)))

  const rowClassName = ({ row }: { row: ConsumerInfo['mappers'][number] }) => {
    return row.isActive ? '!bg-green-50 !bg-opacity-50' : '!bg-red-50 !bg-opacity-50'
  }
  const showBtnDeactivate = computed(() => {
    return props.consumer.status === ConsumerStatus.ACTIVE
  })
  const showBtnApprove = computed(() => {
    return props.consumer.status === ConsumerStatus.REQUESTED
  })
  const showBtnReject = computed(() => {
    return props.consumer.status === ConsumerStatus.REQUESTED
  })
  const showBtnActive = computed(() => {
    return props.consumer.status === ConsumerStatus.INACTIVE
  })

  const showBtnShare = computed(() => {
    return props.consumer.status === ConsumerStatus.ACTIVE
  })

  const loading = ref(false)
  async function updateConsumer(status: ConsumerStatus) {
    try {
      loading.value = true
      const rs = await $fetch<{ data: Consumer }>('/api/consumer/info/' + props.consumer.id, {
        method: 'PUT',
        body: {
          id: props.consumer.id,
          status
        }
      })
      consumer.value.status = rs.data.status
      refresh()
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const onClickShareNode = () => {
    usePopupState(Popup.POPUP_CONSUMER_SELECT_NODE, 'open')
  }

  const loadingShareNode = ref(false)
  const onConfirmSelectNode = async (nodeIds: number[]) => {
    loadingShareNode.value = true
    const queries = nodeIds.map(nodeId => {
      return $fetch('/api/consumer/share-consumer-node', {
        method: 'POST',
        body: {
          consumerId: props.consumer.id,
          hydraNodeId: nodeId
        }
      })
    })
    try {
      await Promise.all(queries)
      refresh()
    } catch (error) {
      console.error(error)
    } finally {
      loadingShareNode.value = false
    }
  }

  const loadingDeleteNode = ref(false)
  const onClickDeleteNode = async (mapperId: number) => {
    try {
      loadingDeleteNode.value = true
      await $fetch('/api/consumer/remove-shared-node', {
        method: 'POST',
        body: {
          mapperId
        }
      })
      refresh()
    } catch (error) {
      console.error(error)
    } finally {
      loadingDeleteNode.value = false
    }
  }
</script>

<template>
  <div class="p-4">
    <div class="flex items-center">
      <el-avatar :size="54" :src="consumer.avatar" class="flex-shrink-0">
        <span class="text-xs">{{ consumer.address.slice(consumer.address.length - 4) }}</span>
      </el-avatar>
      <div class="flex-grow-1 ml-4 overflow-hidden">
        <div class="flex items-start justify-between">
          <div class="">
            <div class="text-sm text-gray-500">{{ formatId(consumer.address, 10, 12) }}</div>
            <div class="mt-1 flex">
              <el-button
                v-if="showBtnApprove"
                type="success"
                size="small"
                :loading="loading"
                :disabled="loading"
                @click="updateConsumer(ConsumerStatus.ACTIVE)"
              >
                Approve</el-button
              >
              <el-button
                v-if="showBtnReject"
                type="danger"
                size="small"
                :loading="loading"
                :disabled="loading"
                @click="updateConsumer(ConsumerStatus.REJECTED)"
              >
                Reject
              </el-button>
              <el-button
                v-if="showBtnActive"
                type="success"
                size="small"
                :loading="loading"
                :disabled="loading"
                @click="updateConsumer(ConsumerStatus.ACTIVE)"
              >
                Active
              </el-button>
              <el-button
                v-if="showBtnShare"
                :loading="loadingShareNode"
                type="primary"
                plain
                size="small"
                @click="onClickShareNode"
              >
                Share node
                <icon name="ic:sharp-cell-tower" class="ml-1" />
              </el-button>
            </div>
          </div>
          <el-popover placement="top" width="auto" trigger="hover">
            <div class="flex flex-col gap-1">
              <el-button type="danger" plain size="small" class="!m-0" @click="updateConsumer(ConsumerStatus.BLOCKED)">
                <icon name="ic:baseline-lock-person" />
                <span class="ml-1">Block</span>
              </el-button>
              <el-button
                v-if="showBtnDeactivate"
                type="warning"
                size="small"
                plain
                class="!m-0"
                :loading="loading"
                :disabled="loading"
                @click="updateConsumer(ConsumerStatus.INACTIVE)"
              >
                Deactivate
              </el-button>
            </div>
            <template #reference>
              <el-button type="default" plain size="small" @click="null">
                <icon name="ic:round-settings" />
              </el-button>
            </template>
          </el-popover>
        </div>
      </div>
    </div>
    <div class="mt-2 flex items-center gap-2">
      <div v-if="mappers.length > 0" class="flex-grow-1 flex overflow-hidden">
        <el-table :data="mappers" :row-class-name="rowClassName" border>
          <el-table-column prop="consumerKey" label="Key">
            <template #default="{ row }">
              <el-tooltip :content="row.consumerKey" placement="top">
                <span v-copy="row.consumerKey" class="font-600 font-mono text-xs">
                  {{ formatId(row.consumerKey, 10, 12) }}
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="url" label="URL" />
          <el-table-column prop="isOnline" label="Online" align="center" width="100">
            <template #default="{ row }">
              <base-status
                :status="row.isOnline ? 'ACTIVE' : 'IDLE'"
                :status-text="row.isOnline ? 'Online' : 'Offline'"
                size="small"
              />
            </template>
          </el-table-column>
          <el-table-column prop="updatedAt" label="Updated at" align="right" width="140">
            <template #default="{ row }">
              <span class="text-xs">{{ useDateFormat(row.updatedAt, 'YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Action" align="right" width="80">
            <template #default="{ row }">
              <el-popover placement="top" width="auto" trigger="click">
                <div class="flex flex-col gap-1">
                  <el-button type="danger" size="small" plain @click="onClickDeleteNode(row.id)">
                    <icon name="ic:round-delete" />
                    <span class="ml-1">Delete</span>
                  </el-button>
                </div>
                <template #reference>
                  <el-button type="default" size="small" plain>
                    <icon name="ic:round-settings" />
                  </el-button>
                </template>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <PopupSelectNode @confirm="onConfirmSelectNode" />
  </div>
</template>
