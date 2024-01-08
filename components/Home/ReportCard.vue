<script setup lang="ts">
import jalali from "jalaali-js"

defineProps<{
  data: any
}>()
</script>

<template>
  <div class="border-[1px] border-black/10 hover:shadow cursor-pointer rounded-[16px] px-[18px] py-[16px] flex justify-between items-center"
       @click="$router.push(`/report/${data.testId}`)">
    <div class="flex flex-col">
      <p class="text-[#727272] text-[14px] mb-[18px]">
        {{ persianNumber(jalali.toJalaali(data['date']).jd.toString()) + " " }}
        {{ new Date(data['date']).toLocaleDateString("fa-IR", { month: 'long' }) + " " }}
        {{ persianNumber(jalali.toJalaali(data['date']).jm.toString()) }}
      </p>

      <p class="text-[#212121] text-[14px]">
        ارزیابی کلی بدن
      </p>
    </div>
    <div>
      <FaIcon class="text-[16px] text-black/40" icon="angle-left"/>
    </div>
  </div>
</template>

<style scoped>

</style>