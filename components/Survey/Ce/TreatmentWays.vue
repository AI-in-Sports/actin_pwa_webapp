<script setup lang="ts">
import {selectItem, surveyComputed} from "~/stores/survey"
import type {Ref} from "vue"

const items = shallowRef([
  {
    title: "هیچ‌کدام",
    value: "none",
  },
  {
    title: "فیزیوتراپی",
    value: "physiotherapy",
  },
  {
    title: "آب درمانی",
    value: "hydrotherapy",
  },
  {
    title: "راه رفتن در استخر",
    value: "water_walking"
  },
  {
    title: "ورزش درمانی (حرکت اصلاحی و توانبخشی)",
    value: "exercise_therapy"
  }
])

const treatment_ways = surveyComputed('treatment_ways') as Ref<string[]>

useHead({title: "تجربه روش‌های بازتوانی و درمانی"})
</script>

<template>
  <div class="flex flex-col gap-[16px] overflow-hidden">
    <h3 class="text-[16px] text-mainBlack px-2">تا کنون کدام یک از روش‌های بازتوانی و درمانی زیر را تجربه کرده‌‌اید؟</h3>

    <div class="flex flex-col gap-[16px] overflow-auto px-2">
      <SurveyCeUtilsItem
          v-for="item in items" @click="selectItem('treatment_ways', item.value)"
          :key="item.value" :title="item.title"
          :selected="treatment_ways!.includes(item.value)"/>
    </div>
  </div>
</template>

<style scoped>

</style>