<script setup lang="ts">
import * as Jalali from "jalaali-js"
import type {JalaaliDate} from "jalaali-js"
definePageMeta({
  layout: "main",
  middleware: ["normal-auth"]
})

const route = useRoute()
const router = useRouter()
const reportViews = shallowRef([
  resolveComponent("LazyReportFrontalView"),
  resolveComponent("LazyReportSagitalView")
])

const activeView = shallowRef(0)

const changeView = (index: number) => {
  document.getElementById("dataSection")!.scrollTo({top: 0, behavior: "smooth"})
  activeView.value = index
}

const dataFetch = useState(() => null)
const date = useState(() => null)


await useLazyAsyncData('report_data', async () => {
  const [latestReport] = await Promise.all([
    useSSRFetch<{
      status: number,
      report?: null | any
    }>(`/report/get/${route.params.session_id}`, {auth: true}),
  ])

  if(latestReport.data.value!.status === 200) {
    dataFetch.value = latestReport.data.value!.report!
    date.value = (Jalali.toJalaali(new Date(dataFetch.value!['date'])) as any)
  }
  else if (latestReport.data.value!.status === 404)
    router.replace("/home")
})


onMounted(async () => {
  const act = route.query.act

  switch (act) {
    case "sid_inv":
      useToast.error("کد تست نامعتبر است!")
      break

    case "sid_tkn":
      useToast.error("کد قبلا اسکن شده است و برای شخص دیگری ثبت شده است!")
      break

    case "srv_err":
      useToast.error("خطا از سمت سرور!")
      break

    case "rep_done":
      useToast.success("اطلاعات تست با موفقیت ذخیره شد!")
      break
  }

  useHead({title: `Actin - Report page`})
})

const summary = computed(() => postureSummary((dataFetch.value as any)?.analyze?.zones))

//const goToSurvey = () => location.replace(`/ce/survey/?nocache=${(new Date()).getTime()}`)
</script>

<template>

  <!-- Scroll section -->
  <div id="dataSection" class="flex w-full items-center flex-col overflow-auto px-[16px]">

    <!-- Navigation -->
    <ReportViewSelector
        class="w-full max-w-[500px] sticky top-5 z-30 shadow-md backdrop-blur-xl bg-[#EEEEEE]/60"
        :active="activeView" @changeView="(item: number) => changeView(item)"/>

    <p class="text-center mb-[18px] mt-[50px] h-[20px] text-[#727272] text-[18px]">
      <span v-if="dataFetch && date">
        {{
          persianNumber((date! as JalaaliDate).jd.toString()) + " " +
          new Intl.DateTimeFormat('fa-IR', {month: 'short'}).format(new Date(dataFetch['date'])) + " " +
          persianNumber((date! as JalaaliDate).jy.toString())
        }}
      </span>

      <span v-else class="flex justify-center">
         در حال بارگزاری
        <FaIcon :icon="['fas', 'spinner']" class="cursor-pointer text-[18px] animate-spin-slow mr-2"/>
      </span>
    </p>

    <section v-if="dataFetch && summary.total" class="w-full max-w-[500px] rounded-[20px] bg-surface-2 p-[16px] mb-[8px]">
      <div class="flex items-center justify-between">
        <h2 class="text-[16px] font-bold text-mainBlack">خلاصه گزارش</h2>
        <p class="text-[14px] text-mainSubDead">
          {{ persianNumber(summary.healthy.toString()) }} از {{ persianNumber(summary.total.toString()) }} ناحیه سالم
        </p>
      </div>
      <div v-if="summary.attention.length" class="flex flex-wrap gap-[8px] mt-[12px]">
        <DsBadge v-for="f in summary.attention" :key="f.key" :tone="POSTURE_LEVEL_TONE[f.level]">
          {{ f.title }}: {{ POSTURE_LEVEL_TEXT[f.level] }}
        </DsBadge>
      </div>
    </section>

    <ClientOnly>
      <div class="flex flex-col w-full max-w-[500px]" v-if="dataFetch !== null && date">
        <ReportSkeleton
            class="mt-[20px] w-full"
            :test="activeView === 0 ? 'frontal' : 'sagital'"
            :report="activeView === 0 ? (dataFetch as any).analyze.zones.frontal : (dataFetch as any).analyze.zones"/>

        <component
            class="w-full mt-6"
            :is="reportViews[activeView]"
            :report="activeView === 0 ? (dataFetch as any).analyze.zones.frontal : (dataFetch as any).analyze.zones"/>
      </div>
    </ClientOnly>

    <div class="mt-[32px] mb-[24px] w-full max-w-[500px]">
      <JourneyNextSteps :attention="summary.attention.length"/>
    </div>
  </div>
</template>

<style scoped>

</style>