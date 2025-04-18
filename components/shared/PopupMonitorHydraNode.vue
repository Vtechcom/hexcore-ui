<script lang="ts" setup>
  import BigNumber from 'bignumber.js'

  import { HydraHeadTag, type HydraPayload } from '~/interfaces/hydra/payload.type'
  import TableRow from './PopupMonitorHydraNode/TableRow.vue'

  const hydraMonitoringStore = useHydraMonitoringStore()
  const { currentNode } = storeToRefs(hydraMonitoringStore)

  const ws = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const loadingHistory = ref(false)
  const intervalRefreshLatency = ref<any>(null)

  const onOpenPopup = () => {
    if (!currentNode.value) {
      return
    }
    isConnected.value = false
    const wsUrl = `wss://hydranode-${currentNode.value.port}.hexcore.io.vn`
    const httpUrl = `https://hydranode-${currentNode.value.port}.hexcore.io.vn/commits`
    intervalRefreshLatency.value = setInterval(() => {
      calculateLatency(httpUrl)
    }, 10000)
    ws.value = new WebSocket(wsUrl)
    ws.value.onopen = () => {
      console.log('onopen')
      loadingHistory.value = true
      isConnected.value = true
    }

    let debounceTimeout: any = null
    const statsData: any[] = []
    ws.value.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data)
        // calculateStatistics(data)
        statsData.push(data)
        if (debounceTimeout) {
          clearTimeout(debounceTimeout)
        }
        if (loadingHistory.value) {
          debounceTimeout = setTimeout(() => {
            loadingHistory.value = false
            console.log('Load history done', statsData)
            calculateStatistics(statsData)
          }, 200)
        } else {
          updateStatistics(data)
        }
      } catch (error) {
        console.error('error', error)
      }
    }
  }

  const onClosePopup = () => {
    if (ws.value?.readyState === WebSocket.OPEN) ws.value?.close()

    resetStatistics()
    clearInterval(intervalRefreshLatency.value)
  }

  const commands = ref([
    {
      label: 'Init',
      value: 'Init',
      payloadObjectKey: ''
    },
    {
      label: 'Abort',
      value: 'Abort',
      payloadObjectKey: ''
    },
    {
      label: 'Close',
      value: 'Close',
      payloadObjectKey: ''
    },
    {
      label: 'GetUTxO',
      value: 'GetUTxO',
      payloadObjectKey: ''
    },
    {
      label: 'NewTx',
      value: 'NewTx',
      payloadObjectKey: 'transaction'
    },
    {
      label: 'Fanout',
      value: 'Fanout',
      payloadObjectKey: ''
    }
  ])
  const formCommand = reactive({
    command: commands.value[0].value,
    payload: ''
  })
  const payloadObjectKey = computed(() => commands.value.find(c => c.value === formCommand.command)?.payloadObjectKey)
  const sendCommand = () => {
    if (!ws.value) return
    try {
      let payload: Record<string, any> = {}
      if (payloadObjectKey.value) {
        try {
          JSON.parse(formCommand.payload)
        } catch {
          ElMessage.error('Payload must be a valid JSON object')
          return
        }
        payload = {
          [payloadObjectKey.value]: formCommand.payload ? JSON.parse(formCommand.payload) : {}
        }
      }
      ws.value.send(
        JSON.stringify({
          tag: formCommand.command,
          ...payload
        })
      )
      ElMessage.success('Command sent')
    } catch (error) {
      console.log(error)
    }
  }

  const statistics = reactive({
    headStatus: 'Idle',
    headId: 0,
    headSeq: 0,
    headHash: '',
    headUtxo: {},
    headSnapshot: {},
    headTotalTx: 0,
    headTotalCommitAmount: 0,
    hydraNodeVersion: '',
    totalOpenCount: 0,
    totalPeerDisconnected: 0,
    latency: ''
  })
  const headMessages = ref<any[]>([])
  const headMessageColumns = ref<any[]>([
    {
      key: 'seq',
      title: 'Seq',
      dataKey: 'seq',
      width: 100
    },
    {
      key: 'tag',
      title: 'Tag',
      dataKey: 'tag',
      width: 230
    },
    {
      key: 'timestamp',
      title: 'Timestamp',
      dataKey: 'timestamp',
      align: 'right',
      width: 658 - 100 - 230,
      cellRenderer: ({ rowData }: { rowData: any }) => {
        return rowData.timestamp ? useDateFormat(rowData.timestamp, 'hh:mm:ss A').value : '---'
      }
    }
  ])

  const resetStatistics = () => {
    Object.assign(statistics, {
      headStatus: 'Idle',
      headId: 0,
      headSeq: 0,
      headHash: '',
      headUtxo: {},
      headSnapshot: {},
      headTotalTx: 0,
      headTotalCommitAmount: 0,
      hydraNodeVersion: '',
      totalOpenCount: 0,
      totalPeerDisconnected: 0
    })
    headMessages.value = []
  }

  const calculateStatistics = (messages: HydraPayload[]) => {
    messages.forEach((data, idx) => {
      updateStatistics(data, idx)
    })
  }

  const updateStatistics = (message: HydraPayload, idx?: number) => {
    statistics.headStatus = message.tag
    if (message.tag === HydraHeadTag.TxValid) {
      statistics.headTotalTx++
    } else if (message.tag === HydraHeadTag.HeadIsOpen) {
      statistics.headHash = message.headId
      statistics.headUtxo = message.utxo
      statistics.totalOpenCount++
    } else if (message.tag === HydraHeadTag.SnapshotConfirmed) {
      statistics.headSnapshot = message.snapshot
    } else if (message.tag === HydraHeadTag.Greetings) {
      statistics.headStatus = message.headStatus
      statistics.hydraNodeVersion = message.hydraNodeVersion
    } else if (message.tag === HydraHeadTag.Committed) {
      statistics.headTotalCommitAmount += Object.values(message.utxo).reduce(
        (acc, curr) => acc + curr.value.lovelace,
        0
      )
    } else if (message.tag === HydraHeadTag.PeerDisconnected) {
      statistics.totalPeerDisconnected++
    }
    if ('seq' in message) statistics.headSeq = message.seq

    headMessages.value.unshift({
      id: idx || headMessages.value.length,
      seq: 'seq' in message ? message.seq : '',
      tag: message.tag,
      timestamp: 'timestamp' in message ? message.timestamp : null,
      children: [
        {
          key: 'child',
          detail: message
        }
      ]
    })
  }

  const calculateLatency = (url: string) => {
    const start = Date.now()
    fetch(url)
      .then(() => {
        const latency = Date.now() - start
        statistics.latency = `${latency}ms`
      })
      .catch(() => {
        statistics.latency = '---'
      })
  }
