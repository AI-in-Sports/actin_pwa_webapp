<script setup lang="ts">
import {convertToPersianNumber} from "~/helper"
import Jalali ,{type JalaaliDateObject} from "jalaali-js"
import axios from "axios"
import {ReportFrontalView, ReportSagitalView} from "#components"

definePageMeta({
  layout: "result",
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

  if (route.params.session_id)
    await axios(`${config.public.APP_BACKEND}/report/${route.params.session_id}`, {
      headers: { "Authorization": useAuthStore().getToken }
    }).then((value) => {
      dataFetch.value = value.data

      date.value = (Jalali.toJalaali(new Date(dataFetch.value['report']['date'])) as JalaaliDateObject)

      if (value.data.status === 404)
        location.replace("/home")

      isDataFetched.value = true
      toast.clearAll()
    }).catch((e) => {
      console.log(e)

      useNuxtApp().$closeLoading(loading, e["response"]["data"]["message"])
    })

  useHead({title: `Actin - Report page`})
})
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
          convertToPersianNumber((date as JalaaliDateObject).jd.toString()) + " " +
          new Intl.DateTimeFormat('fa-IR', {month: 'short'}).format(new Date(dataFetch['report']['date'])) + " " +
          convertToPersianNumber((date as JalaaliDateObject).jy.toString())
        }}
      </span>

      <span v-else class="flex justify-center">
         در حال بارگزاری
        <FaIcon :icon="['fas', 'spinner']" class="cursor-pointer text-[18px] animate-spin-slow mr-2"/>
      </span>
    </p>

    <component v-if="dataFetch" :is="activeViews[activeView - 1]"
               :report="activeView === 1 ? getActiveZone['frontal'] : getActiveZone"/>
  </div>

  <div class="p-[16px] sm:p-0 sm:pb-[16px] w-full fixed bottom-0 max-w-[450px]" v-if="config.public.DISABLE_RESERVATION !== 'true'">
    <PrimaryButton class="rounded-full !bg-[#212121] border-none !font-semibold" @click="$router.push('/physio/list')">
      رزرو وقت فیزیوتراپی
    </PrimaryButton>
  </div>
</template>

<style scoped>

</style>