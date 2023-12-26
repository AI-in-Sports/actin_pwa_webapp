<script setup lang="ts">
import jalali from "jalaali-js"

defineProps<{
  data: any
}>()
</script>

<template>
  <div class="border-[1px] border-black/10 shadow-sm rounded-[16px] py-[14px] px-[16px] flex flex-col">
    <p class="text-[#727272] text-[14px]">
      {{ new Date(data['date']).toLocaleDateString("fa-IR", { weekday: 'long' }) }}،
      {{ convertToPersianNumber(jalali.toJalaali(new Date(data['date'])).jd.toString()) + " " }}
      {{ new Date(data['date']).toLocaleDateString("fa-IR", { month: 'long' }) + " " }}
      {{ data['time'] }}
    </p>

    <div class="flex justify-between items-center mt-[12px]">
      <div class="flex items-center">
        <img src="@/assets/images/dr_prof.png" :alt="data['name']"
             class="w-[32px] h-[32px] rounded-full ml-[8px]">

        <p class="text-[#212121] text-[14px]">{{ data['name'] }}</p>
      </div>

      <div class="py-[1px] px-[8px] rounded-full text-[12px]" :class="{
        'bg-[#ECE6FF] text-[#3006B5]': data['status'] === 'PENDING',
        'bg-[#C9F5DB] text-[#23AD5A]': data['status'] === 'SUCCESS'
      }">
        {{
            data['status'] === "PENDING" ?
                'در حال بررسی نوبت' :
                'نوبت تایید شده است!'
        }}
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>