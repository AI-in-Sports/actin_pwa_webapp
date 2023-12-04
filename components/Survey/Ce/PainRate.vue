<script setup lang="ts">
import {surveyComputed} from "~/stores/survey"

const pain_rate = surveyComputed('pain_rate')

useHead({title: "شدت درد"})
</script>

<template>
  <div class="flex flex-col gap-[50px]">
    <h3 class="text-[16px] text-mainBlack">شدت درد در ناحیه مشخص شده چقدر است؟</h3>

    <SurveyCeUtilsRangeSlider v-model:value="pain_rate"/>
  </div>
</template>

<style scoped>

</style>