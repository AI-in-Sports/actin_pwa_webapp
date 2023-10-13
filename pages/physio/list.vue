<script setup lang="ts">
definePageMeta({
  layout: "result",
  middleware: ["normal-auth"]
})

</script>

<template>
  <ReportHeader @click="$router.go(-1)">لیست پزشکان</ReportHeader>


</template>

<style scoped>

</style>