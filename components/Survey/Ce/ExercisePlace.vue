<script setup lang="ts">
import {selectItem, surveyComputed} from "~/stores/survey"
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

const exercise_place = surveyComputed('exercise_place') as Ref<string[]>

useHead({title: "محل تمرین"})
</script>

<template>
  <div class="flex flex-col gap-[16px] overflow-hidden">
    <h3 class="text-[16px] text-mainBlack px-2">در چه مکانی دوست دارید تمرین کنید؟</h3>

    <div class="flex flex-col gap-[16px] overflow-auto px-2">
      <SurveyCeUtilsItem
          v-for="item in items" @click="selectItem('exercise_place', item.value)"
          :key="item.value" :title="item.title"
          :selected="exercise_place!.includes(item.value)"/>
    </div>
  </div>
</template>

<style scoped>

</style>