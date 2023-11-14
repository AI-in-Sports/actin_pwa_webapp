<script setup lang="ts">
const props = defineProps<{
  level: string,
  title: string
}>()

const healthy_levels = {
  healthy: {
    text: "سالم",
    keywords: ["normal", "healthy"]
  },
  need_to_fix: {
    text: "نیاز به اصلاح",
    keywords: ["need_to_fix", "low_kyphosis", "low_flatback", "low_lordosis", "low_swayback"]
  },
  dangerous: {
    text: "ناهنجاری شدید",
    keywords: ["dangerous", "high_swayback", "high_lordosis", "high_flatback", "high_kyphosis"]
  },
}

const healthy_level = (): "healthy" | "need_to_fix" | "dangerous" => {
  if (healthy_levels.healthy.keywords.includes(props.level))
    return "healthy"

  if (healthy_levels.need_to_fix.keywords.includes(props.level))
    return "need_to_fix"

  if (healthy_levels.dangerous.keywords.includes(props.level))
    return "dangerous"

  return "healthy"
}
</script>

<template>
  <div class="flex flex-col mt-[16px] border-b-[4px] border-[#F5F5F5] pb-[16px]">
    <div class="flex items-center mb-[12px]">
      <h2 class="font-bold text-[18px]">{{ title }}</h2>

      <p :class="{
        'text-[#009F23]': healthy_level() === 'healthy',
        'text-[#CD6200]': healthy_level() === 'need_to_fix',
        'text-[#CA0404]': healthy_level() === 'dangerous'
      }" class="mr-[8px] text-[14px] font-semibold">{{ healthy_levels[healthy_level()].text }}</p>
    </div>
    <div>
      <p class="text-black/70 text-[16px]"><slot/></p>
    </div>
  </div>
</template>

<style scoped>

</style>