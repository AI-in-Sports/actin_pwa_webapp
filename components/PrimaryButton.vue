<script setup lang="ts">
defineProps<{
  type?: "submit" | "button"
}>()
</script>

<template>
  <button :type="type" class="primaryButton bg-mainBlue rounded-[96px] w-full p-[13px] font-bold text-[20px] border-t-2 border-l-2 border-white/40">
    <slot/>
  </button>
</template>

<style scoped lang="sass">
</style>