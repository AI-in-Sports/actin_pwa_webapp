<script setup lang="ts">
import type {Ref} from "vue"

const items = shallowRef([
  {
    title: "باشگاه",
    value: "GYM",
  },
  {
    title: "باشگاه خانگی",
    value: "HOME_GYM",
  },
  {
    title: "منزل",
    value: "HOME"
  },
  {
    title: "محل کار",
    value: "WORK"
  }
])

const exercise_place = surveyComputed("user_info", "exercise_place") as Ref<string[]>
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full">
    <p class="font-semibold text-[24px] text-black/90 mb-8 text-center">در چه مکانی دوست دارید تمرین کنید؟</p>

    <div class="flex flex-col w-full gap-4">
      <SurveyUtilsItem
          v-for="item in items"
          @click="selectItem('user_info','exercise_place', item.value)"
          :key="item.value" :title="item.title"
          :selected="exercise_place!.includes(item.value)"/>
    </div>
  </div>
</template>

<style scoped>

</style>