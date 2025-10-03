<script lang="ts" setup>
  import HydraHeadCard from '~/components/shared/HydraHeadCard.client.vue'
  import type { HydraHeadResponse } from '~/interfaces/api/hydra-nodes/hydra-heads.type'
  import PopupCreateHydraHead from '~/components/shared/PopupCreateHydraHead.vue'

  const isLoading = ref(false)
  const heads = ref<HydraHeadResponse['data']>([])

  const fetchHydraHeads = async () => {
    try {
      isLoading.value = true
      const rs = await $fetch<HydraHeadResponse>('/api/nodes/heads')
      heads.value = rs.data
    } catch (error: any) {
      ElMessage.error(error?.message)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    fetchHydraHeads()
  })

  const handleCreateSuccess = () => {
    fetchHydraHeads()
  }

  const openCreatePopup = () => {
    usePopupState(Popup.POPUP_CREATE_HYDRA_HEAD, 'open')
  }
</script>

<template>
  <div class="p-0">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="m-0 text-2xl font-bold">Hydra Heads</h1>
      <div class="flex items-center justify-between">
        <el-button type="primary" @click="openCreatePopup()">Create</el-button>
        <el-button type="info" @click="fetchHydraHeads">Refresh</el-button>
      </div>
    </div>

    <div v-loading="isLoading" class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <HydraHeadCard v-for="head in heads" :key="head.id" :head="head" @refresh="fetchHydraHeads" />
    </div>

    <PopupCreateHydraHead @success="handleCreateSuccess" />
  </div>
  <PopupMonitorHydraNode />
</template>

<style lang="scss" scoped></style>
