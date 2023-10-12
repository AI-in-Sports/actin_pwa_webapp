<script setup lang="ts">
import {convertToPersianNumber} from "~/helper"
import Jalali ,{JalaaliDateObject} from "jalaali-js"
import axios from "axios";
import ReportCard from "~/components/ReportCard.vue"

definePageMeta({
  layout: "pad",
  middleware: ["normal-auth"]
})

const config = useRuntimeConfig()
const route = useRoute()
const toast = useNuxtApp().$showToast
const isDataFetched = ref(false)
const isPayed = ref(false)
const paymentUrl = ref("")

const dataFetch = ref()
const date = ref()

const getActiveZone = computed(() => dataFetch.value.report['_source']['analyze']['zones']['frontal'])

const getHealthy = (deg: number) => {
  deg = Math.abs(deg)
  if (deg >= 0 && deg < 5) return "healthy"
  else if (deg >= 5 && deg < 10) return "need_to_fix"
  else return "dangerous"
}

onMounted(async () => {
  await preloadComponents('FaIcon')

  const loading = toast.loading("در حال دریافت اطلاعات...", { rtl: true, position: toast.POSITION.TOP_RIGHT })

  if (route.params.session_id)
    await axios(`${config.public.EXPRESS_BACKEND}/report/${route.params.session_id}`, {
      headers: {
        "Authorization": `Bearer ${useCookie("token").value}`
      },
      params: {
        phone: useCookie("phone").value
      }
    }).then((value) => {
      dataFetch.value = value.data

      date.value = (Jalali.toJalaali(new Date(dataFetch.value['report']['_source']['date'])) as JalaaliDateObject)
      console.log(date.value)

      if(value.data.status === 200 && value.data.message === "OK")
        isPayed.value = true

      else if (value.data.status === 200 && value.data.message !== "OK")
        paymentUrl.value = value.data.url

      else if(value.data.status === 403) {
        useCookie("token").value = null
        location.replace("/report")
      }

      if (value.data.status === 404)
        location.replace("/report")

      else if (value.data.status === 500)
        useNuxtApp().$showToast.update(loading, {
          render: value.data.message,
          type: "error",
          rtl: true,
          autoClose: true,
          closeOnClick: true,
          isLoading: false
        })

      else if (value.data.status === 403) {
        useCookie("token").value = null
        location.reload()
      }

      isDataFetched.value = true
      toast.clearAll()
    }).catch((e) => {
      console.log(e)
    })

  useHead({title: `Actin - ${isPayed.value === false ? 'Payment' : 'Test report'}`})
})
</script>

<template>
  <div class="flex flex-col h-[100dvh] w-full items-center relative bg-white">
    <!-- Navigation part -->
    <nav class="flex px-[20px] py-[16px] shadow w-full">
      <div class="w-1/4">

      </div>
      <div class="w-1/2 font-bold text-[16px] text-center">
        جزئیات گزارش
      </div>

      <div class="w-1/4 flex items-center justify-end">
        <FaIcon :icon="['fas', 'arrow-left']" class="cursor-pointer text-[18px] mt-1" @click="$router.replace('/report')"/>
      </div>
    </nav>

    <div class="flex w-full items-center flex-col overflow-auto px-[16px] pb-[82px]">
      <p class="text-center mt-[16px] mb-[13px] text-[18px] h-[27px]">
        <span v-if="dataFetch">
          {{
            convertToPersianNumber((date as JalaaliDateObject).jd.toString()) + " " +
            new Intl.DateTimeFormat('fa-IR', {month: 'short'}).format(new Date(dataFetch['report']['_source']['date'])) + " " +
            convertToPersianNumber((date as JalaaliDateObject).jy.toString())
          }}
        </span>

          <span v-else class="flex justify-center">
           در حال بارگزاری
          <FaIcon :icon="['fas', 'spinner']" class="cursor-pointer text-[18px] animate-spin-slow mr-2"/>
        </span>
      </p>

      <div class="flex flex-col max-w-[400px]" v-if="dataFetch">
        <Skeleton :report="dataFetch"/>

        <ReportCard title="گردن" :level="getHealthy(getActiveZone['neck']['left'])">
          گردن شما {{ convertToPersianNumber(Math.abs(getActiveZone['neck']['left']).toString()) }}° درجه به سمت
          {{ getActiveZone['neck']['left'] > getActiveZone['neck']['right'] ? 'راست' : 'چپ' }} کجی دارد
        </ReportCard>

        <ReportCard title="شانه راست" :level="getHealthy(getActiveZone['shoulder']['right'])">
          شانه راست شما {{ convertToPersianNumber(Math.abs(getActiveZone['shoulder']['right']).toString()) }}° درجه به سمت
          {{ getActiveZone['shoulder']['right'] > 0 ? 'بالا' : 'پایین' }} افتادگی دارد.
        </ReportCard>

        <ReportCard title="شانه چپ" :level="getHealthy(getActiveZone['shoulder']['left'])">
          شانه چپ شما {{ convertToPersianNumber(Math.abs(getActiveZone['shoulder']['left']).toString()) }}° درجه به سمت
          {{ getActiveZone['shoulder']['left'] > 0 ? 'بالا' : 'پایین' }} افتادگی دارد.
        </ReportCard>

        <ReportCard title="لگن راست" :level="getHealthy(getActiveZone['hip']['right'])">
          لگن راست شما {{ convertToPersianNumber(Math.abs(getActiveZone['hip']['right']).toString()) }}° درجه به سمت
          {{ getActiveZone['hip']['right'] > 0 ? 'بالا' : 'پایین' }} عدم تقارن دارد.
        </ReportCard>

        <ReportCard title="لگن چپ" :level="getHealthy(getActiveZone['hip']['left'])">
          لگن چپ شما {{ convertToPersianNumber(Math.abs(getActiveZone['hip']['left']).toString()) }}° درجه به سمت
          {{ getActiveZone['hip']['left'] > 0 ? 'بالا' : 'پایین' }} عدم تقارن دارد.
        </ReportCard>

        <ReportCard title="زانوی راست" :level="getHealthy(getActiveZone['knee'][0]['right'])">
          زانوی راست شما {{ convertToPersianNumber(Math.abs(getActiveZone['knee'][0]['right']).toString()) }}° درجه به سمت
          {{ getActiveZone['knee']['right'] > 0 ? 'بیرون' : 'داخل' }} انحراف دارد.
        </ReportCard>

        <ReportCard title="زانوی چپ" :level="getHealthy(getActiveZone['knee'][0]['left'])">
          زانوی چپ شما {{ convertToPersianNumber(Math.abs(getActiveZone['knee'][0]['left']).toString()) }}° درجه به سمت
          {{ getActiveZone['knee'][0]['left'] > 0 ? 'بیرون' : 'داخل' }} انحراف دارد.
        </ReportCard>
      </div>
    </div>

    <div class="p-[16px] sm:p-0 sm:pb-[16px] w-full fixed bottom-0 max-w-[420px]">
      <PrimaryButton class="rounded-full !bg-[#212121] border-none !font-semibold">رزرو وقت فیزیوتراپی</PrimaryButton>
    </div>
  </div>
</template>

<style scoped>

</style>