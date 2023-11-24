<script setup lang="ts">
import Jalali from "jalaali-js";
import {convertToPersianNumber} from "~/helper"
import {surveyComputed} from "~/stores/survey"

const genderCards = shallowRef([
  {
    value: "male",
    name: "مرد",
    icon: `
      <path d="M19.7709 17.7002H8.22464C3.68174 17.7002 0 21.3531 0 25.8603V37.5668C0 40.5738 1.63956 43.1992 4.07765 44.6128C4.51382 44.8658 5.06183 44.5596 5.06183 44.058V26.5816C5.06183 26.2997 5.29222 26.0689 5.57853 26.0689C5.8626 26.0689 6.09522 26.2975 6.09522 26.5816V68.1567C6.09522 70.1762 7.6632 71.9382 9.69867 71.9982C11.8035 72.0603 13.5325 70.3848 13.5325 68.3098V47.2138C13.5325 46.9319 13.7629 46.7011 14.0492 46.7011C14.3333 46.7011 14.5659 46.9297 14.5659 47.2138V68.1544C14.5659 70.174 16.1339 71.936 18.1694 71.9959C20.2742 72.0581 22.0032 70.3826 22.0032 68.3076V26.586C22.0032 26.3042 22.2336 26.0734 22.5199 26.0734C22.804 26.0734 23.0366 26.3019 23.0366 26.586V44.0003C23.0366 44.5041 23.5935 44.8126 24.0275 44.5507C26.4074 43.1215 28 40.5294 28 37.5668V25.8603C28 21.3531 24.3183 17.7002 19.7754 17.7002H19.7709Z"/>
      <path d="M21.1325 10.3618C22.0573 6.47422 19.6306 2.57889 15.7123 1.66134C11.794 0.743793 7.86787 3.15147 6.94306 7.03905C6.01826 10.9266 8.44497 14.8219 12.3633 15.7395C16.2816 16.657 20.2077 14.2494 21.1325 10.3618Z"/>
    `
  },
  {
    value: "female",
    name: "زن",
    icon: `
      <path d="M20.1289 15.0228C22.9382 12.2572 22.9382 7.77312 20.1289 5.00746C17.3195 2.2418 12.7647 2.2418 9.95539 5.00746C7.14606 7.77312 7.14606 12.2571 9.95539 15.0228C12.7647 17.7885 17.3195 17.7885 20.1289 15.0228Z"/>
      <path d="M30 54.2817L26.0312 44.2814C27.7309 42.8168 28.8147 40.6785 28.8147 38.2816V26.8189C28.8147 22.4054 25.1814 18.8286 20.6983 18.8286H9.30395C4.82084 18.8286 1.18755 22.4054 1.18755 26.8189V38.2816C1.18755 40.6785 2.27136 42.8168 3.97101 44.2814L0 54.2817H7.20035V68.2369C7.20035 70.2144 8.7477 71.9398 10.7564 71.9984C12.8335 72.0593 14.5398 70.4186 14.5398 68.3869V54.2795H15.5574V68.2347C15.5574 70.2122 17.1047 71.9376 19.1134 71.9963C21.1905 72.0571 22.8968 70.4165 22.8968 68.3847V54.2773H30V54.2817ZM23.4067 27.0253C23.687 27.0253 23.9166 27.2491 23.9166 27.5273V38.9509L22.8968 36.3824V27.5251C22.8968 27.2491 23.1241 27.0231 23.4067 27.0231V27.0253ZM6.18056 38.7032V27.5273C6.18056 27.2513 6.40792 27.0253 6.69046 27.0253C6.973 27.0253 7.20035 27.2491 7.20035 27.5273V36.1368L6.18056 38.7032Z"/>
    `
  }
])

const survey = useCESurveyStore()

const birthday = computed({
  get() { return new Date(survey.birthday!) },
  set(value) { survey.set("birthday", value) }
})

const weight = surveyComputed('weight')

