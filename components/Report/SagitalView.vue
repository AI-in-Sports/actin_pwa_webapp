<script setup lang="ts">
import {convertToPersianNumber} from "~/helper"

defineProps<{
  report: any
}>()
</script>

<template>
  <div class="flex flex-col max-w-[450px]">
    <ReportSkeleton :report="report" test="sagital"/>

    <ReportCard title="سر به جلو" :level="report['sagital']['forward_head']['grade']" type="sagital">
      سر شما {{ convertToPersianNumber(Math.abs(report['sagital']['forward_head']['deg']).toString()) }}° درجه به جلو تمایل دارد (عارضه سر به جلو).
    </ReportCard>

    <ReportCard title="قوز کمر" :level="report['dense_pose']['D1']['grade']" type="kyphosis">
      کمر شما {{ convertToPersianNumber(Math.abs(report['dense_pose']['D1']['deg']).toString()) }}° درجه دارای قوز می‌باشد (عارضه قوز کمر).
    </ReportCard>

    <ReportCard title="گودی کمر" :level="report['dense_pose']['D2']['grade']" type="lordosis">
      کمر شما {{ convertToPersianNumber(Math.abs(report['dense_pose']['D2']['deg']).toString()) }}° درجه دارای گودی می‌باشد (عارضه گودی کمر).
    </ReportCard>
  </div>
</template>

<style scoped>

</style>