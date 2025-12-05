<script lang="ts" setup>
  import type { NodeTip } from '~/interfaces/api/node-info.type'

  const props = withDefaults(
    defineProps<{
      tip?: NodeTip | null
      loading?: boolean
    }>(),
    {
      tip: null,
      loading: false
    }
  )

  const emits = defineEmits<{
    refresh: []
  }>()

  const tip = computed(() => {
    return props.tip || null
  })

  const slotPercentage = computed(() => {
    if (!tip.value) return 0
    const p = ((tip.value.slotInEpoch / (tip.value.slotInEpoch + tip.value.slotsToEpochEnd)) * 100).toFixed(2)
    return parseFloat(p)
  })

  const syncProgress = computed(() => {
    if (!tip.value) return 0
    return parseFloat(tip.value.syncProgress)
  })
</script>

<template>
  <el-card>
    <template #header>
      <div class="flex items-center justify-between">
        <span class="font-600 text-lg">Tip</span>
        <div class="flex items-center">
          <span v-if="syncProgress < 100" class="text-warning-400 mr-2 text-sm">Syning {{ syncProgress }} %</span>
          <span v-else class="bg-green-5 mr-2 size-2 rounded-full"></span>
          <icon name="ic:baseline-sync" size="20" class="hover:cursor-pointer" @click="emits('refresh')" />
        </div>
      </div>
    </template>
    <div v-if="tip && !props.loading" class="">
      <div class="flex items-center">
        <span class="font-500 text-base">Block:</span>
        <span class="ml-2">{{ formatNumber(tip.block) }}</span>
      </div>
      <div class="flex items-center">
        <span class="font-500 text-base">Era:</span>
        <span class="ml-2">{{ tip.era }}</span>
      </div>
      <div class="mt-4 grid gap-4 sm:grid-cols-2">
        <div class="bg-gray-3 rounded-2 flex flex-col p-3">
          <span class="font-500 text-base">Epoch</span>
          <span>{{ tip.epoch }}</span>
        </div>
        <div class="bg-gray-3 rounded-2 flex flex-col p-3">
          <span class="font-500 text-base">Slot</span>
          <span>{{ formatNumber(tip.slotInEpoch) }} / {{ formatNumber(tip.slotInEpoch + tip.slotsToEpochEnd) }}</span>
        </div>
      </div>
      <el-progress class="mt-4" :text-inside="true" :stroke-width="24" :percentage="slotPercentage" />
    </div>
    <div v-else v-loading="props.loading" class="h-40"></div>
  </el-card>
</template>

<style lang="scss" scoped></style>
