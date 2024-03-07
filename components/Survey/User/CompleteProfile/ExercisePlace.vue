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

const exercise_place = surveyComputed("user_info", "exercise_place") as Ref<string[]>
</script>

<template>
  <div class="flex flex-col w-full gap-[16px]">
    <SurveyUtilsItem
        v-for="item in items"
        @click="selectItem('user_info','exercise_place', item.value)"
        :key="item.value" :title="item.title"
        :selected="exercise_place!.includes(item.value)"/>
  </div>
</template>

<style scoped>

</style>