const height = surveyComputed('height')

const persianDatePicker = ref()

const jbd = computed(() => Jalali.toJalaali(birthday.value!))

const openDatePicker = () => persianDatePicker.value.focus()

useHead({title: "مشخصات ظاهری"})
</script>

<template>
  <div class="rounded-[16px] border-[1px] border-[#C1C1C1] p-[16px] flex gap-[15px] mb-[16px]">
    <div class="w-1/3">
      <p class="text-[16px] text-mainBlack">جنسیت</p>
    </div>
    <div class="w-1/3 flex items-center border-[#C1C1C1] border-[1px] rounded-[8px] p-[8px] cursor-pointer"
         v-for="gender in genderCards" :key="gender.value" @click="survey.set('gender', gender.value)"
         :class="{ '!border-[#F0A300] bg-[#FDF6E5]': gender.value === survey.gender }">

      <PrimaryCheckBox :checked="survey.gender === gender.value"/>

      <p class="ml-[8px]">{{ gender.name }}</p>

      <svg xmlns="http://www.w3.org/2000/svg" class="mr-auto" width="28" height="72" viewBox="0 0 28 72" :fill="survey.gender === gender.value ? '#F9B519' : '#C1C1C1'" v-html="gender.icon">
      </svg>
    </div>
  </div>

  <DatePicker ref="persianDatePicker" v-model="birthday" format="YYYY-MM-DD" display-format="jYYYY-jMM-jDD" simple></DatePicker>

  <div class="rounded-[16px] border-[1px] border-[#C1C1C1] p-[16px] flex flex-col mb-[16px]">
    <p class="text-[16px] text-mainBlack mb-[16px]">تاریخ تولد</p>

    <div class="flex gap-[22px]" @click="openDatePicker">
      <div class="w-1/3 flex flex-col text-mainBlack">
        <p class="font-bold text-[14px]">روز</p>

        <p class="bg-[#F0A3001A] p-[6px] rounded-[8px] text-center text-[16px] font-medium">
          {{ convertToPersianNumber(jbd.jd.toString()) }}
        </p>
      </div>
      <div class="w-1/3 flex flex-col text-mainBlack">
        <p class="font-bold text-[14px]">ماه</p>

        <p class="bg-[#F0A3001A] p-[6px] rounded-[8px] text-center text-[16px] font-medium">
          {{ new Intl.DateTimeFormat('fa-IR', {month: 'short'}).format(birthday!) }}
        </p>
      </div>
      <div class="w-1/3 flex flex-col text-mainBlack">
        <p class="font-bold text-[14px]">سال</p>

        <p class="bg-[#F0A3001A] p-[6px] rounded-[8px] text-center text-[16px] font-medium">
          {{ convertToPersianNumber(jbd.jy.toString()) }}
        </p>
      </div>
    </div>
  </div>

  <div class="flex gap-[16px] w-full">
    <div class="rounded-[16px] border-[1px] border-[#C1C1C1] p-[16px] flex flex-col w-1/2">
      <p class="text-[16px] text-mainBlack mb-[16px]">وزن</p>

      <div class="mt-[16px] flex pl-[6px] items-center">
        <input class="w-full p-[6px] bg-[#F0A3001A] rounded-[8px] outline-none text-center"
               type="number" v-model="weight">

        <p class="text-[20px] font-medium mr-[16px]">Kg</p>
      </div>
    </div>
    <div class="rounded-[16px] border-[1px] border-[#C1C1C1] p-[16px] flex flex-col w-1/2">
      <p class="text-[16px] text-mainBlack mb-[16px]">قد</p>

      <div class="mt-[16px] flex pl-[6px] items-center">
        <input class="w-full p-[6px] bg-[#F0A3001A] rounded-[8px] outline-none text-center"
               type="number" v-model="height">

        <p class="text-[20px] font-medium mr-[16px]">Cm</p>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.vpd-input-group
  display: none!important
</style>