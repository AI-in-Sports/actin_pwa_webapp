<script lang="ts" setup>
useLoadingIndicator().start()

useHead({
  script: [
    {
      async: true,
      src: "https://www.googletagmanager.com/gtag/js?id=G-VYZEM75972"
    }
  ]
})
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
@import "vue-advanced-cropper/dist/style.css"
</style>