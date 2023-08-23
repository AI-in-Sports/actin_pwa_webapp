<script setup lang="ts">
import {convertJalaliToString} from "~/helper"
import Jalali ,{JalaaliDateObject} from "jalaali-js"

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

let data_error: any = null
let data_success: any = null

if (route.params.session_id)
  await useFetch(`${config.public.EXPRESS_BACKEND}/payment/report/${route.params.session_id}`, {
    headers: {
      "Authorization": `Bearer ${useCookie("token").value}`
    }
  }).then(async (value) => {
    data_error = value.error.value
    data_success = value.data.value

  })

else location.replace("/")

onMounted(async () => {
  const loading = toast.loading("در حال دریافت اطلاعات...", { rtl: true, position: toast.POSITION.TOP_RIGHT })

  if (data_error) {
    console.log(data_error)

    if(data_error.statusCode === 403) {
      useCookie("token").value = null
      location.replace("/report")
    }

    if (data_error.data.status === 404)
      location.replace("/report")

    else if (data_error.data.status === 500)
      useNuxtApp().$showToast.update(loading, {
        render: data_error.data.message,
        type: "error",
        rtl: true,
        autoClose: true,
        closeOnClick: true,
        isLoading: false
      })

    else if (data_error.data.status === 403) {
      useCookie("token").value = null
      location.reload()
    }
  }

  else  {
    if(data_success.status === 200 && data_success.message === "OK")
      isPayed.value = true

    else paymentUrl.value = data_success.url

    isDataFetched.value = true
    toast.clearAll()
  }

  useHead({title: `Actin - ${isPayed.value === false ? 'Payment' : 'Test report'}`})
})
</script>

<template>
  <div class="flex justify-between items-start sm:items-center w-full p-8 pb-0" v-if="data_success">
    <div class="flex flex-col">
      <h3 class="text-[20px] sm:text-[25px] font-black">نتیجه‌ی ارزیابی</h3>
      <p>تاریخ: {{ convertJalaliToString(Jalali.toJalaali(new Date(data_success['date'])) as JalaaliDateObject) }}</p>
      <p>تست تقارن</p>
    </div>

    <img src="@/assets/images/logo.jpg" alt="logo" @click="$router.push('/report')"
         class="h-[50px] sm:h-[70px] w-auto flex-0 flex-shrink-0 cursor-pointer hover:scale-95">
  </div>

  <article class="max-w-[500px] mx-auto w-full flex-1 flex-shrink-0 h-full">
    <section class="flex justify-center items-center h-full" dir="rtl">
      <div v-if="!isDataFetched"></div>

      <PreviewAndDownloadReport v-else-if="isPayed" :report="data_success.report"/>

      <div v-else class="text-center">
        <h3 class="text-[25px] md:text-[30px] font-bold mb-2">
          نتیجه تست {{ convertJalaliToString(Jalali.toJalaali(new Date(data_success['date'])) as JalaaliDateObject) }}
        </h3>
        <p class="text-[16px] md:text-[20px] mb-10">برای دیدن نتیجه ابتدا باید هزینه تست را پرداخت کنید!</p>

        <NuxtLink :to="paymentUrl">
          <PrimaryButton>پرداخت ۲۰،۰۰۰ هزار تومان</PrimaryButton>
        </NuxtLink>
      </div>
    </section>
  </article>
</template>

<style scoped>

</style>