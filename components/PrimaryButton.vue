<script setup lang="ts">
defineProps<{
  type?: "submit" | "button",
  disabled?: boolean
}>()
</script>

<template>
  <button
      :type="type" :disabled="disabled"
      class="primaryButton bg-mainBlue rounded-[96px] w-full p-[13px] font-bold text-[20px] border-t-2 border-l-2 border-white/40
              disabled:bg-mainBlue/80 [:not(:disabled)]:hover:scale-95 [:not(:disabled)]:focus:scale-95">
    <slot/>
  </button>
</template>

<style scoped lang="sass">
</style>