<script setup lang="ts">
definePageMeta({
  layout: "report",
  middleware: ["normal-auth"]
})

const config = useRuntimeConfig()
const route = useRoute()
const toast = useNuxtApp().$showToast
const paymentStatus = ref("")

let data_error: any = null
let data_success: any = null

await useFetch(`${config.public.EXPRESS_BACKEND}/payment/verify`, {
  headers: {
    "Authorization": `Bearer ${useCookie("token").value}`
  },
  params: {
    authority: route.query.Authority
  }
}).then(async (value) => {
  data_error = value.error.value
  data_success = value.data.value
})

useHead({title: paymentStatus.value === "" ? 'Waiting for response...' : (paymentStatus.value === 'valid' ? 'Successful payment' : 'Unsuccessful payment')})

onMounted(async () => {
  const loading = toast.loading("در حال دریافت اطلاعات...", { rtl: true, position: toast.POSITION.TOP_RIGHT })

  if (data_error){
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
  }
  else {
    paymentStatus.value = data_success.message
    toast.clearAll()
  }

  if((route.query.Status === "OK" && paymentStatus.value === "invalid") ||(route.query.Status === "NOK" && paymentStatus.value === "valid"))
    location.replace(`/result/${data_success['report_id']}`)
})
</script>

<template>
  <section dir="rtl" class="flex justify-center items-center h-full" v-if="paymentStatus !== ''">
    <div v-if="paymentStatus === 'valid'" class="w-full text-center">
      <h3 class="text-[20px] md:text-[30px] font-bold mb-10 flex items-center justify-center">
        پرداخت با موفقیت انجام شد!
        <FaIcon icon="circle-check" class="text-mainGreen mr-3 text-[22px] md:text-[30px]"/>
      </h3>

      <NuxtLink :to="`/result/${data_success['report_id']}`">
        <PrimaryButton class="font-normal p-[10px] md:font-bold md:p-[13px]">مشاهده نتیجه تست</PrimaryButton>
      </NuxtLink>
    </div>
    <div v-else class="w-full text-center">
      <h3 class="text-[20px] md:text-[30px] font-bold mb-10 flex items-center justify-center">
        پرداخت با خطا مواجه شد!
        <FaIcon icon="circle-xmark" class="text-mainRed mr-3 text-[22px] md:text-[30px]"/>
      </h3>

      <NuxtLink :to="`/result/${data_success['report_id']}`">
        <PrimaryButton>بازگشت</PrimaryButton>
      </NuxtLink>
    </div>
  </section>
</template>