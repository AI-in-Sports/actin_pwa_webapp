<script setup lang="ts">
import type {SurveyStatusResponse} from "~/types/Responses"

definePageMeta({
  middleware: ["normal-auth"],
  layout: "empty"
})

const {data} = useLazySSRFetch<SurveyStatusResponse>("/ce/exercise/status", {
  auth: true,
})

if ([0, 1].includes(data.value?.mode!))
  useRouter().replace("/ce")

onMounted(async () => {
  await use$Fetch("/ce/exercise/generate", {
    auth: true
  }).then(() => useRouter().push("/ce/payment")).catch((reason) => {
    alert("ایجاد برنامه تمرینی با خطا مواجه شد لطفا بعد از زدن دکمه تایید پیام خطا را برای پشتیبانی اکتین ارسال کنید.")
    alert(reason)

    useRouter().replace("/ce?res=pg_err")
  })
})

/** Seconds since the page opened, to tick the visible steps while the program is generated. */
const elapsed = shallowRef(0)
let ticker: ReturnType<typeof setInterval> | null = null
onMounted(() => { ticker = setInterval(() => elapsed.value++, 1000) })
onBeforeUnmount(() => { if (ticker) clearInterval(ticker) })

const doneAlert = () => {
  useToast.success("ساخت برنامه تمرینی شما تا لحظات دیگر به اتمام میرسد...")
}

useHead({title: `اکتین - درحال تولید برنامه اصلاحی`})
</script>

<template>
  <div class="flex flex-col items-center h-full justify-center p-[16px] max-w-[420px] mx-auto w-full" dir="rtl">
    <ClientOnly>
      <ThemeCircleProgressBar :isCounting="true" :time="60" @done="doneAlert" class="h-[120px] w-[120px]"/>
    </ClientOnly>
    <p class="text-[18px] text-center font-semibold mt-[48px] leading-8">
      در حال طراحی برنامه تمرینی مناسب شما بر اساس نتایج تست...
    </p>
    <p class="text-center text-[14px] font-normal text-[#666666] mt-[12px]">
      زمان انتظار تا طراحی برنامه: حدود ۱ دقیقه
    </p>

    <JourneyTimeline class="mt-[32px]" :steps="[
      { text: 'تحلیل گزارش وضعیت بدنی', done: elapsed >= 10 },
      { text: 'انتخاب حرکات اصلاحی', done: elapsed >= 30 },
      { text: 'تنظیم شدت و تعداد ست‌ها', done: false },
    ]"/>
  </div>
</template>

<style scoped>

</style>