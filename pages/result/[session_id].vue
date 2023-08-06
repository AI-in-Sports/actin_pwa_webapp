<script setup lang="ts">
import {convertJalaliToString} from "~/helper"
import Jalali ,{JalaaliDateObject} from "jalaali-js"

definePageMeta({
  layout: "report",
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

await useFetch(`${config.public.EXPRESS_BACKEND}/payment/report/${route.params.session_id}`, {
  headers: {
    "Authorization": `Bearer ${useCookie("token").value}`
  }
}).then(async (value) => {
  data_error = value.error.value
  data_success = value.data.value
})

onMounted(async () => {
  const loading = toast.loading("در حال دریافت اطلاعات...", { rtl: true, position: toast.POSITION.TOP_RIGHT })

  if (data_error) {
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
  <section class="flex justify-center items-center h-full" dir="rtl">
    <div v-if="!isDataFetched"></div>

    <div v-else-if="isPayed">
      hiiiii
    </div>
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
</template>

<style scoped>

</style>