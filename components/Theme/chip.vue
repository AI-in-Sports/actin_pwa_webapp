<script setup lang="ts">
defineProps<{
  name: string
}>()
</script>

<template>
  <div class="flex flex-row justify-between items-center gap-x-1.5 py-2 px-2.5 bg-[#F5F5F5] rounded-full">
    <p class="text-mainSubDead text-sm">
      {{ name }}
    </p>

    <MaterialSymbols theme="rounded" class="text-mainSubDead text-base cursor-pointer hover:scale-90">
      close
    </MaterialSymbols>
  </div>
</template>

<style scoped>

</style>