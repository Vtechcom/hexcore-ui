<script lang="ts" setup>
  import type { HydraPayload } from '~/interfaces/hydra/payload.type'

  const props = defineProps<{
    detail: HydraPayload
  }>()
</script>

<template>
  <div class="relative h-full w-full bg-[#f6f6f6]">
    <div class="absolute right-1 top-1 z-10">
      <el-button size="small" @click="useCopy(JSON.stringify(props.detail, null, 2))">Copy</el-button>
    </div>
    <div class="h-full w-full overflow-y-auto">
      <highlightjs language="js" class="text-10px !m-0 w-full" :code="JSON.stringify(props.detail, null, 2)" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
