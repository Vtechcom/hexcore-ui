<script lang="ts" setup>
  const headStatsStore = useHeadStatsStore()
  const { hexcoreHeads, loading, explorerHeads, fetchingExplorerHead } = storeToRefs(headStatsStore)

  const tableData = computed(() => {
    return hexcoreHeads.value.map((message, idx) => {
      return {
        id: idx,
        ...message
      }
    })
  })

  const filterTag = (value: string, row: ExplorerHead) => {
    if (value === 'All') return row.status
    return row.status
  }

  const getType = (row: ExplorerHead) => {
    if (row.status === 'Open') return 'success'
    else if (row.status === 'Aborted') return 'warning'
    else if (row.status === 'Closed') return 'danger'
    else if (row.status === 'Initializing') return 'primary'
    else if (row.status === 'Finalized') return 'info'
    else return 'info'
  }
</script>

<template>
  <div class="">
    <el-card class="h-full">
      <el-row :gutter="16" class="h-30">
        <el-col :span="8" class="">
          <counter-card
            size="default"
            title="Hexcore heads"
            :value="hexcoreHeads.length"
            :loading="fetchingExplorerHead"
          />
        </el-col>
        <el-col :span="8" class="">
          <counter-card
            size="default"
            title="Global heads (Preprod)"
            :value="explorerHeads.length"
            :loading="fetchingExplorerHead"
          />
        </el-col>
        <el-col :span="8" class="">
          <counter-card
            size="default"
            title="Percentage"
            :value="((hexcoreHeads.length / explorerHeads.length) * 100).toFixed(2) + '%'"
            :loading="fetchingExplorerHead"
          />
        </el-col>
      </el-row>
      <el-table ref="tableRef" row-key="headId" :data="tableData" style="width: 100%" stripe border>
        <el-table-column type="index" :index="index => index + 1" label="No." width="50" />
        <el-table-column prop="headId" label="Head ID" width="230">
          <template #default="{ row }">
            <nuxt-link :to="`https://preprod.cexplorer.io/policy/${row.headId}/mint`" class="flex items-center">
              <span class="!text-blue-5 font-600">{{ formatId(row.headId, 10, 10) }}</span>
            </nuxt-link>
          </template>
        </el-table-column>
        <el-table-column prop="version" label="Head Version" min-width="140" />
        <el-table-column prop="point.slot" label="Slot Number" width="140" align="center" />
        <el-table-column prop="blockNo" label="Block Number" width="140" align="center" />
        <el-table-column prop="point.blockHash" label="Block Hash" width="140">
          <template #default="{ row }">
            <nuxt-link
              :to="`https://preprod.cexplorer.io/block/${row.point.blockHash}`"
              class="flex items-center"
              target="_blank"
            >
              <span class="!text-blue-5 font-600">{{ formatId(row.point.blockHash, 12, 0) }}</span>
            </nuxt-link>
          </template>
        </el-table-column>

        <el-table-column
          prop="status"
          label="Status tag"
          width="120"
          :filters="[
            { text: 'All', value: 'All' },
            { text: 'Initializing', value: 'Initializing' },
            { text: 'Open', value: 'Open' },
            { text: 'Aborted', value: 'Aborted' },
            { text: 'Closed', value: 'Closed' },
            { text: 'Finalized', value: 'Finalized' }
          ]"
          :filter-method="filterTag"
          filter-placement="bottom-end"
          align="center"
        >
          <template #default="scope">
            <el-tag :type="getType(scope.row)" disable-transitions>
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>
