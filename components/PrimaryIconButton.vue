<script setup lang="ts">
defineProps<{
  type?: "submit" | "button",
  disabled?: boolean,
  icon: string,
  alt?: string
}>()
</script>

<template>
  <button
      :type="type" :disabled="disabled"
      class="primaryButton bg-mainBlue rounded-[96px] p-[13px] font-bold text-[20px] border-t-2 border-l-2 border-white/40
              disabled:bg-mainBlue/60 hover:enabled:scale-95 hover:enabled:focus:scale-95">
    <img :src="icon" :alt="alt" class="h-[24px] w-[24px]">
  </button>
</template>

<style scoped lang="sass">
</style>