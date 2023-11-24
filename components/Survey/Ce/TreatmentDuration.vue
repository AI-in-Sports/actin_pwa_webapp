<script setup lang="ts">
import {surveyComputed} from "~/stores/survey"

const items = shallowRef([
  {
    title: "زیر ۱ ماه",
    value: "1m_to_3m"
  },
  {
    title: "۱ ماه تا سه ماه",
    value: "3m_to_6m"
  },
  {
    title: "بیش از ۶ ماه",
    value: "more_than_6m"
  }
])

const treatment_duration = surveyComputed('treatment_duration')

useHead({title: "طول درمان"})
</script>

<template>
  <div class="flex flex-col gap-[16px]">
    <h3 class="text-[16px] text-mainBlack">طول درمان شما چقدر بوده است؟</h3>

    <SurveyCeUtilsItem
        v-for="item in items"
        @click="treatment_duration = item.value"
        :key="item.value" :title="item.title"
        :selected="treatment_duration === item.value"/>
  </div>
</template>

<style scoped>

</style>