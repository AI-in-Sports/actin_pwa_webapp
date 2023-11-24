<script setup lang="ts">
import point_knee from "assets/images/survey/point_knee.png"
import point_neck from "assets/images/survey/point_neck.png"
import point_elbow from "assets/images/survey/point_elbow.png"
import point_shoulder from "assets/images/survey/point_shoulder.png"
import point_wrist from "assets/images/survey/point_wrist.png"
import point_waist from "assets/images/survey/point_waist.png"
import point_ankle from "assets/images/survey/point_ankle.png"
import point_pelvis from "assets/images/survey/point_pelvis.png"
import point_sciatic from "assets/images/survey/point_sciatic.png"
import {selectItem, surveyComputed} from "~/stores/survey"
import type {Ref} from "vue"

const items = shallowRef([
  {
    title: "هیچ کدام",
    value: "none",
  },
  {
    title: "زانو",
    value: "knee",
    img: point_knee
  },
  {
    title: "گردن",
    value: "neck",
    img: point_neck
  },
  {
    title: "آرنج",
    value: "elbow",
    img: point_elbow
  },
  {
    title: "شونه",
    value: "shoulder",
    img: point_shoulder
  },
  {
    title: "مچ دست",
    value: "wrist",
    img: point_wrist
  },
  {
    title: "کمر",
    value: "waist",
    img: point_waist
  },
  {
    title: "مچ پا",
    value: "ankle",
    img: point_ankle
  },
  {
    title: "لگن",
    value: "pelvis",
    img: point_pelvis
  },
  {
    title: "عصب سیاتیک",
    value: "sciatic_nerve",
    img: point_sciatic
  }
])

const pain_points_status = surveyComputed('pain_points') as Ref<string[]>

useHead({title: "ناحیه درد"})
</script>

<template>
  <div class="flex flex-col gap-[16px] overflow-hidden">
    <h3 class="text-[16px] text-mainBlack px-2">در کدام یک از قسمت‌های مشخص شده احساس درد می‌کنید؟</h3>

    <div class="flex flex-col gap-[16px] overflow-auto px-2">
      <SurveyCeUtilsItem
          v-for="item in items" @click="selectItem('pain_points', item.value)"
          :key="item.value" :title="item.title" :img="item.img"
          :selected="pain_points_status!.includes(item.value)"/>
    </div>
  </div>
</template>

<style scoped>

</style>