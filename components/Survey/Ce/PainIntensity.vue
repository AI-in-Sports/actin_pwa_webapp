<script setup lang="ts">
import {surveyComputed} from "~/stores/survey"

const pain_intensity = surveyComputed('pain_intensity')

useHead({title: "میزان آزاردهندگی درد"})
</script>

<template>
  <div class="flex flex-col gap-[50px]">
    <h3 class="text-[16px] text-mainBlack">درد در این ناحیه، حین انجام فعالیت‌های روزانه چقدر آزاردهنده است؟</h3>

    <SurveyCeUtilsRangeSlider v-model:value="pain_intensity as number"/>
  </div>
</template>

<style scoped>

</style>