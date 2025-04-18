import type { HydraNode } from '~/interfaces/api/hydra-nodes/hydra-node.type'

export const useHydraMonitoringStore = defineStore('hydra-monitoring', () => {
  const currentNode = ref<HydraNode | null>(null)

  return { currentNode }
})
