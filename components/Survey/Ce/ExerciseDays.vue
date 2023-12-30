<script setup lang="ts">
import type {Ref} from "vue"
import type {ExerciseDays} from "~/stores/survey.types"

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
  value: ExerciseDays
}[])

const emit = defineEmits(['validate'])

const exercise_days = surveyComputed("survey1", "exercise_days") as Ref<string[]>

const isValid = () => emit('validate', exercise_days.value.length === 0)

isValid()

const select = (value: string) => {
  selectItem('survey1','exercise_days', value, false)
  isValid()
}
</script>

<template>
  <div class="flex flex-col gap-[16px] overflow-auto px-2">
    <SurveyUtilsItem
        v-for="item in items" :key="item.value"
        :title="item.title" @click="select(item.value)"
        :selected="exercise_days!.includes(item.value)"/>
  </div>
</template>