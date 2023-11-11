<script setup lang="ts">
import ok from "@/assets/images/reservation_green.svg"
import not_ok from "@/assets/images/reservation_red.svg"
import axios from "axios"
import jalali from "jalaali-js"
import {convertToPersianNumber} from "~/helper"

definePageMeta({
  layout: "result",
  middleware: ["normal-auth"]
})

const toast = useNuxtApp().$showToast
const route = useRoute()
const config = useRuntimeConfig()

const res = shallowRef(route.query.res)
const uuid = shallowRef(route.query.uuid)

const physio = ref()

onMounted(async () => {
  const loading = toast.loading("در حال دریافت اطلاعات...")

  await axios(`${config.public.APP_BACKEND}/reservation/get/${uuid}`, {
    headers: {
      "Authorization": useAuthStore().getToken
    }
  }).then((value) => {
    physio.value = value.data['data']

    toast.clearAll()
  }).catch((e) => {
    console.log(e)

    useNuxtApp().$closeLoading(loading, "خطا در دریافت اطلاعات نوبت!")
  })
})

useHead({title: `Actin - `})
</script>

<template>
  <div class="flex max-w-[480px] w-full flex-col items-center justify-center h-full p-4">
    <img :src="res === '200' ? ok : not_ok" alt="reservation">
    <h1 class="text-[#212121] text-[22px] text-center font-bold mt-[24px]">
      {{ res === '200' ? 'بازه مورد نظر نوبت شما ثبت گردید.' : 'پرداخت با خطا مواجه شد!' }}
    </h1>

    <p class="text-[#727272] text-[14px] text-center mt-[16px]">
      {{
        res === '200' ?
            'پس از بررسی همکاران، زمان دقیق به صورت تلفنی با شما هماهنگ می‌شود.' :
            'لطفا دوباره امتحان کنید و در صورت بروز دوباره مشکل با پشتیبانی اکتین در تماس باشید.'
      }}
    </p>

    <div v-if="uuid && physio" class="flex flex-col mt-[32px] w-full items-center">
      <p class="text-[#727272] text-[14px]">
        {{ new Date(physio['date']).toLocaleDateString("fa-IR", { weekday: 'long' }) }}،
        {{ convertToPersianNumber(jalali.toJalaali(new Date(physio['date'])).jd.toString()) + " " }}
        {{ new Date(physio['date']).toLocaleDateString("fa-IR", { month: 'long' }) + " " }}
        {{ physio['time'] }}
      </p>

      <div class="flex mt-[12px] items-center">
        <img src="@/assets/images/dr_prof.png" :alt="physio['name']"
             class="w-[32px] h-[32px] rounded-full ml-[8px]">

        <p class="text-[#212121] text-[14px]">{{ physio['name'] }}</p>
      </div>
    </div>

    <PrimaryButton class="!font-semibold mt-[32px]" @click="$router.replace('/home')">
      بازگشت به خانه
    </PrimaryButton>
  </div>
</template>

<style scoped>

</style>