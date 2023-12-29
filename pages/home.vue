<script setup lang="ts">
import s1 from "~/assets/slides/1.jpg"
import s2 from "~/assets/slides/2.jpg"
import s3 from "~/assets/slides/3.jpg"
import s4 from "~/assets/slides/4.jpg"
import s5 from "~/assets/slides/5.jpg"
import type {Reservation, Report, SurveyStatusResponse} from "~/types/Responses"

definePageMeta({
  middleware: ["normal-auth"],
  layout: "main"
})

useAuthStore().$persist()

const route = useRoute()

const user = useAuthStore().user

const pagination = shallowRef({el: '.swiper-pagination', type: 'bullets'})
const slides = shallowRef([s1, s2, s3, s4, s5])

const logout = () => {
  useAuthStore().logout()
  location.reload()
}

const reports_data = useState(() => [] as Report[])
const reservations_data = useState(() => [] as Reservation[])
const isSurvey = shallowRef(false)

await useLazyAsyncData('home_data', async () => {
  const [reservations, reports, survey] = await Promise.all([
    apiSSRFetch<Reservation[]>("/reservation/getAll", {
      auth: true
    }),
    apiSSRFetch<Report[]>("/report/getAll", {
      auth: true,
      transform: (input: Report[]) => {
        return input.map(item => ({
          testId: item.testId,
          date: new Date(item.date as string)
        }))
      }
    }),
    apiSSRFetch<SurveyStatusResponse>("/ce/survey/status", {
      auth: true
    })
  ])

  isSurvey.value = [0, 3, 4].includes(survey.data.value?.mode!)

  reports_data.value = reports.data.value!

  reservations_data.value = reservations.data.value!
})

onMounted(async () => {
  const act = route.query.act
  const toast = useNuxtApp().$showToast

  switch (act) {
    case "survey_done":
      toast.success("فرم با موفقیت تکمیل شد!")
      break
  }
})

useHead({title: "اکتین - صفحه اصلی"})
</script>

<template>
  <!-- Survey alert -->
  <div class="fixed inset-0 z-[-99999] opacity-0 bg-white/80 p-[16px] backdrop-blur-2xl duration-[0.3s] flex justify-center items-center"
       :class="{ '!z-[99999] !opacity-100': !isSurvey && $route.query.nocache }">
    <div class="flex flex-col w-full max-w-[400px] text-center text-mainBlack">
      <MaterialSymbols
          @click="isSurvey = true" theme="rounded"
          class="text-[#666666] ml-auto fixed top-[16px] left-[16px] cursor-pointer hover:text-[30px]">
        close
      </MaterialSymbols>

      <h1 class="mt-[20px] font-bold text-[26px]">
        {{ user.fullName }}
        عزیز خوش آمدی
      </h1>

      <p class="mt-[56px] text-[16px] ">جهت تهیه‌ی برنامه تمرینی مناسب براساس ناهنجاری‌‌های اسکلتی شما، نیازمند دریافت وضعیت جسمیتان هستیم.</p>

      <p class="text-[14px] text-[#666666] mt-[32px]">زمان مورد نیاز برای انجام ارزیابی: ۳ دقیقه</p>

      <PrimaryButton class="mt-[132px]" @click="$router.push('/ce/survey/')">فرم وضعیت جسمی</PrimaryButton>
    </div>
  </div>

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

      <h2 v-if="reservations_data.length" class="mt-[24px] px-[16px] text-[#212121] text-[18px] font-bold">نوبت‌های من</h2>

      <div v-if="reservations_data.length" class="px-[16px]">
        <HomeReservationCard v-for="res in reservations_data" :key="res.name" :data="res" class="mt-[16px]"/>
      </div>

      <h2 v-if="reports_data.length" class="mt-[24px] px-[16px] text-[#212121] text-[18px] font-bold">تاریخچه ارزیابی‌ها</h2>

      <div v-if="reports_data.length" class="px-[16px] pb-[16px]">
        <HomeReportCard v-for="report in reports_data" :key="report.testId" :data="report" class="mt-[16px]"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>