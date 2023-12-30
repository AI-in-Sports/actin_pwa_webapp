<template>
  <NuxtLayout>
    <VitePwaManifest/>
    <NuxtLoadingIndicator color="white" :height="2"/>
    <NuxtPage/>
  </NuxtLayout>
</template>

<style lang="sass">
@import "vue3-toastify/dist/index.css"
@import "vue-skeletor/dist/vue-skeletor.css"
</style>