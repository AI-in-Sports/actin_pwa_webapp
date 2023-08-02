<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome"

defineProps<{
  icon: string
}>()
</script>

<template>
  <i>
    <ClientOnly>
      <FontAwesomeIcon :icon="icon"/>
    </ClientOnly>
  </i>
</template>

<style scoped>

</style>