<script setup lang="ts">
import Jalali ,{type JalaaliDateObject} from "jalaali-js"
import axios from "axios"
import {ReportFrontalView, ReportSagitalView} from "#components"

definePageMeta({
  layout: "main",
  middleware: ["normal-auth"]
})

const config = useRuntimeConfig()
const route = useRoute()
const toast = useNuxtApp().$showToast
const isDataFetched = shallowRef(false)
const activeViews = shallowRef([ReportFrontalView, ReportSagitalView])
const activeView = shallowRef(1)

const changeView = (index: number) => {
  document.getElementById("dataSection")!.scrollTo({top: 0, behavior: "smooth"})
  activeView.value = index
}

const dataFetch = ref()
const date = ref()

const getActiveZone = computed(() => dataFetch.value.report['analyze']['zones'])

onMounted(async () => {
  const loading = toast.loading("در حال دریافت اطلاعات...")

  const act = route.query.act

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
  }

  if (route.params.session_id)
    await useAxios(true)(`${config.public.APP_BACKEND}/report/${route.params.session_id}`).then((value) => {
      dataFetch.value = value.data

      date.value = (Jalali.toJalaali(new Date(dataFetch.value['report']['date'])) as JalaaliDateObject)

      if (value.data.status === 404)
        location.replace("/home")

      isDataFetched.value = true
      toast.remove(loading)
    }).catch((e) => {
      console.log(e)

      useNuxtApp().$closeLoading(loading, e["response"]["data"]["message"])
    })

  useHead({title: `Actin - Report page`})
})

const goToSurvey = () => location.replace(`/ce/survey/?nocache=${(new Date()).getTime()}`)
</script>

<template>
  <ReportHeader @click="$router.replace('/home')">جزئیات گزارش</ReportHeader>

  <!-- Scroll section -->
  <div id="dataSection" class="flex w-full items-center flex-col overflow-auto px-[16px] pb-[82px]">

    <!-- Navigation -->
    <div class="max-w-[450px] sm:w-full sm:inset-auto left-[20px] right-[20px] absolute !top-[65px] z-50 flex justify-center">
      <div class="p-[4px] rounded-[12px] bg-[#EEEEEE]/70 shadow-md flex gap-[4px] w-full backdrop-blur-xl">
        <div
            v-for="(item, index) in ['گزارش روبه‌رو', 'گزارش از پهلو']" :key="item" @click="changeView(index + 1)"
            class="w-full p-[10px] rounded-[8px] flex justify-center items-center !select-none text-[16px] text-[#212121] cursor-pointer hover:bg-white/60"
            :class="{ 'bg-white shadow-[0px_4px_4px_0px] shadow-black/5': activeView === index + 1}">
          {{ item }}
        </div>
      </div>
    </div>


    <p class="text-center mb-[20px] mt-[78px] h-[27px] text-[#727272] text-[14px]">
      <span v-if="dataFetch">
        {{
          persianNumber((date as JalaaliDateObject).jd.toString()) + " " +
          new Intl.DateTimeFormat('fa-IR', {month: 'short'}).format(new Date(dataFetch['report']['date'])) + " " +
          persianNumber((date as JalaaliDateObject).jy.toString())
        }}
      </span>

      <span v-else class="flex justify-center">
         در حال بارگزاری
        <FaIcon :icon="['fas', 'spinner']" class="cursor-pointer text-[18px] animate-spin-slow mr-2"/>
      </span>
    </p>

    <component v-if="dataFetch" :is="activeViews[activeView - 1]"
               :report="activeView === 1 ? getActiveZone['frontal'] : getActiveZone"/>

    <div class="border-t-[1px] border-[#0000001F] mt-[47px] w-full py-[16px]">
      <div class="m-auto flex flex-col items-center gap-[16px] max-w-[500px] w-full text-center">
        <img src="~/assets/images/icon_character_physio.png" alt="physio">

        <h2 class="font-bold text-[20px] text-mainBlack">شما نیاز به حرکات اصلاحی نیاز دارید.</h2>

        <p class="text-[14px] text-[#9E9E9E]">جهت اصلاح وضعیت بدن شما،‌ نیاز است تا طبق یک
          <span class="text-mainBlack">“برنامه تمرینی منظم”</span> و یا در طی چند جلسه <span class="text-mainBlack">“فیزیوتراپی”</span>، حرکاتی را انجام دهید که منجر به اصلاح بدن شما گردد.
        </p>

        <PrimaryButton class="rounded-full !font-semibold" @click="$router.push('/ce')">
          دریافت برنامه تمرینی
        </PrimaryButton>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>