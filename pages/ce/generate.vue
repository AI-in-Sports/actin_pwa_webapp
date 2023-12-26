<script setup lang="ts">
import type {SurveyStatusResponse} from "~/types/Responses";

definePageMeta({
  middleware: ["normal-auth"],
  layout: "empty"
})

const {data} = apiLazySSRFetch<SurveyStatusResponse>("/ce/survey/status", {
  auth: true,
})

if ([0, 1].includes(data.value?.mode!))
  useRouter().replace("/ce")

onMounted(async () => {
  await apiCall("/ce/exercise/generate", {
    auth: true
  }).then(() => useRouter().push("/ce")).catch((reason) => {
    alert("ایجاد برنامه تمرینی با خطا مواجه شد لطفا بعد از زدن دکمه تایید پیام خطا را برای پشتیبانی اکتین ارسال کنید.")
    alert(reason)

    useRouter().replace("/ce?res=pg_err")
  })
})

const doneAlert = () => {
  useNuxtApp().$showToast("ساخت برنامه تمرینی شما تا لحظات دیگر به اتمام میرسد...")
}
</script>

<template>
  <div class="flex flex-col items-center h-full justify-center p-[16px]">
    <ClientOnly>
      <PrimaryCircleProgressBar :isCounting="true" :time="60" @done="doneAlert" class="h-[120px] w-[120px]"/>
    </ClientOnly>
    <p class="text-[18px] text-center mb-8 font-semibold mt-[56px]">
      در حال طراحی برنامه تمرینی مناسب شما براساس نتایج تست...
    </p>
    <p class="text-center text-[14px] font-normal text-[#666666] mt-[32px]">
      زمان انتظار تا طراحی برنامه : ۱ دقیقه
    </p>
  </div>

</template>

<style scoped>

</style>