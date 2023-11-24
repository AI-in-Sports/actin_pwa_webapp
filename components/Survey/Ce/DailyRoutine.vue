<script setup lang="ts">
import {surveyComputed} from "~/stores/survey"

const daily_routine = surveyComputed('daily_routine')

useHead({title: "فعالیت‌های تکراری روزانه"})
</script>

<template>
  <div class="flex flex-col gap-[16px]">
    <h3 class="text-[16px] text-mainBlack">فعالیت‌های تکراری روزانه که اغلب اوقات انجام می‌دهید چیست؟ (مثلا تایپ کردن یا رانندگی یا بلند کردن اجسام و...)</h3>

    <textarea
        v-model="daily_routine as string"
        class="border-[1px] border-[#C7C7C7] rounded-[8px] outline-none px-[12px] py-[8px] placeholder-[#818181] placeholder-[12px] h-[200px] resize-none"
        placeholder="پاسخ‌تان را اینجا بنویسید"></textarea>
  </div>
</template>

<style scoped>

</style>

<style scoped>

</style>