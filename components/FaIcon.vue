<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome"

defineProps<{
  icon: any
}>()
</script>

<template>
  <i class="faIcon flex justify-center items-center">
    <ClientOnly>
      <FontAwesomeIcon :icon="icon"/>
    </ClientOnly>
  </i>
</template>