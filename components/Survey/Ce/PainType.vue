<script setup lang="ts">
import {selectItem} from "~/stores/survey"
import type {Ref} from "vue"

const items = shallowRef([
  {
    title: "هیچ کدام",
    value: "none",
  },
  {
    title: "گزگز و سوزن سوزن شدن",
    value: "tingling_and_tingling"
  },
  {
    title: "خواب رفتن",
    value: "paresthesia"
  },
  {
    title: "مور مور و بی حسی",
    value: "numbness"
  },
  {
    title: "گُر گرفتگی",
    value: "hot_flash"
  }
])

const pain_points_status = surveyComputed('pain_type') as Ref<string[]>


useHead({title: "نوع درد"})
</script>

<template>
  <div class="flex flex-col gap-[16px] overflow-hidden">
    <h3 class="text-[16px] text-mainBlack px-2">دردی که در این ناحیه احساس می‌کنید چگونه است؟</h3>

    <div class="flex flex-col gap-[16px] overflow-auto px-2">
      <SurveyCeUtilsItem
          v-for="item in items" @click="selectItem('pain_type', item.value)"
          :key="item.value" :title="item.title"
          :selected="pain_points_status!.includes(item.value)"/>
    </div>
  </div>
</template>

<style scoped>

</style>