<script lang="ts" setup>
  import type { HydraNode } from '~/interfaces/api/hydra-nodes/hydra-node.type'

  const hydraNodeStore = useHydraNodeStore()
  const { nodes, loading } = storeToRefs(hydraNodeStore)

  const search = ref('')
  const filteredNodes = computed(() => {
    return nodes.value.filter(node => node.description?.toLowerCase().includes(search.value.toLowerCase()))
  })

  const onOpen = () => {
    hydraNodeStore.fetchNodes()
  }

  const onClose = () => {
    search.value = ''
  }

  const selectedNodes = ref<HydraNode['id'][]>([])
  const onClickNode = (node: HydraNode) => {
    if (isSelected(node)) {
      selectedNodes.value = selectedNodes.value.filter(id => id !== node.id)
    } else {
      selectedNodes.value.push(node.id)
    }
  }
  const isSelected = (node: HydraNode) => {
    return selectedNodes.value.includes(node.id)
  }

  const emits = defineEmits<{
    (e: 'confirm', nodes: HydraNode['id'][]): void
  }>()

  const onClickConfirm = () => {
    emits('confirm', selectedNodes.value)
    usePopupState(Popup.POPUP_CONSUMER_SELECT_NODE, 'close')
  }
</script>

<template>
  <base-popup
    width="680px"
    :name="Popup.POPUP_CONSUMER_SELECT_NODE"
    show-footer
    append-body
    @open="onOpen"
    @close="onClose"
  >
    <div class="px-4 py-4 pr-12">
      <el-input v-model="search" placeholder="Search" size="small" />
    </div>
    <div class="h-460px overflow-y-auto px-4">
      <el-skeleton v-if="loading" :rows="3" />
      <ul v-else class="m-0 grid list-none grid-cols-2 gap-4 p-0">
        <li
          v-for="node in filteredNodes"
          :key="node.id"
          class="relative m-0 cursor-pointer"
          @click="onClickNode(node)"
          :class="{ 'bg-gray-50': isSelected(node) }"
        >
          <div class="absolute right-2 top-2">
            <el-radio-group :model-value="isSelected(node) ? node.id : 0">
              <el-radio :value="node.id" />
            </el-radio-group>
          </div>
          <HydraNodeCard :node="node" readonly />
        </li>
      </ul>
    </div>
    <template #footer>
      <div class="flex items-center justify-end px-4 py-2">
        <el-button type="primary" size="small" @click="onClickConfirm">Confirm</el-button>
      </div>
    </template>
  </base-popup>
</template>