</script>

<template>
  <base-popup
    width="960px"
    :name="Popup.POPUP_MONITORING_HYDRA_NODE"
    :show-footer="false"
    append-body
    @open="onOpenPopup"
    @close="onClosePopup"
    :content-class="'max-h-80svh'"
  >
    <div v-if="currentNode" class="text-secondary font-mono">
      <el-container class="">
        <el-header class="border-b-solid border-secondary flex items-center border-b !px-4" height="48px">
          <div class="flex items-center font-semibold">
            Monitoring:
            <span class="text-gray-5 font-medium">
              [{{ statistics.headStatus }}] [{{ loadingHistory ? 'Loading history...' : statistics.headHash }}]
            </span>
          </div>
        </el-header>
        <el-container class="">
          <el-aside width="200px" class="border-r-solid border-secondary border-r px-4 py-2">
            <el-form class="font-mono" size="small">
              <p class="text-gray-6 m-0 text-sm font-semibold">Commands:</p>
              <el-radio-group v-model="formCommand.command" size="small" class="flex flex-col !items-start">
                <el-radio :value="item.value" size="small" class="!m-0" v-for="item in commands" :key="item.value">{{
                  item.label
                }}</el-radio>
              </el-radio-group>

              <el-form-item label-position="top" class="mt-2">
                <template #label>
                  <div class="flex w-full items-center justify-between">
                    <span class="text-gray-6 m-0 text-xs font-semibold">{{ payloadObjectKey || 'payload' }}:</span>
                    <el-button type="primary" size="small" plain class="ml-2" @click="sendCommand()"> Send </el-button>
                  </div>
                </template>
                <el-input
                  v-model="formCommand.payload"
                  :disabled="!payloadObjectKey"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 9 }"
                  class="mt-1"
                />
              </el-form-item>
            </el-form>
          </el-aside>
          <el-main class="!px-4 !py-2">
            <div class="grid grid-cols-3 gap-2 font-mono">
              <CounterCard title="Sequence" :value="statistics.headSeq" size="small" body-class="!p-2" />
              <CounterCard title="Total Tx" :value="statistics.headTotalTx" size="small" body-class="!p-2" />
              <CounterCard
                title="Total commit amount"
                :value="`${BigNumber(statistics.headTotalCommitAmount).div(1e6).toFormat(6)} ADA`"
                size="small"
                body-class="!p-2"
              />
              <CounterCard
                title="Head opened count"
                :value="statistics.totalOpenCount"
                size="small"
                body-class="!p-2"
              />
              <CounterCard
                title="Peer disconnected count"
                :value="statistics.totalPeerDisconnected"
                size="small"
                body-class="!p-2"
              />
              <CounterCard title="Latency" :value="statistics.latency" size="small" body-class="!p-2" />
            </div>
            <div class="mt-3">
              <el-table-v2
                :columns="headMessageColumns"
                :data="headMessages"
                :estimated-row-height="150"
                :expand-column-key="headMessageColumns[0].key"
                :width="658"
                :height="380"
                v-loading="loadingHistory"
              >
                <template #row="props">
                  <TableRow v-bind="props" class="h-12" />
                </template>
              </el-table-v2>
            </div>
          </el-main>
        </el-container>
      </el-container>
      <div class="flex items-center justify-between px-4 py-2">
        <span class="text-[10px]">
          <span class="text-gray-6 font-semibold">Hydra Node version:</span>
          <span class="ml-2">{{ statistics.hydraNodeVersion }}</span>
        </span>
        <BaseStatus
          :status="isConnected ? 'ACTIVE' : 'IDLE'"
          :status-text="isConnected ? 'Connected' : 'Disconnected'"
        />
      </div>
    </div>
    <div v-else class="flex items-center p-4">
      <el-empty description="No node selected" />
    </div>
  </base-popup>
</template>

<style lang="scss" scoped>
  :deep(.el-form-item--label-top .el-form-item__label) {
    margin-bottom: 0;
    padding: 0;
    width: 100%;
  }
</style>
