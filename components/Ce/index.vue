<script setup lang="ts">
import type {ExerciseResponse} from "~/types/Responses"
import { numberToWords } from "@persian-tools/persian-tools"
import jalali from "jalaali-js"
import type {Ref} from "vue"
import type {ExerciseDays} from "~/stores/survey.types"

const isReady = ref(false)

const dates: Ref<Date[]> = shallowRef([])
const currentDate = shallowRef(new Date())

const {data, error} = apiSSRFetch<ExerciseResponse>("/ce/exercise/getAll", {
  auth: true,
  transform: (input: {
    startDate: string,
    currentDay: number,
    exercises: any[],
    exerciseDays: ExerciseDays[]
  }): ExerciseResponse => {
    return {
      ...input,
      startDate: new Date(input.startDate)
    }
  }
})

onMounted(() => {
  const res = useRoute().query.res
  const toast = useNuxtApp().$showToast

  const todayDate = new Date()
  const todayDay = todayDate.getDay()
  const startDate = new Date(todayDate)

  startDate.setDate(todayDate.getDate() + (7 - todayDay))

  for (let i = 0; i < 7; i++) {
    const nowDate = new Date(startDate)
    nowDate.setDate(startDate.getDate() + i)
    dates.value.push(new Date(nowDate.toISOString().split('T')[0]))
  }

  isReady.value = true

  switch (res) {
    case "pg_err":
      toast.warning("برای ایجاد برنامه ابتدا فرم وضعیت جسمی را تکمیل نمایید!")
      break
  }
})
</script>

<template>
  <section v-if="isReady" class="h-full w-full flex flex-col max-w-[500px] text-mainBlack">
    <header class="flex justify-between">
      <p class="text-[20px] font-semibold">روز {{ numberToWords(data!['currentDay']!, {ordinal: true}) }}</p>

      <p class="text-[16px] font-mainSubDead">{{
          new Intl.DateTimeFormat('fa-IR', {month: 'short'}).format(currentDate) + " " +
          jalali.toJalaali(currentDate).jy
      }}</p>
    </header>

    <section class="flex gap-[16px] mt-[24px]">
      <div class="flex w-full justify-between">
        <div class="flex flex-col items-center px-[8px] py-[12px] w-full rounded-full text-mainSubDead max-w-[46px]"
             v-for="(day, index) in dates" :key="index"
             :class="{
               '!text-white !bg-mainBlack/50': data?.exerciseDays.includes(day.toLocaleDateString('en-US', { weekday: 'long' }) as ExerciseDays),
               '!text-white !bg-mainBlack': data?.exerciseDays.includes(new Date().toLocaleDateString('en-US', { weekday: 'long' }) as ExerciseDays),
               '!border-[1px] !border-mainBlack': day.getDay() === new Date().getDay(),
             }">
          <p class="text-[14px]">
            {{ day.toLocaleDateString("fa-IR", { weekday: 'long' })[0] }}
          </p>

          <p class="text-[16px] mt-[20px]">
            {{ convertToPersianNumber(jalali.toJalaali(day).jd.toString()) }}
          </p>
        </div>
      </div>
    </section>

    <article class="mt-[28px] flex flex-col gap-[12px] relative h-full">
      <CeCard v-for="ce in data?.exercises" :key="ce.uuid" :exercise="ce"/>
    </article>
  </section>

  <section v-else class="h-full w-full flex flex-col max-w-[500px]">
    <header class="flex justify-between">
      <Skeletor width="40%" class="self-center" height="48px" pill/>
      <Skeletor width="40%" class="self-center" height="48px" pill/>
    </header>

    <section class="flex gap-[16px] mt-[24px]">
      <Skeletor
          v-for="i in 7" :key="i"
          class="w-full" height="90px" pill/>
    </section>

    <article class="flex flex-col gap-[12px] mt-[38px]">
      <Skeletor width="100%" class="self-center" height="88" v-for="i in 3" :key="i"/>
    </article>
  </section>
</template>

<style scoped>

</style>