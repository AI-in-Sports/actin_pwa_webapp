<script setup lang="ts">
import {surveyComputed} from "~/stores/survey"

const items = shallowRef([
  {
    title: "بله",
    value: true
  },
  {
    title: "خیر",
    value: false
  }
])

const treatment_duration_done = surveyComputed('treatment_duration_done')

useHead({title: "تکمیل طول درمان"})
</script>

<template>
  <div class="flex flex-col gap-[16px]">
    <h3 class="text-[16px] text-mainBlack">آیا بعد از عمل جراحی طول درمان‌ خود را کامل کرده‌اید؟</h3>

    <SurveyCeUtilsItem
        v-for="item in items"
        @click="treatment_duration_done = item.value"
        :key="item.title" :title="item.title"
        :selected="treatment_duration_done === item.value"/>
  </div>
</template>

<style scoped>

</style>