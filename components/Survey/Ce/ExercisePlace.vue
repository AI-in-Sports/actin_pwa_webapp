<script setup lang="ts">
import type {Ref} from "vue"

const items = shallowRef([
  {
    title: "باشگاه",
    value: "gym",
  },
  {
    title: "باشگاه خانگی",
    value: "home_gym",
  },
  {
    title: "منزل",
    value: "home"
  },
  {
    title: "محل کار",
    value: "work"
  }
])

const emit = defineEmits(['validate'])

const exercise_place = surveyComputed("survey1", "exercise_place") as Ref<string[]>

const isValid = () => emit('validate', exercise_place.value.length === 0)

isValid()

const select = (value: string) => {
  selectItem('survey1','exercise_place', value)
  isValid()
}
</script>

<template>
  <div class="flex flex-col gap-[16px] overflow-auto px-2">
    <SurveyUtilsItem
        v-for="item in items" :key="item.value"
        :title="item.title" @click="select(item.value)"
        :selected="exercise_place!.includes(item.value)"/>
  </div>
</template>

<style scoped>

</style>