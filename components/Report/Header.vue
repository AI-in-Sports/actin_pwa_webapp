<script setup lang="ts">
defineProps<{
  backRoute: string
}>()
</script>

<template>
  <nav class="flex px-[20px] py-[16px] shadow w-full">
    <div class="w-1/4">

    </div>
    <div class="w-1/2 font-bold text-[16px] text-center">
      <slot/>
    </div>

    <div class="w-1/4 flex items-center justify-end">
      <FaIcon :icon="['fas', 'arrow-left']" @click="$router.replace(backRoute)"
              class="cursor-pointer text-[18px] mt-1"/>
    </div>
  </nav>
</template>