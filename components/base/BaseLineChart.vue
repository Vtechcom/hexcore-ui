<script setup lang="ts">
  interface Props {
    title: string
    series: {
      name: string
      data: number[][]
    }[]
  }

  defineProps<Props>()

  const chartOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: true }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    colors: ['#2563eb', '#10b981', '#f59e0b'],
    dataLabels: { enabled: false },
    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        format: 'HH:mm',
        datetimeUTC: false
      },
      title: { text: 'UTC+7' }
    },
    yaxis: {
      min: 6,
      max: 12,
      tickAmount: 4,
      labels: {
        formatter: (val: number) => `${val}%`
      }
    },
    markers: {
      colors: ['#2563eb', '#10b981', '#f59e0b'],
      strokeWidth: 3
    },
    tooltip: {
      x: { format: 'HH:mm' },
      y: { formatter: (val: number) => `${val.toFixed(1)}%` }
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'left',
      offsetY: 8
    }
  }
</script>
<template>
  <div class="rounded-lg border border-gray-200 bg-white px-3 py-1 shadow">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-semibold text-gray-800">{{ title }}</h3>
      <span class="cursor-pointer text-lg text-gray-500">ℹ</span>
    </div>
    <ClientOnly>
      <apexchart type="line" height="250" :options="chartOptions" :series />
    </ClientOnly>
  </div>
</template>
