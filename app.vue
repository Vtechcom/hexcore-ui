<script lang="ts" setup>
  useSeoMeta({
    title: 'Hexcore Manager',
    description: 'Hexcore Manager',
    // image: '/images/logo.png',
    ogImage: '/images/logo.png'
  })

  useHead({
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/images/logo-hexcore-600x600.webp'
      }
    ]
  })
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="scss">
  @use 'assets/scss/index.scss' as *;
</style>
