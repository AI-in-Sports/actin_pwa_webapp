<script setup lang="ts">
defineProps<{
  theme: "outlined" | "rounded" | "sharp",
  filled?: boolean
}>()
</script>

<template>
  <span class="!select-none" :class="`material-symbols-${theme} ` + (filled ? 'material-symbols-filled' : '')"><slot/></span>
</template>

<style scoped>

</style>