<script setup lang="ts">
import {surveyComputed} from "~/stores/survey"

const items = shallowRef([
  {
    title: "زیر ۱ ماه",
    value: "less_than_1m"
  },
  {
    title: "۱ ماه تا سه ماه",
    value: "1m_to_3m"
  },
  {
    title: "۳ ماه نا ۶ ماه",
    value: "3m_to_6m"
  },
  {
    title: "بیش از یکسال",
    value: "more_than_1y"
  }
])

const pain_time = surveyComputed('pain_time')

useHead({title: "مدت زمان احساس درد"})
</script>

<template>
  <div class="flex flex-col gap-[16px]">
    <h3 class="text-[16px] text-mainBlack">چه مدت است که در این ناحیه احساس درد می‌کنید؟</h3>

    <SurveyCeUtilsItem
        v-for="item in items"
        @click="pain_time = item.value"
        :key="item.value" :title="item.title"
        :selected="pain_time === item.value"/>
  </div>
</template>

<style scoped>

</style>