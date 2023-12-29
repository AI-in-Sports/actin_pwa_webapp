<script setup lang="ts">
import type {ExerciseResponse} from "~/types/Responses"
import jalali from "jalaali-js"
import type {Ref} from "vue"

const user = useAuthStore().user

const isReady = ref(false)

const exercises = ref()
const activeWeek = shallowRef(0)
const dates: Ref<Date[]> = shallowRef([])
const currentDate = shallowRef(new Date())

const {data, error} = apiSSRFetch<ExerciseResponse>("/ce/exercise/getAll", {
  auth: true,
  transform: (input: {
    startDate: string,
    exercises: any[]
  }) => {
    return {
      exercises,
      startDate: new Date(input.startDate)
    }
  }
})

onMounted(() => {
  const res = useRoute().query.res
  const toast = useNuxtApp().$showToast

  if (!error.value)
  {

    for (let i = 0; i < 7; i++) {
      const lastDate = dates.value[dates.value.length - 1]

      const date = dates.value.length > 0 ? new Date(new Date().setDate(lastDate.getDate() + 1)) : new Date()

      dates.value.push(date)
    }

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
      <p class="text-[20px] font-semibold">هفته اول</p>

      <p class="text-[16px] font-mainSubDead">{{
          new Intl.DateTimeFormat('fa-IR', {month: 'short'}).format(currentDate) + " " +
          jalali.toJalaali(currentDate).jy
      }}</p>
    </header>

    <section class="flex gap-[16px] mt-[24px]">
      <div class="flex w-full justify-between">
        <div class="flex flex-col items-center px-[8px] py-[12px] cursor-pointer w-full rounded-full text-mainSubDead max-w-[46px]"
             v-for="(day, index) in dates" :key="index" @click="activeWeek = index"
             :class="{ '!text-white !bg-mainBlack': activeWeek === index }">
          <p :class="{ 'text-[14px]': activeWeek === index, 'text-[10px]': activeWeek !== index }">
            {{ day.toLocaleDateString("fa-IR", { weekday: 'long' })[0] }}
          </p>

          <p class="text-[16px] mt-[20px]">
            {{ convertToPersianNumber(jalali.toJalaali(day).jd.toString()) }}
          </p>
        </div>
      </div>
    </section>
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