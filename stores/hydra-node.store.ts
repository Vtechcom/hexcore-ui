import type { HydraNode } from '~/interfaces/api/hydra-nodes/hydra-node.type'
import type { HydraHead, HydraHeadResponse } from '~/interfaces/api/hydra-nodes/hydra-heads.type'

export const useHydraNodeStore = defineStore('hydra-node', () => {
  const nodes = ref<HydraNode[]>([])
  const hydraHeads = ref<HydraHead[]>([])
  const loading = ref(false)
  const isFetchingHead = ref(false)

  const totalHeads = computed(() => hydraHeads.value.length)
  const activeHeads = computed(() => hydraHeads.value.filter(head => head.status === 'ACTIVE').length)
  const totalNodes = computed(() => nodes.value.length)
  const runningNodes = computed(() => nodes.value.filter(node => node.status === 'ACTIVE').length)
  const availableNodes = computed(() => nodes.value.filter(node => node.status === 'INACTIVE').length)

  const fetchNodes = async () => {
    try {
      loading.value = true
      const rs = await $fetch<{ data: { data: HydraNode[]; hasNextpage: boolean } }>('/api/nodes', {
        query: {
          page: 1,
          limit: 50
        }
      })
      nodes.value = rs.data.data
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const fetchHeads = async () => {
    try {
      isFetchingHead.value = true
      const rs = await $fetch<HydraHeadResponse>('/api/heads')
      hydraHeads.value = rs.data
    } catch (error: any) {
      ElMessage.error(error?.message)
    } finally {
      isFetchingHead.value = false
    }
  }

  onMounted(() => {
    fetchNodes()
    fetchHeads()
  })

  return {
    nodes,
    totalNodes,
    runningNodes,
    availableNodes,
    fetchNodes,
    loading,
    hydraHeads,
    totalHeads,
    activeHeads,
    fetchHeads
  }
})
