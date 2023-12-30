<script setup lang="ts">
definePageMeta({
  layout: "main",
  middleware: ["normal-auth",  defineNuxtRouteMiddleware(() => {
    return navigateTo(`/ce`)
  })]
})
</script>

<template>

</template>