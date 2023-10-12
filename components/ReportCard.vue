<script setup lang="ts">
defineProps<{
  level: "healthy" | "need_to_fix" | "dangerous" | "none",
  title: string
}>()

const healthy_level = ref({
  healthy: "سالم",
  need_to_fix: "نیاز به اصلاح",
  dangerous: "ناهنجاری شدید",
  none: ''
})
</script>

<template>
  <div class="flex flex-col mt-[16px] border-b-[4px] border-[#F5F5F5] pb-[16px]">
    <div class="flex items-center mb-[12px]">
      <h2 class="font-bold text-[18px]">{{ title }}</h2>

      <p :class="{
        'text-[#009F23]': level === 'healthy',
        'text-[#CD6200]': level === 'need_to_fix',
        'text-[#CA0404]': level === 'dangerous'
      }" class="mr-[8px] text-[14px] font-semibold">{{ healthy_level[level] }}</p>
    </div>
    <div>
      <p class="text-black/70 text-[16px]"><slot/></p>
    </div>
  </div>
</template>

<style scoped>

</style>