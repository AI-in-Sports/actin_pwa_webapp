<script setup lang="ts">
import {convertToPersianNumber} from "~/helper"

defineProps<{
  report: any
}>()

const getHealthy = useNuxtApp().$getHealthy as (deg: number) => "healthy" | "need_to_fix" | "dangerous"
</script>

<template>
  <div class="flex flex-col max-w-[450px]" >
    <ReportSkeleton :report="report" test="frontal"/>

    <ReportCard title="گردن" :level="getHealthy(report['neck']['left'])">
      گردن شما {{ convertToPersianNumber(Math.abs(report['neck']['left']).toString()) }}° درجه به سمت
      {{ report['neck']['left'] > report['neck']['right'] ? 'راست' : 'چپ' }} کجی دارد
    </ReportCard>

    <ReportCard title="شانه راست" :level="getHealthy(report['shoulder']['right'])">
      شانه راست شما {{ convertToPersianNumber(Math.abs(report['shoulder']['right']).toString()) }}° درجه به سمت
      {{ report['shoulder']['right'] > 0 ? 'بالا' : 'پایین' }} افتادگی دارد.
    </ReportCard>

    <ReportCard title="شانه چپ" :level="getHealthy(report['shoulder']['left'])">
      شانه چپ شما {{ convertToPersianNumber(Math.abs(report['shoulder']['left']).toString()) }}° درجه به سمت
      {{ report['shoulder']['left'] > 0 ? 'بالا' : 'پایین' }} افتادگی دارد.
    </ReportCard>

    <ReportCard title="لگن راست" :level="getHealthy(report['hip']['right'])">
      لگن راست شما {{ convertToPersianNumber(Math.abs(report['hip']['right']).toString()) }}° درجه به سمت
      {{ report['hip']['right'] > 0 ? 'بالا' : 'پایین' }} عدم تقارن دارد.
    </ReportCard>

    <ReportCard title="لگن چپ" :level="getHealthy(report['hip']['left'])">
      لگن چپ شما {{ convertToPersianNumber(Math.abs(report['hip']['left']).toString()) }}° درجه به سمت
      {{ report['hip']['left'] > 0 ? 'بالا' : 'پایین' }} عدم تقارن دارد.
    </ReportCard>

    <ReportCard title="زانوی راست" :level="getHealthy(report['knee']['right'])">
      زانوی راست شما {{ convertToPersianNumber(Math.abs(report['knee']['right']).toString()) }}° درجه به سمت
      {{ report['knee']['right'] > 0 ? 'بیرون' : 'داخل' }} انحراف دارد.
    </ReportCard>

    <ReportCard title="زانوی چپ" :level="getHealthy(report['knee']['left'])">
      زانوی چپ شما {{ convertToPersianNumber(Math.abs(report['knee']['left']).toString()) }}° درجه به سمت
      {{ report['knee']['left'] > 0 ? 'بیرون' : 'داخل' }} انحراف دارد.
    </ReportCard>
  </div>
</template>

<style scoped>

</style>