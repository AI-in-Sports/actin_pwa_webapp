<script lang="ts" setup>
useLoadingIndicator().start()
</script>

<template>
  <VitePwaManifest/>
  <NuxtLayout>
    <NuxtLoadingIndicator color="#212121" :height="2"/>
    <NuxtPage/>
  </NuxtLayout>
</template>

<style lang="sass">
@import "vue3-toastify/dist/index.css"
@import "vue-skeletor/dist/vue-skeletor.css"
</style>