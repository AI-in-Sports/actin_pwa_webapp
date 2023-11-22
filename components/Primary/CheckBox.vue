<script setup lang="ts">
defineProps<{
  checked?: boolean
}>()
</script>

<template>
  <input
      type="checkbox" :checked="checked"
      class="appearance-none rounded-full w-[20px] h-[20px] border-[1px] border-[#C1C1C1] ml-[5px] checked:bg-[#F0A300] checked:!border-[#F0A300] checked:accent-white
          before:checked:content-['✓'] before:text-[16px] text-white cursor-pointer
          before:font-[initial] before:leading-[16px] before:scale-0 before:delay-75 before:ease-in-out
          before:transition-transform checked:before:scale-100 font-bold before:pb-[2px] before:pr-[1.5px]">
</template>

<style scoped>

</style>