<script setup lang="ts">
defineProps<{
  isHintShowed: boolean
}>()
</script>

<template>
  <section class="z-[-100] text-white opacity-0 fixed inset-0 w-full h-full bg-black/80 backdrop-blur-20 flex justify-center items-center p-4" :class="{ '!z-[2000] !opacity-100': isHintShowed }">
    <div class="p-8 rounded-[16px] bg-mainDarkSecondary flex flex-col max-w-[450px] w-full items-center border-t-[2px] border-l-[2px] border-white/25">
      <h2 class="font-bold text-[25px] flex items-center">راهنما</h2>

      <HintLine/>

      <slot/>

      <ThemeButton class="!font-medium" @click="$emit('toggleModal')">بستن راهنما</ThemeButton>
    </div>
  </section>
</template>

<style scoped>

</style>