<script setup lang="ts">
defineProps<{
  selected: boolean,
  icon?: string,
  title: string
  name: string
}>()
</script>

<template>
  <div class="flex flex-row justify-start items-center gap-x-1 border border-solid border-[#E0E0E0] rounded-full px-3 py-1"
       :class="{ '!border-mainBlack': selected }" dir="rtl">
    <input type="radio" :name="name" class="accent-mainBlack" :checked="selected"/>

    <img :src="icon">

    <p class="text-base text-mainBlack">
      {{ title }}
    </p>
  </div>
</template>

<style scoped>

</style>