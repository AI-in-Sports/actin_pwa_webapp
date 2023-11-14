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

    <ReportCard title="گردن" :level="report['neck']['left']['grade']" type="frontal">
      گردن شما {{ convertToPersianNumber(Math.abs(report['neck']['left']['deg']).toString()) }}° درجه به سمت
      {{ report['neck']['left']['deg'] > report['neck']['right']['deg'] ? 'راست' : 'چپ' }} کجی دارد
    </ReportCard>

    <ReportCard title="شانه راست" :level="report['shoulder']['right']['grade']" type="frontal">
      شانه راست شما {{ convertToPersianNumber(Math.abs(report['shoulder']['right']['deg']).toString()) }}° درجه به سمت
      {{ report['shoulder']['right']['deg'] > 0 ? 'بالا' : 'پایین' }} افتادگی دارد.
    </ReportCard>

    <ReportCard title="شانه چپ" :level="report['shoulder']['left']['grade']" type="frontal">
      شانه چپ شما {{ convertToPersianNumber(Math.abs(report['shoulder']['left']['deg']).toString()) }}° درجه به سمت
      {{ report['shoulder']['left']['deg'] > 0 ? 'بالا' : 'پایین' }} افتادگی دارد.
    </ReportCard>

    <ReportCard title="لگن راست" :level="report['hip']['right']['grade']" type="frontal">
      لگن راست شما {{ convertToPersianNumber(Math.abs(report['hip']['right']['deg']).toString()) }}° درجه به سمت
      {{ report['hip']['right']['deg'] > 0 ? 'بالا' : 'پایین' }} عدم تقارن دارد.
    </ReportCard>

    <ReportCard title="لگن چپ" :level="report['hip']['left']['grade']" type="frontal">
      لگن چپ شما {{ convertToPersianNumber(Math.abs(report['hip']['left']['deg']).toString()) }}° درجه به سمت
      {{ report['hip']['left']['deg'] > 0 ? 'بالا' : 'پایین' }} عدم تقارن دارد.
    </ReportCard>

    <ReportCard title="زانوی راست" :level="report['knee']['right']['grade']" type="frontal">
      زانوی راست شما {{ convertToPersianNumber(Math.abs(report['knee']['right']['deg']).toString()) }}° درجه به سمت
      {{ report['knee']['right']['deg'] > 0 ? 'بیرون' : 'داخل' }} انحراف دارد.
    </ReportCard>

    <ReportCard title="زانوی چپ" :level="report['knee']['left']['grade']" type="frontal">
      زانوی چپ شما {{ convertToPersianNumber(Math.abs(report['knee']['left']['deg']).toString()) }}° درجه به سمت
      {{ report['knee']['left']['deg'] > 0 ? 'بیرون' : 'داخل' }} انحراف دارد.
    </ReportCard>
  </div>
</template>

<style scoped>

</style>