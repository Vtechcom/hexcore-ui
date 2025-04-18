<script lang="ts">
  import type { HydraPayload } from '~/interfaces/hydra/payload.type'
  import TableRowExpanded from './TableRowExpanded.vue'

  type RowData = {
    detail: HydraPayload
  }

  export default {
    inheritAttrs: false,
    props: {
      cells: {
        type: Array,
        default: () => [] as VNode[]
      },
      rowData: {
        type: Object,
        default: () => ({}) as RowData
      }
    },
    setup(props) {
      // return the render function
      return () => {
        if (props.rowData.detail) return h(TableRowExpanded, { detail: props.rowData.detail })
        return props.cells
      }
    }
  }
</script>

<style lang="scss">
  .el-table-v2__row-depth-0 {
    height: 50px !important;
  }
  .el-table-v2__row-depth-1 {
    height: 150px !important;
  }

  .el-table-v2__cell-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
