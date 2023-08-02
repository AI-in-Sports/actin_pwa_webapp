<script setup lang="ts">
import jalali, {JalaaliDateObject} from "jalaali-js"
import {Ref} from "vue"
import {convertJalaliToString} from "~/helper"

definePageMeta({
  layout: "report",
  middleware: ["auth"]
})

useHead({title: "Actin test reports"})

const config = useRuntimeConfig()

const logout = () => {
  useCookie("token").value = null
  useCookie("phone").value = null
  location.reload()
}

const user = useState(() => "")

interface Report {
  testId: string,
  date: string | Date | JalaaliDateObject
}

// @ts-ignore
const reports: Ref<Report[]> = ref(null)

onMounted(async () => {
  const act = useRoute().query.act
  const toast = useNuxtApp().$showToast

  switch (act) {
    case "sid_inv":
      toast.error("کد تست نامعتبر است!", { rtl: true, position: toast.POSITION.TOP_RIGHT })
      break

    case "srv_err":
      toast.error("خطا از سمت سرور!", { rtl: true, position: toast.POSITION.TOP_RIGHT })
      break

    case "rep_done":
      toast.success("اطلاعات تست با موفقیت ذخیره شد!", { rtl: true, position: toast.POSITION.TOP_RIGHT })
      break

    case "lg_done":
      toast.success("خوش آمدید!", { rtl: true, position: toast.POSITION.TOP_RIGHT })
      break
  }

  const loading = toast.loading("در حال دریافت اطلاعات...", { rtl: true, position: toast.POSITION.TOP_RIGHT })

  await new Promise(async () => {
    await useFetch(`${config.public.EXPRESS_BACKEND}/auth/info`, {
      headers: {
        "Authorization": `Bearer ${useCookie("token").value}`
      }
    }).then(async (infoData) => {
      if (infoData.error.value) logout()
      else {
        user.value = infoData.data.value ? (infoData.data.value as any)["phone"] : ""

        const { data: reportData, error: reportError } = await useFetch(`${config.public.EXPRESS_BACKEND}/report/get`, {
          headers: {
            "Authorization": `Bearer ${useCookie("token").value}`
          }
        })

        if (reportError.value)
        {
          toast.update(loading, {
            render: "دریافت اطلاعات با خطا مواجه شد!",
            type: "error",
            rtl: true,
            autoClose: true,
            closeOnClick: true,
            isLoading: false
          })

          console.log("error:", reportError.value)
        }

        else
        {
          toast.remove(loading)

          reports.value = (reportData.value as Report[]).map(item => ({
            testId: item.testId,
            date: new Date(item.date as string)
          })).sort((a, b) =>  +b.date - +a.date).map(item => ({
            testId: item.testId,
            date: jalali.toJalaali(item.date)
          })) as Report[]
        }
      }
    }).catch(() => logout())
  })
})
</script>

<template>
  <div class="flex flex-col items-center justify-between h-full" dir="rtl">

    <div class="flex h-full justify-center items-center font-bold" v-if="reports && reports.length === 0">
      تا به حال تستی انجام نداده اید!
    </div>

    <div class="max-w-[450px] w-full flex flex-col justify-center items-center mt-10" v-else-if="reports && reports.length !== 0">
      <div class="flex justify-between items-center w-full">
        <p class="flex items-center text-[18px] font-bold">
          <FaIcon class="text-mainYellow text-[18px] ml-2" icon="star"/>

          آخرین آزمون شما
        </p>

        <p>
          {{ convertJalaliToString(reports[0].date as JalaaliDateObject) }}
        </p>
      </div>

      <NuxtLink :to="`/result/${reports[0].testId}`" class="w-full">
        <PrimaryButton class="flex items-center justify-center mt-5">
          <span class="text-[16px] ml-2">دانلود نتیجه ارزیابی</span>
          <img class="w-[26px]" src="@/assets/icons/icon_download_white.svg" alt="download">
        </PrimaryButton>
      </NuxtLink>

      <div class="flex flex-col w-full" v-if="reports.length > 1">
        <div class="flex justify-between items-center w-full mt-12">
          <p class="flex items-center text-[18px] font-bold">
            <FaIcon class="text-mainYellow text-[18px] ml-2" icon="check-double"/>

            آزمون های قدیمی
          </p>

          <p>
            {{ convertJalaliToString(reports[1].date as JalaaliDateObject) }} -
            {{ convertJalaliToString(reports[reports.length - 1].date as JalaaliDateObject) }}
          </p>
        </div>

        <div class="flex flex-col" v-for="(item, index) in reports" :key="item.testId">
          <NuxtLink :to="`/result/${item.testId}`" v-if="index !== 0" class="w-full">
            <PrimaryButton class="flex items-center justify-center mt-5 text-[20px] font-normal">
              دانلود نتیجه {{ convertJalaliToString(item.date as JalaaliDateObject) }}
            </PrimaryButton>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="flex h-full justify-center items-center font-bold" v-else>
      در حال بارگیری...
    </div>

    <ClientOnly>
      <p class="flex items-center text-[18px]">
        کاربر شماره {{ user }}
        <span class="border-r-2 border-white h-[20px] w-[2px] mx-3"></span>
        <a @click="logout" class="hover:text-mainBlue cursor-pointer">خروج از حساب</a>
      </p>
    </ClientOnly>
  </div>
</template>

<style scoped>

</style>