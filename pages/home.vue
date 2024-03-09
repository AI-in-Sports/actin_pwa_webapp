<script setup lang="ts">
import jalali from "jalaali-js"
definePageMeta({
  layout: "main",
  middleware: ["normal-auth"]
})

useAuthStore().$persist()

const route = useRoute()

const user = useAuthStore().user
const phone = useAuthStore().phone
const profile = useProfileStore()

const logout = () => {
  useAuthStore().logout()
  location.reload()
}

const reportActiveTab = shallowRef(0)
const reportData = useState(() => null)
const reportViews = shallowRef([
  resolveComponent("LazyReportFrontalView"),
  resolveComponent("LazyReportSagitalView")
])

await useLazyAsyncData('home_data', async () => {
  const [latestReport] = await Promise.all([
    useSSRFetch<{
      status: number,
      report?: null | any
    }>("/report/get/latest", {auth: true}),
  ])

  if(latestReport.data.value!.status === 200)
    reportData.value = latestReport.data.value!.report!
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
  <div class="flex flex-col justify-center items-center gap-y-8 w-full max-w-[450px] pt-6">
    <div class="flex flex-col justify-center items-center border-b-4 border-[#F0F0F0] w-full pb-8 px-4 gap-y-6">
      <div class="flex flex-row justify-center items-center gap-x-4 w-full">
        <PrimaryProfile />

        <div class="flex flex-col gap-y-2 flex-grow" v-if="user && profile.status > 0">
          <p class="text-mainBlack text-2xl font-semibold">
            {{ user.first_name }} {{ user.last_name }}
          </p>

          <p class="text-mainSubDead text-base">
            {{ phone }}
          </p>
        </div>

      <div class="bg-white rounded-full">
        <MaterialSymbols
            theme="rounded" @click="logout"
            class="text-mainSubDead text-2xl cursor-pointer hover:text-red-500">logout</MaterialSymbols>
      </div>
    </div>

    <div class="flex flex-col justify-center items-center gap-y-6 p-4 rounded-3xl w-full" v-if="profile.complete_steps < 7">
      <p class="text-base text-center text-mainBlack font-semibold">
        برای دریافت برنامه تمرینی ابتدا باید پروفایل
        <br>
        خود را تکمیل کنید.
      </p>

      <div class="flex flex-col justify-center items-center gap-y-3 w-full">
        <div class="bg-white w-full h-2 rounded">
          <div class="bg-mainYellow rounded-full h-2" :style="{ 'width': (100 / 7) * profile.complete_steps + '%'}"></div>
        </div>

        <p class="text-mainBlack text-xs">
          {{ 7 - profile.complete_steps }} مرحله دیگر تا تکمیل پروفایل
        </p>
      </div>

      <ThemeButton
          class="flex flex-row justify-center items-center gap-x-2 w-full text-white text-sm text-center font-medium"
          @click="profile.toggleCompleteProfileModal()">
        تکمیل پروفایل

        <MaterialSymbols theme="rounded" class="text-white text-2xl">chevron_left</MaterialSymbols>
      </ThemeButton>
    </div>

    <div class="flex-col gap-y-5 w-full" v-else>
      <div class="flex flex-row justify-between items-center gap-x-2">
        <div class="flex flex-col justify-center items-center gap-y-1 p-2 bg-[#F5F5F5] rounded-lg w-1/3">
          <p class="text-mainSubDead text-base">سن</p>

          <p class="text-mainBlack text-lg font-semibold">{{ persianNumber(calculateAge(new Date(profile.user_info.birthday!))) }}</p>
        </div>

        <div class="flex flex-col justify-center items-center gap-y-1 p-2 bg-[#F5F5F5] rounded-lg w-1/3">
          <p class="text-mainSubDead text-base">قد</p>

          <p class="text-mainBlack text-lg font-semibold" dir="ltr">{{ persianNumber(profile.user_info.height!) }} cm</p>
        </div>

        <div class="flex flex-col justify-center items-center gap-y-1 p-2 bg-[#F5F5F5] rounded-lg w-1/3">
          <p class="text-mainSubDead text-base">وزن</p>

          <p class="text-mainBlack text-lg font-semibold" dir="ltr">{{ persianNumber(profile.user_info.weight!) }} kg</p>
        </div>
      </div>

<!--      <PrimaryBorderButton class="flex justify-center items-center gap-x-2 mt-4" @click="$router.push('/profile')">
        <MaterialSymbols theme="rounded" class="text-mainSubDead text-[22px]">edit</MaterialSymbols>

        <p class="font-medium text-[15px]">ویرایش پروفایل</p>
      </PrimaryBorderButton>-->
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

    <div class="flex flex-col gap-y-8 w-full pb-8 px-4" v-if="!reportData">
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
          {{ persianNumber(jalali.toJalaali(new Date(reportData['date'])).jd.toString()) + " " }}
          {{ new Date(new Date(reportData['date'])).toLocaleDateString("fa-IR", { month: 'long' }) + " " }}
          {{ persianNumber(jalali.toJalaali(new Date(reportData['date'])).jy.toString()) }}
        </p>
      </div>

      <ReportViewSelector
          class="w-full sticky top-5 z-30 shadow-md backdrop-blur-xl bg-[#EEEEEE]/60" :active="reportActiveTab"
          @changeView="(item: number) => reportActiveTab = item"/>

      <ReportSkeleton
          class="mt-[20px] w-full"
          :test="reportActiveTab === 0 ? 'frontal' : 'sagital'"
          :report="reportActiveTab === 0 ? (reportData as any).analyze.zones.frontal : (reportData as any).analyze.zones"/>

      <component
          class="w-full mt-6"
          :is="reportViews[reportActiveTab]"
          :report="reportActiveTab === 0 ? (reportData as any).analyze.zones.frontal : (reportData as any).analyze.zones"/>
    </div>

    <div class="flex flex-col gap-y-8 w-full pb-8 px-4">
      <h3 class="text-mainBlack text-[21px] font-semibold text-center">
        گزارش لاغری
      </h3>

      <p class="text-[#9E9E9E] text-base">
        در حال حاضر گزارشی از وضعیت علائم حیاتی شما ثبت نشده است.
        برای دریافت وضعیت به یکی از مراکز دارای آینه هوشمند اکتین مراجعه کنید.
      </p>

      <PrimaryBorderButton>مشاهده مراکز</PrimaryBorderButton>
    </div>
</div>

</template>

<style scoped>

</style>