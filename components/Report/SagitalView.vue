<script setup lang="ts">
import {convertToPersianNumber} from "~/helper"

defineProps<{
  report: any
}>()

const getHealthy = useNuxtApp().$getHealthy as (deg: number) => "healthy" | "need_to_fix" | "dangerous"
</script>

<template>
  <div class="flex flex-col max-w-[400px]">
    <ReportSkeleton :report="report" test="sagital"/>

    <ReportCard title="سر به جلو" :level="getHealthy(report['sagital']['forward_head'])">
      سر شما {{ convertToPersianNumber(Math.abs(report['sagital']['forward_head']).toString()) }}° درجه به جلو تمایل دارد (عارضه سر به جلو).
    </ReportCard>

    <ReportCard title="قوز کمر" :level="getHealthy(report['densepose']['H1'])">
      کمر شما {{ convertToPersianNumber(Math.abs(report['densepose']['H1']).toString()) }}° درجه دارای قوز می‌باشد (عارضه قوز کمر).
    </ReportCard>

    <ReportCard title="گودی کمر" :level="getHealthy(report['densepose']['H2'])">
      کمر شما {{ convertToPersianNumber(Math.abs(report['densepose']['H1']).toString()) }}° درجه دارای گودی می‌باشد (عارضه گودی کمر).
    </ReportCard>
  </div>
</template>

<style scoped>

</style>