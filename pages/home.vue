<script setup lang="ts">
import s1 from "~/assets/slides/1.jpg"
import s2 from "~/assets/slides/2.jpg"
import s3 from "~/assets/slides/3.jpg"
import s4 from "~/assets/slides/4.jpg"
import s5 from "~/assets/slides/5.jpg"
import type {Reservation, Report} from "~/types/Responses"

definePageMeta({
  middleware: ["normal-auth"],
  layout: "main"
})

useAuthStore().$persist()

const user = useAuthStore().user

const pagination = shallowRef({el: '.swiper-pagination', type: 'bullets'})
const slides = shallowRef([s1, s2, s3, s4, s5])

const logout = () => {
  useAuthStore().logout()
  location.reload()
}

const {pending, data: fetchData} = await useAsyncData(async () => {
  const [reservations, reports] = await Promise.all([
    apiSSRFetch<Reservation[]>("/reservation/getAll", {
      auth: true,
      lazy: true
    }),
    apiSSRFetch<Report[]>("/report/getAll", {
      auth: true,
      lazy: true
    })
  ])

  return {
    reports: reports.data.value?.map(item => ({
      testId: item.testId,
      date: new Date(item.date as string)
    })),
    reservations: reservations.data
  }
})

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

    case "survey_done":
      toast.success("فرم با موفقیت تکمیل شد!")
      break
  }
})

useHead({title: "Actin health"})
</script>

<template>
  <header class="flex items-center px-[14px] py-[16px] w-full">
    <div class="w-full"></div>

    <div class="w-full flex justify-center">
      <img src="@/assets/images/logo_tr_white.png" alt="Actin" class="h-[50px] w-auto">
    </div>

    <div class="w-full flex justify-end">
      <FaIcon class="rotate-180 text-[24px] text-black/60 cursor-pointer"
              icon="arrow-right-from-bracket" @click="logout()"/>
    </div>
  </header>

  <div class="w-full overflow-auto pt-[40px] flex justify-center">
    <div class="flex flex-col max-w-[450px] w-full" v-if="user">
      <h1 class="text-[24px] text-[#212121] font-bold w-full px-[24px]">خوش آمدید، {{ (user as any)['fullName'] }}</h1>

      <div class="w-full pr-[16px] mt-[24px]">
        <client-only>
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
        </client-only>
      </div>

        <h2 v-if="!pending && fetchData?.reservations.value?.length" class="mt-[24px] px-[16px] text-[#212121] text-[18px] font-bold">نوبت‌های من</h2>

        <div v-if="!pending" class="px-[16px]">
          <HomeReservationCard v-for="res in fetchData?.reservations.value" :key="res.name" :data="res" class="mt-[16px]"/>
        </div>

        <h2 v-if="!pending && fetchData?.reports?.length" class="mt-[24px] px-[16px] text-[#212121] text-[18px] font-bold">تاریخچه ارزیابی‌ها</h2>

        <div v-if="!pending" class="px-[16px] pb-[16px]">
          <HomeReportCard v-for="report in fetchData?.reports" :key="report.testId" :data="report" class="mt-[16px]"/>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>