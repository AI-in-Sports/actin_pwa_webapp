<script setup lang="ts">
defineProps<{
  type?: "submit" | "button"
}>()
</script>

<template>
  <button :type="type" class="primaryButton bg-mainBlue rounded-[96px] w-full p-[14px] font-bold text-[20px]">
    <slot/>
  </button>
</template>

<style scoped lang="sass">
</style>