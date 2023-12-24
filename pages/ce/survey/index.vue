<script setup lang="ts">
definePageMeta({
  layout: "survey",
  middleware: ["normal-auth",  defineNuxtRouteMiddleware(() => {
    const ceSurvey = useCESurveyStore()
    return navigateTo(`/ce/survey/${ceSurvey.survey1.lastCompleted! + 1}`)
  })]
})

</script>

<template>

</template>

<style scoped>

</style>