<script setup lang="ts">
import {surveyComputed} from "~/stores/survey"

const items = shallowRef([
  {
    title: "بیشتر نشسته‌ام.",
    value: "sitting_more"
  },
  {
    title: "بیشتر ایستاده‌ام.",
    value: "standing_more"
  },
  {
    title: "بیشتر راه می‌روم.",
    value: "walking_more"
  }
])

const body_posture_at_work = surveyComputed('body_posture_at_work')

useHead({title: "وضعیت جسمانی در محل کار"})
</script>

<template>
  <div class="flex flex-col gap-[16px]">
    <h3 class="text-[16px] text-mainBlack">وضعیت جسمانی شما در محل کار اغلب به چه شکل است؟</h3>

    <SurveyCeUtilsItem
        v-for="item in items"
        @click="body_posture_at_work = item.value"
        :key="item.value" :title="item.title"
        :selected="body_posture_at_work === item.value"/>
  </div>
</template>

<style scoped>

</style>