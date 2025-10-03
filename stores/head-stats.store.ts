import type { UTxOObject } from '@hydra-sdk/core'

export type HeadMessage = {
  headId: string
  tag: string
  timestamp: string
  parties?: Array<{
    vkey: string
  }>
  seq: number
  utxo?: UTxOObject
}

export type ExplorerHead = {
  blockNo: number
  contestationDeadline: string
  contestationPeriod: number
  contestations: number
  headId: string
  members: Array<{
    commits: {
      [key: string]: {
        address: string
        datum: null
        datumhash: null
        inlineDatum: null
        inlineDatumRaw: null
        referenceScript: null
        value: {
          lovelace: number
        }
      }
    }
    onChainId: string
    party: {
      vkey: string
    }
  }>
  network: 'Testnet' | 'Mainnet'
  networkMagic: number
  point: {
    blockHash: string
    slot: number
    tag: string
  }
  seedTxIn: string
  snapshotNumber: number
  status: 'Finalized' | 'Open' | 'Aborted' | 'Closed' | 'Initializing'
  version: string
}

export const useHeadStatsStore = defineStore('head-stats', () => {
  const headMessages = ref<HeadMessage[]>([])
  const hexcoreHeads = ref<ExplorerHead[]>([])
  const loading = ref(false)

  const fetchHeads = async () => {
    try {
      loading.value = true
      const rs = await $fetch('/api/stats/heads')
      headMessages.value = rs as HeadMessage[]
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const fetchingExplorerHead = ref(false)
  const explorerHeads = ref<ExplorerHead[]>([])
  const fetchExplorerHead = async () => {
    try {
      fetchingExplorerHead.value = true
      const rs = await $fetch<ExplorerHead[]>(`/api/stats/explorer-heads`)
      explorerHeads.value = rs.filter(item => item.networkMagic === 1)
      hexcoreHeads.value = rs.filter(item => {
        return headMessages.value.findIndex(msg => msg.headId === item.headId) !== -1
      })
    } catch (error) {
      console.error(error)
    } finally {
      fetchingExplorerHead.value = false
    }
  }

  onMounted(() => {
    fetchHeads().then(() => {
      fetchExplorerHead()
    })
  })

  return { hexcoreHeads, loading, explorerHeads, fetchingExplorerHead }
})
