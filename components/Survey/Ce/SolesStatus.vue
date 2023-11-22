<script setup lang="ts">
import hollow_soles from "assets/images/survey/soles_hollow.png"
import flat_soles from "assets/images/survey/soles_flat.png"
import normal_soles from "assets/images/survey/soles_normal.png"
import {surveyComputed} from "~/stores/survey"

const items = shallowRef([
  {
    title: "کف پای گود دارم.",
    value: "hollow",
    img: hollow_soles
  },
  {
    title: "کف پای صاف دارم.",
    value: "flat",
    img: flat_soles
  },
  {
    title: "کف پای من نرمال است.",
    value: "normal",
    img: normal_soles
  }
])

const soles_status = surveyComputed('soles_status')
</script>

<template>
 <div class="flex flex-col gap-[16px]">
   <h3 class="text-[16px] text-mainBlack">وضعیت کف پای شما چگونه است؟</h3>

   <SurveyCeUtilsItem
       v-for="item in items"
       @click="soles_status = item.value"
       :key="item.value" :title="item.title"
       :img="item.img" :selected="soles_status === item.value"/>
 </div>
</template>

<style scoped>

</style>