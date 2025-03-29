<script lang="ts" setup>
  import HydraPartyCard from '~/components/shared/HydraPartyCard.vue'
  import type { HydraPartyResponse } from '~/interfaces/api/hydra-nodes/parties.type'
  import PopupCreateHydraParty from '~/components/shared/PopupCreateHydraParty.vue'

  const isLoading = ref(false)
  const parties = ref<HydraPartyResponse['data']>([])

  const fetchParties = async () => {
    try {
      isLoading.value = true
      const rs = await $fetch<HydraPartyResponse>('/api/nodes/parties')
      parties.value = rs.data
    } catch (error: any) {
      ElMessage.error(error?.message)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    fetchParties()
  })

  const handleCreateSuccess = () => {
    fetchParties()
  }

  const openCreatePopup = () => {
    usePopupState(Popup.POPUP_CREATE_HYDRA_PARTY, 'open')
  }
</script>

<template>
  <div class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold">Hydra Parties</h1>
      <el-button type="primary" @click="openCreatePopup()">Create Party</el-button>
    </div>

    <div v-loading="isLoading" class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <HydraPartyCard v-for="party in parties" :key="party.id" :party="party" />
    </div>

    <popup-create-hydra-party @success="handleCreateSuccess" />
  </div>
</template>

<style lang="scss" scoped></style>
