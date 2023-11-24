<script setup lang="ts">
</script>

<template>
  <main class="p-[12px] flex flex-col h-[100dvh]" dir="rtl">
    <nav class="flex justify-end w-full mb-[16px]">
      <FaIcon :icon="['fas', 'xmark']" class="cursor-pointer text-[#666666] text-[24px] p-[8px]" @click="$router.replace('/home')"/>
    </nav>

    <div class="flex-1 flex flex-col overflow-hidden">
      <slot/>
    </div>
  </main>
</template>

<style scoped>

</style>