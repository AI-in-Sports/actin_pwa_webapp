<script setup lang="ts">
defineProps<{
  selected: boolean,
  img?: string,
  title: string
}>()
</script>

<template>
  <div
      class="rounded-[8px] border-[1px] border-[#C1C1C1] px-[9px] py-[16px] flex items-center justify-between cursor-pointer"
      :class="{ '!border-[#F0A300] !bg-[#FDF6E5]': selected }">
    <div class="flex items-center">
      <img v-if="img" :src="img" :alt="title" class="ml-[16px]">
      <p class="text-[16px] font-medium text-mainBlack">{{ title }}</p>
    </div>

    <ThemeCheckBox :checked="selected"/>
  </div>
</template>

<style scoped>

</style>