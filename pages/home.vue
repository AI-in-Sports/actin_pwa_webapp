<script setup lang="ts">
import type {Report} from "~/types/Responses"
import jalali from "jalaali-js"

definePageMeta({
  layout: "main",
  middleware: ["normal-auth"]
})

useAuthStore().$persist()

const userPersonalData = resolveComponent('LazySurveyUserPersonalData')

const route = useRoute()

const user = useAuthStore().user
const phone = useAuthStore().phone

const logout = () => {
  useAuthStore().logout()
  location.reload()
}

const profileStatus = useState(() => 0)
const showCompleteProfile = useState(() => false)

const reportActiveTab = shallowRef(0)
const reportData: any = useState()
const reportViews = shallowRef([
  resolveComponent("LazyReportFrontalView"),
  resolveComponent("LazyReportSagitalView")
])
/*
const reservations_data = useState(() => [] as Reservation[])
const isSurvey = shallowRef(false)
*/

await useLazyAsyncData('home_data', async () => {
  const [profileComplete, latestReport] = await Promise.all([
    useSSRFetch<{complete: number}>("/profile/complete_status", {
      auth: true
    }),
    /*useSSRFetch<Reservation[]>("/reservation/getAll", {
      auth: true
    }),*/
    useSSRFetch<Report>("/report/get/latest", {auth: true}),
    /*  useSSRFetch<SurveyStatusResponse>("/ce/survey/status", {
        auth: true
    })*/
  ])

  profileStatus.value = profileComplete.data.value!.complete
  reportData.value = latestReport.data.value! as Report
/*  isSurvey.value = [0, 3, 4].includes(survey.data.value?.mode!)

  reports_data.value = reports.data.value!
  reservations_data.value = reservations.data.value!*/
})

onMounted(async () => {
  const res = route.query.res

  switch (res) {
    case "saved":
      useToast.success("اطلاعات شما با موفقیت ذخیره شد!")
      break
  }
})

useHead({title: "اکتین - صفحه اصلی"})
</script>

