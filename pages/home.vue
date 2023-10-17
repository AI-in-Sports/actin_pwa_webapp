<script setup lang="ts">
import {JalaaliDateObject} from "jalaali-js"
import s1 from "~/assets/slides/1.jpg"
import s2 from "~/assets/slides/2.jpg"
import s3 from "~/assets/slides/3.jpg"
import s4 from "~/assets/slides/4.jpg"
import s5 from "~/assets/slides/5.jpg"
import axios from "axios"

definePageMeta({
  middleware:  ["normal-auth"]
})

const config = useRuntimeConfig()

const user = useCookie("user").value
const reports = shallowRef()
const reservations = shallowRef()

const pagination = shallowRef({el: '.swiper-pagination', type: 'bullets'})
const slides = shallowRef([s1, s2, s3, s4, s5])

const logout = useNuxtApp().$logout

interface Report {
  testId: string,
  date: string | Date | JalaaliDateObject
}

onMounted(async () => {
  const act = useRoute().query.act
  const toast = useNuxtApp().$showToast

  switch (act) {
    case "sid_inv":
      toast.error("کد تست نامعتبر است!")
      break

    case "sid_tkn":
      toast.error("کد قبلا اسکن شده است و برای شخص دیگری ثبت شده است!")
      break

    case "srv_err":
      toast.error("خطا از سمت سرور!")
      break

    case "rep_done":
      toast.success("اطلاعات تست با موفقیت ذخیره شد!")
      break

    case "lg_done":
      toast.success("خوش آمدید!")
      break
  }

  const loading = toast.loading("در حال دریافت اطلاعات...")

  await axios.get(`${config.public.EXPRESS_BACKEND}/report/get`, {
    headers: {
      "Authorization": `Bearer ${useCookie("token").value}`
    }
  }).then((value) => {

    toast.remove(loading)

    reports.value = (value.data as Report[]).map(item => ({
      testId: item.testId,
      date: new Date(item.date as string)
    }))
  })

  await axios.get(`${config.public.EXPRESS_BACKEND}/reservation/getAll`, {
    headers: {
      "Authorization": `Bearer ${useCookie("token").value}`
    }
  }).then((value) => {

    toast.remove(loading)

    reservations.value = value.data.data
  })
})

useHead({title: "Actin test reports"})
</script>

<template>
  <div class="flex flex-col items-center h-[100dvh]" dir="rtl">
    
    <header class="flex items-center px-[14px] py-[16px] w-full">
      <div class="w-full"></div>

      <div class="w-full flex justify-center">
        <img src="@/assets/images/logo_tr_white.png" alt="Actin" class="h-[50px] w-auto">
      </div>

      <div class="w-full flex justify-end">
        <FaIcon class="rotate-180 text-[24px] text-black/60 cursor-pointer"
                icon="arrow-right-from-bracket" @click="logout"/>
      </div>
    </header>

    <div class="w-full overflow-auto pt-[40px] flex justify-center">
      <div class="flex flex-col max-w-[450px] w-full" v-if="user">
        <h1 class="text-[24px] text-[#212121] font-bold w-full px-[24px]">خوش آمدید، {{ (user as any)['fullName'] }}</h1>

        <div class="w-full pr-[16px] mt-[24px]">
          <Swiper
              :modules="[SwiperAutoplay, SwiperEffectCreative, SwiperPagination]"
              :slides-per-view="1.2"
              :loop="true"
              :autoplay="{
                delay: 8000,
                disableOnInteraction: true,
          }"
              :pagination="pagination as any">
            <SwiperSlide v-for="slide in slides" :key="slide" class="pl-[12px] cursor-grab">
              <img :src="slide" alt="slide" class="w-full rounded-[16px]">
            </SwiperSlide>
          </Swiper>
        </div>

        <h2 class="mt-[24px] px-[16px] text-[#212121] text-[18px] font-bold">نوبت‌های من</h2>

        <div v-if="reservations" class="px-[16px]">
          <HomeReservationCard v-for="res in reservations" :key="res.name" :data="res" class="mt-[16px]"/>
        </div>

        <h2 class="mt-[24px] px-[16px] text-[#212121] text-[18px] font-bold">تاریخچه ارزیابی‌ها</h2>

        <div v-if="reports" class="px-[16px] pb-[16px]">
          <HomeReportCard v-for="report in reports" :key="report.testId" :data="report" class="mt-[16px]"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>