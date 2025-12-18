<script lang="ts" setup>
  import { ArrowRight } from '@element-plus/icons-vue'

  interface Props {
    items?: Array<{ text: string; to?: string }>
  }
  const isCollapse = useState<boolean>('collapse-sidebar')
  defineProps<Props>()
</script>

<template>
  <div class="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
    <div class="items-center justify-center gap-3 sm:flex">
      <el-button class="!sm:flex !hidden !border-none !p-2" @click="isCollapse = !isCollapse">
        <icon
          :class="isCollapse ? 'rotate-180' : 'rotate-360'"
          class="transform transition-transform duration-300"
          size="20"
          name="tabler:layout-sidebar-left-collapse"
        />
      </el-button>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: 'dashboard' }">Dashboard</el-breadcrumb-item>
        <template v-if="items && Array.isArray(items)">
          <el-breadcrumb-item
            v-for="(item, index) in items"
            :key="index"
            :to="item.to ? { path: item.to } : undefined"
            >{{ item.text }}</el-breadcrumb-item
          >
        </template>
      </el-breadcrumb>
    </div>

    <div>
      <slot name="right-content" />
    </div>
  </div>
</template>