<template>
  <ThemeBottomSheet
      v-if="profileStatus === 0" is-open title="مرحله ۱ از ۶"
      full-screen :component="userPersonalData"/>

  <div class="flex flex-col justify-center items-center gap-y-8 w-full max-w-[450px] pt-6">
    <div class="flex flex-col justify-center items-center border-b-4 border-[#F0F0F0] w-full pb-8 px-4 gap-y-6">
      <div class="flex flex-row justify-center items-center gap-x-4 w-full">
        <PrimaryProfile />

        <div class="flex flex-col gap-y-2 flex-grow" v-if="profileStatus !== 0">
          <p class="text-mainBlack text-2xl font-semibold">
            {{ user.first_name }} {{ user.last_name }}
          </p>

          <p class="text-mainSubDead text-base">
            {{ phone }}
          </p>
        </div>

      <div class="bg-white rounded-full">
        <MaterialSymbols theme="rounded" class="text-mainSubDead text-2xl">notifications</MaterialSymbols>
      </div>
    </div>

    <div class="flex flex-col justify-center items-center gap-y-6 p-4 rounded-3xl w-full" v-if="profileStatus > 0">
      <p class="text-base text-center text-mainBlack font-semibold">
        برای دریافت برنامه تمرینی ابتدا باید پروفایل
        <br>
        خود را تکمیل کنید.
      </p>

      <div class="flex flex-col justify-center items-center gap-y-3 w-full">
        <div class="bg-white w-full h-2 rounded">
          <div class="bg-mainYellow rounded-full h-2 w-1/5"></div>
        </div>

        <p class="text-mainBlack text-xs">
          ۵ مرحله دیگر تا تکمیل پروفایل
        </p>
      </div>

      <ThemeButton
          class="flex flex-row justify-center items-center gap-x-2 w-full text-white text-sm text-center font-medium"
          @click="$router.push('/profile')">
        تکمیل پروفایل

        <MaterialSymbols theme="rounded" class="text-white text-2xl">chevron_left</MaterialSymbols>
      </ThemeButton>
    </div>

    <div class=" flex-col gap-y-5 w-full hidden">
      <div class="flex flex-row justify-between items-center gap-x-2">
        <div class="flex flex-col justify-center items-center gap-y-1 px-2 py-1 bg-[#F5F5F5] rounded-lg w-1/3">
          <p class="text-mainSubDead text-xs">سن</p>

          <p class="text-mainBlack text-lg font-semibold">۲۶</p>
        </div>

        <div class="flex flex-col justify-center items-center gap-y-1 px-2 py-1 bg-[#F5F5F5] rounded-lg w-1/3">
          <p class="text-mainSubDead text-xs">قد</p>

          <p class="text-mainBlack text-lg font-semibold" dir="ltr">۱۶۵ cm</p>
        </div>

        <div class="flex flex-col justify-center items-center gap-y-1 px-2 py-1 bg-[#F5F5F5] rounded-lg w-1/3">
          <p class="text-mainSubDead text-xs">وزن</p>

          <p class="text-mainBlack text-lg font-semibold" dir="ltr">۶۰ kg</p>
        </div>
      </div>

      <PrimaryBorderButton class="flex justify-center items-center gap-x-2" @click="$router.push('/profile')">
        <MaterialSymbols theme="rounded" class="text-mainSubDead text-xl">edit</MaterialSymbols>

        <p class="font-medium">ویرایش پروفایل</p>
      </PrimaryBorderButton>
    </div>

  </div>
    <div class="flex flex-col gap-y-8 border-b-4 border-[#F0F0F0] w-full pb-8 px-4" v-if="!reportData">
      <h3 class="text-mainBlack text-[21px] font-semibold text-center">
        علائم حیاتی
      </h3>

      <p class="text-[#9E9E9E] text-base">
        در حال حاضر گزارشی از وضعیت علائم حیاتی شما ثبت نشده است.
        برای دریافت وضعیت به یکی از مراکز دارای آینه هوشمند اکتین مراجعه کنید.
      </p>

      <PrimaryBorderButton>مشاهده مراکز</PrimaryBorderButton>
    </div>

    <div class="flex flex-col gap-y-8 border-b-4 border-[#F0F0F0] w-full pb-8 px-4" v-else>
      <div class="flex justify-between items-center">
        <h3 class="text-mainBlack text-[21px] font-semibold">
          علائم حیاتی
        </h3>

        <p class="text-sm text-[#727272]">
          ۱۳ اردیبهشت ۱۴۰۲
        </p>
      </div>

      <div class="flex flex-col px-6">
        <div class="flex justify-between items-center py-4">
          <p class="text-base text-mainBlack font-semibold">
            وضعیت فشارخون
          </p>

          <div class="px-2 py-1 bg-[#E8F5E9] rounded-full">
            <p class="text-base text-[#008060] font-semibold" dir="ltr">
              ۱۲۰/ ۸۰
            </p>
          </div>
        </div>

        <div class="flex justify-between items-center py-4">
          <p class="text-base text-mainBlack font-semibold">
            وضعیت ضربان قلب
          </p>

          <div class="px-2 py-1 bg-[#FFEBEE] rounded-full">
            <p class="text-base text-[#B3261E] font-semibold" dir="ltr">
              ۶۸ <span class="text-xs font-normal ml-1.5">BPM</span>
            </p>
          </div>
        </div>

        <div class="flex justify-between items-center py-4">
          <p class="text-base text-mainBlack font-semibold">
            وضعیت اکسیژن خون
          </p>

          <div class="px-2 py-1 bg-[#FFF8E1] rounded-full">
            <p class="text-xs text-[#916A00]" dir="ltr">
              به زودی
            </p>
          </div>
        </div>

      </div>
    </div>

    <div class="flex flex-col gap-y-8 border-b-4 border-[#F0F0F0] w-full pb-8 px-4">
      <h3 class="text-mainBlack text-[21px] font-semibold text-center">
        گزارش لاغری
      </h3>

      <p class="text-[#9E9E9E] text-base">
        در حال حاضر گزارشی از وضعیت علائم حیاتی شما ثبت نشده است.
        برای دریافت وضعیت به یکی از مراکز دارای آینه هوشمند اکتین مراجعه کنید.
      </p>

      <PrimaryBorderButton>مشاهده مراکز</PrimaryBorderButton>
    </div>

    <div class="flex flex-col gap-y-8 w-full pb-8 px-4" v-if="!reportData['report']">
      <h3 class="text-mainBlack text-[21px] font-semibold text-center">
        گزارش اسکلتی - عضلانی
      </h3>

      <p class="text-[#9E9E9E] text-base">
        در حال حاضر گزارشی از تست اسکلتی- عضلانی شما
        <br>
        ثبت نشده است. برای دریافت تست به یکی از مراکز دارای آینه هوشمند اکتین مراجعه کنید.
      </p>

      <PrimaryBorderButton>مشاهده مراکز</PrimaryBorderButton>
    </div>

    <div class="w-full flex flex-col p-2 pt-0" v-else>
      <div class="w-full flex justify-between pb-6">
        <h2 class="font-semibold text-[21px]">گزارش اسکلتی- عضلانی</h2>

        <p class="text-sm text-[#727272]">
          {{ persianNumber(jalali.toJalaali(new Date(reportData.report['date'])).jd.toString()) + " " }}
          {{ new Date(new Date(reportData.report['date'])).toLocaleDateString("fa-IR", { month: 'long' }) + " " }}
          {{ persianNumber(jalali.toJalaali(new Date(reportData.report['date'])).jm.toString()) }}
        </p>
      </div>

      <ReportViewSelector
          class="w-full" :active="reportActiveTab"
          @changeView="(item: number) => reportActiveTab = item"/>

      <ReportSkeleton
          class="mt-[20px] w-full"
          :test="reportActiveTab === 0 ? 'frontal' : 'sagital'"
          :report="reportActiveTab === 0 ? reportData.report.analyze.zones.frontal : reportData.report.analyze.zones"/>

      <component
          class="w-full mt-6"
          :is="reportViews[reportActiveTab]"
          :report="reportActiveTab === 0 ? reportData.report.analyze.zones.frontal : reportData.report.analyze.zones"/>
    </div>
</div>

</template>

<style scoped>

</style>