<script setup lang="ts">
defineProps<{
  type?: "submit" | "button",
  disabled?: boolean
}>()
</script>

<template>
  <button
      :type="type" :disabled="disabled"
      class="rounded-full bg-[#212121] border-none text-white w-full p-[10px] sm:p-[13px] font-normal text-[20px]
              disabled:bg-[#212121]/60 hover:enabled:scale-[0.96] hover:enabled:focus:scale-[0.96]">
    <slot/>
  </button>
</template>

<style scoped lang="sass">
</style>