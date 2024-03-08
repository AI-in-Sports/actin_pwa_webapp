<script setup lang="ts">
import type {Ref} from "vue"
import type {ExerciseDaysType} from "~/stores/survey.types"

const items = shallowRef([
  {
    title: "شنبه",
    value: "Saturday",
  },
  {
    title: "یکشنبه",
    value: "Sunday",
  },
  {
    title: "دوشنبه",
    value: "Monday",
  },
  {
    title: "سه شنبه",
    value: "Tuesday",
  },
  {
    title: "چهارشنبه",
    value: "Wednesday",
  },
  {
    title: "پنجشنبه",
    value: "Thursday",
  },
  {
    title: "جمعه",
    value: "Friday",
  }
] as {
  title: string,
  value: ExerciseDaysType
}[])

const exercise_place = surveyComputed("user_info", "exercise_days") as Ref<string[]>
</script>

<template>
  <div class="w-full grid grid-cols-3 gap-[16px] place-items-center place-content-center">
    <SurveyUtilsItem
        class="w-full"
        v-for="item in items" :key="item.value" :title="item.title"
        @click="selectItem('user_info','exercise_days', item.value, false)"
        :selected="exercise_place!.includes(item.value)"/>
  </div>
</template>

<style scoped>

</style>